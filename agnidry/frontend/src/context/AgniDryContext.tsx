// AgniDry Global State & Simulation Management Provider
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Batch,
  SensorData,
  Alert,
  PackagingRecord,
  Device,
  ThresholdConfig,
  BatchStatus,
  DemoStep
} from '../types';
import {
  PROTOTYPE_DEVICE,
  INITIAL_THRESHOLDS,
  INITIAL_BATCHES,
  INITIAL_PACKAGING_RECORDS,
  INITIAL_ALERTS,
  generateInitialTelemetryHistory,
} from '../mock/mockData';
import { SIH_14_STEP_STORY } from '../mock/demoEngine';
import {
  checkBackendHealth,
  fetchBatchesApi,
  createBatchApi,
  updateBatchStatusApi,
  fetchBatchTelemetryApi,
  fetchLatestTelemetryApi,
  fetchPackagingRecordsApi,
  createPackagingRecordApi,
  fetchAlertsApi,
  createAlertApi,
  acknowledgeAlertApi,
  fetchDeviceStatusApi,
  updateThresholdsApi,
  connectTelemetryWebSocket,
} from '../services/api';

export type DemoScenarioType = 
  | 'FULL_STORY_TOUR' 
  | 'NORMAL_DRYING' 
  | 'TEMP_SURGE' 
  | 'LOW_BATTERY' 
  | 'OFFLINE_MODE';

interface AgniDryContextType {
  // Backend & Device State
  backendConnected: boolean;
  device: Device;
  toggleDeviceOnline: () => void;
  setDeviceStatus: (status: 'ONLINE' | 'OFFLINE' | 'SIMULATED') => void;

  // Sensor Telemetry
  currentSensors: SensorData;
  telemetryHistory: SensorData[];

  // Batches
  batches: Batch[];
  activeBatch: Batch | undefined;
  createBatch: (data: Omit<Batch, 'id' | 'created_at' | 'updated_at'>) => void;
  updateBatchStatus: (batchId: string, newStatus: BatchStatus) => void;
  setActiveBatchId: (batchId: string) => void;

  // Packaging
  packagingRecords: PackagingRecord[];
  addPackagingRecord: (record: Omit<PackagingRecord, 'id'>) => PackagingRecord;

  // Alerts
  alerts: Alert[];
  acknowledgeAlert: (alertId: string) => void;
  triggerAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => void;

  // Configuration
  thresholds: ThresholdConfig;
  updateThresholds: (newConfig: Partial<ThresholdConfig>) => void;

  // SIH Presentation Demo Engine
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  activeScenario: DemoScenarioType;
  selectScenario: (scenario: DemoScenarioType) => void;
  demoStepIndex: number;
  currentDemoStep: DemoStep;
  isDemoPlaying: boolean;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  startDemoTour: () => void;
  pauseDemoTour: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  goToDemoStep: (stepIdx: number) => void;
  resetDemo: () => void;
}

const AgniDryContext = createContext<AgniDryContextType | undefined>(undefined);

