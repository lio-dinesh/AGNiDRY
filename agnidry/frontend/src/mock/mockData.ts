// Pre-seeded Realistic Mock Data for AgniDry Prototype (SIH 2026)
import { Batch, SensorData, Alert, PackagingRecord, Device, ThresholdConfig } from '../types';

export const PROTOTYPE_DEVICE: Device = {
  id: 'dev_01',
  device_id: 'AGNI-001',
  device_name: 'AgniDry Smart Solar Unit #1',
  firmware_version: 'v1.0.4-proto (ESP32-S3)',
  status: 'ONLINE',
  last_seen: new Date().toISOString(),
  local_ip: '192.168.4.1 (ESP-SoftAP / Mesh)',
  chamber_volume_liters: 120,
};

export const INITIAL_THRESHOLDS: ThresholdConfig = {
  maxSafeTemp: 52.0, // °C (excessive heat ruins essential oils/fragrance)
  targetDryingTemp: 46.0, // °C
  maxHumidityVentThreshold: 65.0, // % RH
  minBatteryCutoff: 20.0, // %
};

export const INITIAL_BATCHES: Batch[] = [
  {
    id: 'b1',
    batch_id: 'AG-2026-001',
    device_id: 'AGNI-001',
    product_type: 'Mogra Agarbatti (Classic Floral)',
    initial_weight: 2.00,
    current_weight: 1.28,
    final_weight: null,
    start_time: new Date(Date.now() - 2 * 3600 * 1000 - 15 * 60 * 1000).toISOString(),
    end_time: null,
    duration: '2h 15m',
    status: 'DRYING',
    notes: 'Rolled by Artisan Lakshmi. Enclosed solar rack 1 loaded.',
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    target_moisture_loss_pct: 36.0,
  },
  {
    id: 'b2',
    batch_id: 'AG-2026-002',
    device_id: 'AGNI-001',
    product_type: 'Sandalwood Premium Agarbatti',
    initial_weight: 2.50,
    current_weight: 1.55,
    final_weight: 1.55,
    start_time: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    end_time: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    duration: '4h 00m',
    status: 'COMPLETED',
    notes: 'Fragrance retention verified. Sticks straight and crisp.',
    created_at: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    target_moisture_loss_pct: 38.0,
  },
  {
    id: 'b3',
    batch_id: 'AG-2026-003',
    device_id: 'AGNI-001',
    product_type: 'Rose Petal Agarbatti',
    initial_weight: 1.80,
    current_weight: 1.80,
    final_weight: null,
    start_time: new Date().toISOString(),
    end_time: null,
    duration: '0m',
    status: 'READY',
    notes: 'Dough pre-conditioned. Waiting on solar chamber tray 2.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    target_moisture_loss_pct: 35.0,
  },
  {
    id: 'b4',
    batch_id: 'AG-2026-004',
    device_id: 'AGNI-001',
    product_type: 'Natural Sambrani Dhoop Sticks',
    initial_weight: 3.00,
    current_weight: 1.90,
    final_weight: 1.90,
    start_time: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    end_time: new Date(Date.now() - 19 * 3600 * 1000).toISOString(),
    duration: '5h 00m',
    status: 'COMPLETED',
    notes: 'Solid charcoal-free binder drying completed.',
    created_at: new Date(Date.now() - 25 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 19 * 3600 * 1000).toISOString(),
    target_moisture_loss_pct: 36.6,
  }
];

