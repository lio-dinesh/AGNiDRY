// AgniDry Core Types (Phase 1)

export type BatchStatus = 'READY' | 'DRYING' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface Batch {
  id: string;
  batch_id: string;
  device_id: string;
  product_type: string;
  initial_weight: number; // in kg
  current_weight: number; // in kg
  final_weight: number | null; // in kg
  start_time: string;
  end_time: string | null;
  duration: string;
  status: BatchStatus;
  notes: string;
  created_at: string;
  updated_at: string;
  target_moisture_loss_pct?: number; // Target weight drop (e.g. 35-40% for typical agarbatti dough)
}

export interface SensorData {
  id: string;
  device_id: string;
  batch_id: string;
  timestamp: string;
  temperature: number; // in °C
  humidity: number; // in % RH
  weight: number; // in kg
  battery_voltage: number; // in V
  battery_percentage: number; // in %
  solar_status: boolean; // true = generating, false = dark/shaded
  fan_status: boolean; // true = running
  heater_status: boolean; // true = auxiliary heater ON
  vent_status: boolean; // true = exhaust vent OPEN
}

export type AlertType = 
  | 'HIGH_TEMPERATURE'
  | 'HIGH_HUMIDITY'
  | 'LOW_BATTERY'
  | 'SENSOR_DISCONNECTED'
  | 'DOOR_OPEN'
  | 'FAN_FAILURE'
  | 'HEATER_FAILURE'
  | 'DEVICE_OFFLINE'
  | 'INTERNET_DISCONNECTED';

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface Alert {
  id: string;
  alert_id: string;
  device_id: string;
  batch_id?: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export type PackageType = 'POUCH_50G' | 'BOX_100G' | 'BUNDLE_250G' | 'BULK_1KG';
export type SealStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface PackagingRecord {
  id: string;
  package_id: string;
  batch_id: string;
  product_name: string;
  package_type: PackageType;
  quantity: number; // count of sticks or units
  package_weight: number; // in grams
  material: string;
  seal_status: SealStatus;
  start_time: string;
  completion_time: string;
  notes: string;
  artisan_name: string;
}

export interface Device {
  id: string;
  device_id: string;
  device_name: string;
  firmware_version: string;
  status: 'ONLINE' | 'OFFLINE' | 'SIMULATED';
  last_seen: string;
  local_ip: string;
  chamber_volume_liters?: number;
}

export interface SystemEvent {
  id: string;
  device_id: string;
  event_type: string;
  message: string;
  timestamp: string;
}

export type HonestyTagType = 'FACT' | 'ASSUMPTION' | 'PROTOTYPE CONFIGURATION' | 'DEMO DATA' | 'RESEARCH REQUIRED';

export interface DemoStep {
  stepNumber: number;
  title: string;
  description: string;
  storyPhase: 'PROBLEM' | 'INPUT' | 'MONITORING' | 'CONTROL' | 'DRYING' | 'COMPLETION' | 'PACKAGING' | 'TRACEABILITY' | 'BENEFIT';
  sensorSnapshot: Partial<SensorData>;
  batchStatus?: BatchStatus;
  alertTrigger?: Alert;
  packagingTrigger?: Partial<PackagingRecord>;
}

export interface ThresholdConfig {
  maxSafeTemp: number; // default 52°C
  targetDryingTemp: number; // default 46°C
  maxHumidityVentThreshold: number; // default 65%
  minBatteryCutoff: number; // default 20%
}