export const AgniDryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Backend Connection
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  // Device State
  const [device, setDevice] = useState<Device>(PROTOTYPE_DEVICE);

  // Thresholds
  const [thresholds, setThresholds] = useState<ThresholdConfig>(INITIAL_THRESHOLDS);

  // Batches
  const [batches, setBatches] = useState<Batch[]>(INITIAL_BATCHES);
  const [activeBatchId, setActiveBatchId] = useState<string>('AG-2026-001');

  // Telemetry
  const [telemetryHistory, setTelemetryHistory] = useState<SensorData[]>(generateInitialTelemetryHistory);
  const [currentSensors, setCurrentSensors] = useState<SensorData>(() => {
    const history = generateInitialTelemetryHistory();
    return history[history.length - 1];
  });

  // Packaging & Alerts
  const [packagingRecords, setPackagingRecords] = useState<PackagingRecord[]>(INITIAL_PACKAGING_RECORDS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);

  // Demo Mode State
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [activeScenario, setActiveScenario] = useState<DemoScenarioType>('FULL_STORY_TOUR');
  const [demoStepIndex, setDemoStepIndex] = useState<number>(0);
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const activeBatch = batches.find((b) => b.batch_id === activeBatchId) || batches.find((b) => b.status === 'DRYING');
  const currentDemoStep = SIH_14_STEP_STORY[demoStepIndex];

  // Sync with Backend on Startup & Hook into WebSocket
  useEffect(() => {
    let isMounted = true;
    let ws: WebSocket | null = null;

    async function initBackendSync() {
      const isUp = await checkBackendHealth();
      if (!isMounted) return;
      setBackendConnected(isUp);

      if (isUp) {
        try {
          const [loadedBatches, loadedPkg, loadedAlerts, devStatus, latestTele] = await Promise.all([
            fetchBatchesApi().catch(() => []),
            fetchPackagingRecordsApi().catch(() => []),
            fetchAlertsApi().catch(() => []),
            fetchDeviceStatusApi().catch(() => null),
            fetchLatestTelemetryApi().catch(() => null),
          ]);

          if (!isMounted) return;
          if (loadedBatches && loadedBatches.length > 0) setBatches(loadedBatches);
          if (loadedPkg && loadedPkg.length > 0) setPackagingRecords(loadedPkg);
          if (loadedAlerts && loadedAlerts.length > 0) setAlerts(loadedAlerts);
          if (devStatus) setDevice((prev) => ({ ...prev, ...devStatus }));
          if (latestTele) setCurrentSensors(latestTele);

          // Fetch historical telemetry for initial chart
          const hist = await fetchBatchTelemetryApi('AG-2026-001').catch(() => []);
          if (isMounted && hist.length > 0) {
            setTelemetryHistory(hist);
          }

          // Connect WebSocket for live push updates
          ws = connectTelemetryWebSocket(
            (msg) => {
              if (!isMounted) return;
              if (msg.type === 'LIVE_TELEMETRY' && msg.data) {
                const sData: SensorData = { ...msg.data, id: String(msg.data.id) };
                setCurrentSensors(sData);
                setTelemetryHistory((h) => [...h.slice(-29), sData]);
              } else if (
                msg.type === 'BATCH_CREATED' ||
                msg.type === 'BATCH_STATUS_UPDATED' ||
                msg.type === 'BATCH_UPDATED'
              ) {
                fetchBatchesApi()
                  .then((b) => {
                    if (isMounted && b.length > 0) setBatches(b);
                  })
                  .catch(() => {});
              } else if (msg.type === 'PACKAGING_RECORD_CREATED') {
                fetchPackagingRecordsApi()
                  .then((p) => {
                    if (isMounted && p.length > 0) setPackagingRecords(p);
                  })
                  .catch(() => {});
              } else if (msg.type === 'ALERT_TRIGGERED' || msg.type === 'ALERT_ACKNOWLEDGED') {
                fetchAlertsApi()
                  .then((a) => {
                    if (isMounted && a.length > 0) setAlerts(a);
                  })
                  .catch(() => {});
              }
            },
            (connected) => {
              if (isMounted) setBackendConnected(connected);
            }
          );
        } catch (err) {
          console.warn('Backend sync warning, operating in local fallback mode:', err);
        }
      }
    }

    initBackendSync();

    return () => {
      isMounted = false;
      if (ws) ws.close();
    };
  }, []);

  // Toggle Device Online/Offline
  const toggleDeviceOnline = useCallback(() => {
    setDevice((prev) => {
      const nextStatus = prev.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
      if (nextStatus === 'OFFLINE') {
        setAlerts((a) => [
          {
            id: `alt_${Date.now()}`,
            alert_id: `ALT-${Date.now().toString().slice(-4)}`,
            device_id: prev.device_id,
            type: 'DEVICE_OFFLINE',
            severity: 'WARNING',
            message: 'ESP32 Wi-Fi connection lost. Autonomous local safety controls remain active.',
            timestamp: new Date().toISOString(),
            acknowledged: false,
          },
          ...a,
        ]);
      }
      return {
        ...prev,
        status: nextStatus,
        last_seen: new Date().toISOString(),
      };
    });
  }, []);

  const setDeviceStatus = useCallback((status: 'ONLINE' | 'OFFLINE' | 'SIMULATED') => {
    setDevice((prev) => ({ ...prev, status, last_seen: new Date().toISOString() }));
  }, []);

  // Batch Handlers
  const createBatch = useCallback((data: Omit<Batch, 'id' | 'created_at' | 'updated_at'>) => {
    const newBatch: Batch = {
      ...data,
      id: `batch_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setBatches((prev) => [newBatch, ...prev]);
    setActiveBatchId(newBatch.batch_id);

    // Asynchronously persist to backend if online
    createBatchApi({
      batch_id: newBatch.batch_id,
      device_id: newBatch.device_id,
      product_type: newBatch.product_type,
      initial_weight: newBatch.initial_weight,
      current_weight: newBatch.current_weight,
      target_moisture_loss_pct: newBatch.target_moisture_loss_pct,
      notes: newBatch.notes,
      status: newBatch.status,
    }).catch((err) => console.warn('Could not persist batch to backend:', err));
  }, []);

  const updateBatchStatus = useCallback((batchId: string, newStatus: BatchStatus) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.batch_id === batchId) {
          const isComplete = newStatus === 'COMPLETED';
          return {
            ...b,
            status: newStatus,
            end_time: isComplete ? new Date().toISOString() : b.end_time,
            final_weight: isComplete ? b.current_weight : b.final_weight,
            updated_at: new Date().toISOString(),
          };
        }
        return b;
      })
    );

    updateBatchStatusApi(batchId, newStatus).catch((err) =>
      console.warn('Could not persist batch status to backend:', err)
    );
  }, []);

  // Packaging Handlers
  const addPackagingRecord = useCallback((record: Omit<PackagingRecord, 'id'>) => {
    const newRecord: PackagingRecord = {
      ...record,
      id: `pkg_${Date.now()}`,
    };
    setPackagingRecords((prev) => [newRecord, ...prev]);

    createPackagingRecordApi(record).catch((err) =>
      console.warn('Could not persist packaging record to backend:', err)
    );
    return newRecord;
  }, []);

  // Alert Handlers
  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId || a.alert_id === alertId ? { ...a, acknowledged: true } : a))
    );

    acknowledgeAlertApi(alertId).catch((err) =>
      console.warn('Could not acknowledge alert on backend:', err)
    );
  }, []);

  const triggerAlert = useCallback((alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => {
    const newAlert: Alert = {
      ...alert,
      id: `alt_${Date.now()}`,
      timestamp: new Date().toISOString(),
      acknowledged: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);

    createAlertApi(alert).catch((err) =>
      console.warn('Could not persist alert to backend:', err)
    );
  }, []);

  // Thresholds
  const updateThresholds = useCallback((newConfig: Partial<ThresholdConfig>) => {
    setThresholds((prev) => ({ ...prev, ...newConfig }));
    updateThresholdsApi(newConfig).catch((err) =>
      console.warn('Could not update thresholds on backend:', err)
    );
  }, []);

  // Apply a specific demo step
  const applyDemoStep = useCallback((stepIdx: number) => {
    const step = SIH_14_STEP_STORY[stepIdx];
    if (!step) return;

    setDemoStepIndex(stepIdx);

    // Apply sensor snapshot
    setCurrentSensors((prev) => {
      const updated: SensorData = {
        ...prev,
        ...step.sensorSnapshot,
        timestamp: new Date().toISOString(),
      };

      // Add to telemetry history for smooth chart reflection
      setTelemetryHistory((hist) => {
        const next = [...hist, updated];
        return next.slice(-30);
      });

      return updated;
    });

    // If step triggers an alert
    if (step.alertTrigger) {
      setAlerts((prev) => {
        if (prev.some((a) => a.alert_id === step.alertTrigger?.alert_id)) return prev;
        return [step.alertTrigger!, ...prev];
      });
    }

    // If step triggers packaging
    if (step.packagingTrigger) {
      const trigger = step.packagingTrigger;
      setPackagingRecords((prev) => {
        if (prev.some((p) => p.package_id === trigger.package_id)) return prev;
        const completeRecord: PackagingRecord = {
          id: `pkg_${Date.now()}`,
          package_id: trigger.package_id || `PKG-2026-${Date.now().toString().slice(-3)}`,
          batch_id: trigger.batch_id || 'AG-2026-001',
          product_name: 'Mogra Agarbatti (Classic Floral)',
          package_type: trigger.package_type || 'BOX_100G',
          quantity: trigger.quantity || 50,
          package_weight: trigger.package_weight || 100,
          material: 'Airtight Recycled Kraft Box',
          seal_status: trigger.seal_status || 'SUCCESS',
          start_time: new Date(Date.now() - 60000).toISOString(),
          completion_time: new Date().toISOString(),
          notes: trigger.notes || 'SIH automated demonstration seal.',
          artisan_name: trigger.artisan_name || 'Lakshmi Devi',
        };
        return [completeRecord, ...prev];
      });
    }

    // Update active batch status if step requests
    if (step.batchStatus) {
      setBatches((prev) =>
        prev.map((b) => (b.batch_id === 'AG-2026-001' ? { ...b, status: step.batchStatus! } : b))
      );
    }
  }, []);

  // Demo Controls
  const startDemoTour = useCallback(() => {
    setIsDemoPlaying(true);
  }, []);

  const pauseDemoTour = useCallback(() => {
    setIsDemoPlaying(false);
  }, []);

  const nextDemoStep = useCallback(() => {
    const nextIdx = (demoStepIndex + 1) % SIH_14_STEP_STORY.length;
    applyDemoStep(nextIdx);
  }, [demoStepIndex, applyDemoStep]);

  const prevDemoStep = useCallback(() => {
    const prevIdx = (demoStepIndex - 1 + SIH_14_STEP_STORY.length) % SIH_14_STEP_STORY.length;
    applyDemoStep(prevIdx);
  }, [demoStepIndex, applyDemoStep]);

  const goToDemoStep = useCallback((stepIdx: number) => {
    if (stepIdx >= 0 && stepIdx < SIH_14_STEP_STORY.length) {
      applyDemoStep(stepIdx);
    }
  }, [applyDemoStep]);

  const resetDemo = useCallback(() => {
    setIsDemoPlaying(false);
    setDemoStepIndex(0);
    setBatches(INITIAL_BATCHES);
    setTelemetryHistory(generateInitialTelemetryHistory());
    setAlerts(INITIAL_ALERTS);
    setPackagingRecords(INITIAL_PACKAGING_RECORDS);
    setDevice(PROTOTYPE_DEVICE);
    const initialHist = generateInitialTelemetryHistory();
    setCurrentSensors(initialHist[initialHist.length - 1]);
  }, []);

  const selectScenario = useCallback((scenario: DemoScenarioType) => {
    setActiveScenario(scenario);
    if (scenario === 'OFFLINE_MODE') {
      setDeviceStatus('OFFLINE');
    } else if (scenario === 'TEMP_SURGE') {
      setDeviceStatus('ONLINE');
      setCurrentSensors((prev) => ({
        ...prev,
        temperature: 53.4,
        fan_status: true,
        vent_status: true,
        heater_status: false,
      }));
      setAlerts((a) => [
        {
          id: `alt_${Date.now()}`,
          alert_id: 'ALT-SURGE',
          device_id: 'AGNI-001',
          type: 'HIGH_TEMPERATURE',
          severity: 'CRITICAL',
          message: 'Chamber temperature reached 53.4°C! Autonomous cooling vents opened.',
          timestamp: new Date().toISOString(),
          acknowledged: false,
        },
        ...a,
      ]);
    } else if (scenario === 'LOW_BATTERY') {
      setDeviceStatus('ONLINE');
      setCurrentSensors((prev) => ({
        ...prev,
        battery_percentage: 18,
        battery_voltage: 11.4,
        solar_status: false,
        heater_status: false,
      }));
      setAlerts((a) => [
        {
          id: `alt_${Date.now()}`,
          alert_id: 'ALT-BATTLOW',
          device_id: 'AGNI-001',
          type: 'LOW_BATTERY',
          severity: 'WARNING',
          message: 'Battery dropped below 20%. Auxiliary electric heating disabled to protect cell life.',
          timestamp: new Date().toISOString(),
          acknowledged: false,
        },
        ...a,
      ]);
    } else if (scenario === 'NORMAL_DRYING') {
      setDeviceStatus('ONLINE');
      applyDemoStep(5);
    } else {
      setDeviceStatus('ONLINE');
      applyDemoStep(0);
    }
  }, [setDeviceStatus, applyDemoStep]);

  // Demo Tour Interval Timer
  useEffect(() => {
    if (!isDemoPlaying) return;
    const intervalMs = Math.max(1000, 4000 / playbackSpeed);

    const timer = setInterval(() => {
      setDemoStepIndex((prev) => {
        const next = prev + 1;
        if (next >= SIH_14_STEP_STORY.length) {
          setIsDemoPlaying(false);
          return prev;
        }
        applyDemoStep(next);
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isDemoPlaying, playbackSpeed, applyDemoStep]);

  return (
    <AgniDryContext.Provider
      value={{
        backendConnected,
        device,
        toggleDeviceOnline,
        setDeviceStatus,
        currentSensors,
        telemetryHistory,
        batches,
        activeBatch,
        createBatch,
        updateBatchStatus,
        setActiveBatchId,
        packagingRecords,
        addPackagingRecord,
        alerts,
        acknowledgeAlert,
        triggerAlert,
        thresholds,
        updateThresholds,
        isDemoMode,
        setIsDemoMode,
        activeScenario,
        selectScenario,
        demoStepIndex,
        currentDemoStep,
        isDemoPlaying,
        playbackSpeed,
        setPlaybackSpeed,
        startDemoTour,
        pauseDemoTour,
        nextDemoStep,
        prevDemoStep,
        goToDemoStep,
        resetDemo,
      }}
    >
      {children}
    </AgniDryContext.Provider>
  );
};

export const useAgniDry = (): AgniDryContextType => {
  const context = useContext(AgniDryContext);
  if (!context) {
    throw new Error('useAgniDry must be used within an AgniDryProvider');
  }
  return context;
};