// 20-point historical telemetry series representing drying progress of AG-2026-001
export function generateInitialTelemetryHistory(): SensorData[] {
  const points: SensorData[] = [];
  const totalMinutes = 135; // 2h 15m
  const step = 7; // every 7 mins

  for (let m = 0; m <= totalMinutes; m += step) {
    const timestamp = new Date(Date.now() - (totalMinutes - m) * 60 * 1000).toISOString();
    const progressRatio = m / totalMinutes;

    // Weight decreases smoothly from 2.00 to 1.28 kg
    const weight = +(2.00 - (2.00 - 1.28) * Math.pow(progressRatio, 0.9)).toFixed(2);

    // Temperature rises from ambient 32°C up to ~46-48°C
    const temperature = +(32 + 15 * Math.sin((progressRatio * Math.PI) / 2) + (Math.random() * 0.8 - 0.4)).toFixed(1);

    // Humidity starts at 74%, briefly rises to 78% as chamber heats, then drops to 41%
    const humidity = +(74 - 33 * Math.pow(progressRatio, 1.2) + (Math.random() * 1.2 - 0.6)).toFixed(1);

    // Battery discharges slightly from 85% to 78%
    const battery_percentage = Math.round(85 - 7 * progressRatio);
    const battery_voltage = +(12.7 - 0.4 * progressRatio).toFixed(1);

    points.push({
      id: `tel_${m}`,
      device_id: 'AGNI-001',
      batch_id: 'AG-2026-001',
      timestamp,
      temperature,
      humidity,
      weight,
      battery_voltage,
      battery_percentage,
      solar_status: true,
      fan_status: m > 15,
      heater_status: temperature < 38,
      vent_status: humidity > 60,
    });
  }

  return points;
}

export const INITIAL_PACKAGING_RECORDS: PackagingRecord[] = [
  {
    id: 'pkg_1',
    package_id: 'PKG-2026-001',
    batch_id: 'AG-2026-002',
    product_name: 'Sandalwood Premium Agarbatti',
    package_type: 'BOX_100G',
    quantity: 50,
    package_weight: 102,
    material: 'Recycled Kraft Outer Box',
    seal_status: 'SUCCESS',
    start_time: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    completion_time: new Date(Date.now() - 3 * 3600 * 1000 + 45000).toISOString(),
    notes: 'Clean impulse heat seal (2.2s dwell time at 145°C).',
    artisan_name: 'Lakshmi Devi',
  },
  {
    id: 'pkg_2',
    package_id: 'PKG-2026-002',
    batch_id: 'AG-2026-002',
    product_name: 'Sandalwood Premium Agarbatti',
    package_type: 'POUCH_50G',
    quantity: 25,
    package_weight: 51,
    material: 'Bio-Polymer Moisture Barrier Pouch',
    seal_status: 'SUCCESS',
    start_time: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    completion_time: new Date(Date.now() - 2 * 3600 * 1000 + 38000).toISOString(),
    notes: 'Airtight packaging verified.',
    artisan_name: 'Lakshmi Devi',
  },
  {
    id: 'pkg_3',
    package_id: 'PKG-2026-003',
    batch_id: 'AG-2026-004',
    product_name: 'Natural Sambrani Dhoop Sticks',
    package_type: 'BUNDLE_250G',
    quantity: 120,
    package_weight: 254,
    material: 'Eco-Craft Paper Sleeve',
    seal_status: 'SUCCESS',
    start_time: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    completion_time: new Date(Date.now() - 18 * 3600 * 1000 + 50000).toISOString(),
    notes: 'Direct bulk retail pack for village co-op.',
    artisan_name: 'Radha Bai',
  }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alt_1',
    alert_id: 'ALT-2026-101',
    device_id: 'AGNI-001',
    batch_id: 'AG-2026-001',
    type: 'HIGH_HUMIDITY',
    severity: 'WARNING',
    message: 'Chamber relative humidity peaked at 76.5% during initial warm-up. Exhaust fan and top vent engaged.',
    timestamp: new Date(Date.now() - 100 * 60 * 1000).toISOString(),
    acknowledged: true,
  },
  {
    id: 'alt_2',
    alert_id: 'ALT-2026-102',
    device_id: 'AGNI-001',
    batch_id: 'AG-2026-001',
    type: 'DOOR_OPEN',
    severity: 'INFO',
    message: 'Chamber door opened briefly for artisan visual stick inspection (42 seconds).',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    acknowledged: true,
  }
];
