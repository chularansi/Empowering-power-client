export interface Consumption {
  device_id: number;
  name: string;
  kwh: number;
  used_at?: Date;
  isPeak?: boolean;
}
