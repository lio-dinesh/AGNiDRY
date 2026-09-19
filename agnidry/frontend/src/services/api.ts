// AgniDry Frontend API & WebSocket Service Layer
// Connects to local-first FastAPI backend with graceful fallback if offline

import { Batch, SensorData, Alert, PackagingRecord, Device, ThresholdConfig } from '../types';

const RAW_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/+$/, '') || 'http://localhost:8000';
export const API_BASE = RAW_BASE.endsWith('/api') ? RAW_BASE : `${RAW_BASE}/api`;

const DEFAULT_WS = RAW_BASE.startsWith('https://')
  ? RAW_BASE.replace('https://', 'wss://').replace(/\/api$/, '') + '/ws/telemetry'
  : RAW_BASE.startsWith('http://')
  ? RAW_BASE.replace('http://', 'ws://').replace(/\/api$/, '') + '/ws/telemetry'
  : 'ws://localhost:8000/ws/telemetry';

export const WS_BASE = (import.meta.env.VITE_WS_BASE as string | undefined) || DEFAULT_WS;

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const healthUrl = `${RAW_BASE.replace(/\/api$/, '')}/health`;
    const res = await fetch(healthUrl, { method: 'GET', signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}

// BATCHES
export async function fetchBatchesApi(status?: string): Promise<Batch[]> {
  const url = status && status !== 'ALL' ? `${API_BASE}/batches?status=${status}` : `${API_BASE}/batches`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch batches: ${res.statusText}`);
  return await res.json();
}

export async function createBatchApi(batchData: {
  batch_id?: string;
  device_id?: string;
  product_type: string;
  initial_weight: number;
  current_weight?: number;
  target_moisture_loss_pct?: number;
  notes?: string;
  status?: string;
}): Promise<Batch> {
  const res = await fetch(`${API_BASE}/batches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(batchData),
  });
  if (!res.ok) throw new Error(`Failed to create batch: ${res.statusText}`);
  return await res.json();
}

export async function updateBatchStatusApi(batchId: string, status: string): Promise<Batch> {
  const res = await fetch(`${API_BASE}/batches/${batchId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`Failed to update batch status: ${res.statusText}`);
  return await res.json();
}

export async function updateBatchApi(batchId: string, updates: Partial<Batch>): Promise<Batch> {
  const res = await fetch(`${API_BASE}/batches/${batchId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error(`Failed to update batch: ${res.statusText}`);
  return await res.json();
}

// TELEMETRY
export async function fetchBatchTelemetryApi(batchId: string, limit = 200): Promise<SensorData[]> {
  const res = await fetch(`${API_BASE}/telemetry/${batchId}?limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch telemetry: ${res.statusText}`);
  const data = await res.json();
  return data.map((d: any) => ({
    ...d,
    id: String(d.id),
  }));
}

export async function fetchLatestTelemetryApi(): Promise<SensorData | null> {
  const res = await fetch(`${API_BASE}/telemetry/latest`);
  if (!res.ok) return null;
  const data = await res.json();
  if (!data) return null;
  return { ...data, id: String(data.id) };
}

export async function submitTelemetryApi(telemetry: Partial<SensorData>): Promise<SensorData> {
  const res = await fetch(`${API_BASE}/telemetry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(telemetry),
  });
  if (!res.ok) throw new Error(`Failed to submit telemetry: ${res.statusText}`);
  return await res.json();
}

// PACKAGING
export async function fetchPackagingRecordsApi(batchId?: string): Promise<PackagingRecord[]> {
  const url = batchId ? `${API_BASE}/packaging?batch_id=${batchId}` : `${API_BASE}/packaging`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch packaging records: ${res.statusText}`);
  const data = await res.json();
  return data.map((d: any) => ({
    ...d,
    id: String(d.id),
  }));
}

export async function createPackagingRecordApi(record: Omit<PackagingRecord, 'id'>): Promise<PackagingRecord> {
  const res = await fetch(`${API_BASE}/packaging`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error(`Failed to create packaging record: ${res.statusText}`);
  const data = await res.json();
  return { ...data, id: String(data.id) };
}

// ALERTS
export async function fetchAlertsApi(): Promise<Alert[]> {
  const res = await fetch(`${API_BASE}/alerts`);
  if (!res.ok) throw new Error(`Failed to fetch alerts: ${res.statusText}`);
  const data = await res.json();
  return data.map((d: any) => ({
    ...d,
    id: String(d.id),
  }));
}

export async function createAlertApi(alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>): Promise<Alert> {
  const res = await fetch(`${API_BASE}/alerts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alert),
  });
  if (!res.ok) throw new Error(`Failed to create alert: ${res.statusText}`);
  const data = await res.json();
  return { ...data, id: String(data.id) };
}

export async function acknowledgeAlertApi(alertId: string): Promise<Alert> {
  const res = await fetch(`${API_BASE}/alerts/${alertId}/acknowledge`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error(`Failed to acknowledge alert: ${res.statusText}`);
  const data = await res.json();
  return { ...data, id: String(data.id) };
}

// DEVICE & THRESHOLDS
export async function fetchDeviceStatusApi(): Promise<Device> {
  const res = await fetch(`${API_BASE}/device/status`);
  if (!res.ok) throw new Error(`Failed to fetch device status: ${res.statusText}`);
  const data = await res.json();
  return {
    id: data.device_id,
    device_id: data.device_id,
    device_name: data.device_name,
    firmware_version: data.firmware_version,
    status: data.status,
    last_seen: data.last_seen,
    local_ip: '192.168.4.1 (ESP32-AP)',
    chamber_volume_liters: 120,
  };
}

export async function updateThresholdsApi(thresholds: Partial<ThresholdConfig>): Promise<void> {
  await fetch(`${API_BASE}/device/thresholds`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      max_temperature: thresholds.maxSafeTemp,
      target_humidity: thresholds.targetDryingTemp,
      min_battery_voltage: thresholds.minBatteryCutoff ? thresholds.minBatteryCutoff / 10 : undefined,
    }),
  });
}

// WEBSOCKET TELEMETRY
export function connectTelemetryWebSocket(
  onMessage: (msg: any) => void,
  onStatusChange?: (connected: boolean) => void
): WebSocket | null {
  try {
    const ws = new WebSocket(WS_BASE);

    ws.onopen = () => {
      if (onStatusChange) onStatusChange(true);
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        onMessage(parsed);
      } catch {
        // ignore non-json
      }
    };

    ws.onclose = () => {
      if (onStatusChange) onStatusChange(false);
    };

    ws.onerror = () => {
      if (onStatusChange) onStatusChange(false);
    };

    return ws;
  } catch {
    if (onStatusChange) onStatusChange(false);
    return null;
  }
}
