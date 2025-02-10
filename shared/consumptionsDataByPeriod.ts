import { Consumption } from '@/types/consumption';
import moment from 'moment';

const getConsumptionObject = (
  device_id: number,
  name: string,
  kwh: number,
  peak = false
): Consumption => {
  return {
    device_id,
    name,
    kwh,
    isPeak: peak,
  };
};

const isPeakHours = (item: Consumption, date: Date) => {
  const morningStartTime = moment(date.toDateString()).set({
    hour: 6,
    minute: 59,
    second: 59,
    millisecond: 0,
  });
  const morningEndTime = moment(date.toDateString()).set({
    hour: 11,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const eveningStartTime = moment(date.toDateString()).set({
    hour: 15,
    minute: 59,
    second: 59,
    millisecond: 0,
  });
  const eveningEndTime = moment(date.toDateString()).set({
    hour: 21,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  return (
    (moment(item.used_at!) > morningStartTime &&
      moment(item.used_at!) < morningEndTime) ||
    (moment(item.used_at!) > eveningStartTime &&
      moment(item.used_at!) < eveningEndTime)
  );
};

const processFilteredData = (data: Consumption[], date: Date) => {
  // Assume that peak hours in the morning session from 07 to 11 and in the evening session from 16 to 21

  let processedData = [];
  // For all hours
  let fridgeKwh = 0;
  let ovenKwh = 0;
  let lightsKwh = 0;
  let evChargerKwh = 0;
  // For peak hours
  let fridgeKwhPH = 0;
  let ovenKwhPH = 0;
  let lightsKwhPH = 0;
  let evChargerKwhPH = 0;

  data.forEach((item) => {
    if (item.name === 'Fridge') {
      fridgeKwh += Number(item.kwh);

      if (isPeakHours(item, date)) {
        fridgeKwhPH += Number(item.kwh);
      }
    }
    if (item.name === 'Oven') {
      ovenKwh += Number(item.kwh);

      if (isPeakHours(item, date)) {
        ovenKwhPH += Number(item.kwh);
      }
    }
    if (item.name === 'Lights') {
      lightsKwh += Number(item.kwh);

      if (isPeakHours(item, date)) {
        lightsKwhPH += Number(item.kwh);
      }
    }
    if (item.name === 'EV Charger') {
      evChargerKwh += Number(item.kwh);

      if (isPeakHours(item, date)) {
        evChargerKwhPH += Number(item.kwh);
      }
    }
  });

  const fridge = getConsumptionObject(1, 'Fridge', fridgeKwh);
  const fridgePH = getConsumptionObject(1, 'Fridge', fridgeKwhPH, true);
  const oven = getConsumptionObject(2, 'Oven', ovenKwh);
  const ovenPH = getConsumptionObject(2, 'Oven', ovenKwhPH, true);
  const lights = getConsumptionObject(3, 'Lights', lightsKwh);
  const lightsPH = getConsumptionObject(3, 'Lights', lightsKwhPH, true);
  const evCharger = getConsumptionObject(4, 'EV', evChargerKwh);
  const evChargerPH = getConsumptionObject(4, 'EV', evChargerKwhPH, true);

  processedData.push(
    fridge,
    fridgePH,
    evCharger,
    evChargerPH,
    oven,
    ovenPH,
    lights,
    lightsPH
  );
  return processedData;
};

const getConsumptionsByPeriod = (
  data: Consumption[],
  periodType: string,
  date: Date
) => {
  if (periodType === 'Daily') {
    const dailyData = data.filter((c) => {
      const usedAt = moment(c.used_at!).format('YYYY-MM-DD');
      const current = moment(date.toDateString()).format('YYYY-MM-DD');
      return c.used_at && usedAt === current;
    });

    return processFilteredData(dailyData, date);
  }

  if (periodType === 'Weekly') {
    const current = moment(date.toDateString());
    const monday = current.clone().weekday(1);
    const sunday = current.clone().weekday(7);

    const weeklyData = data.filter((c) => {
      const usedAt = moment(c.used_at);
      const isUsedAtBetweenWeekRange = usedAt.isBetween(
        monday,
        sunday,
        null,
        '[]'
      );

      return (
        c.used_at &&
        isUsedAtBetweenWeekRange &&
        current.month() === monday.month() &&
        current.month() === sunday.month()
      );
    });
    return processFilteredData(weeklyData, date);
  }

  if (periodType === 'Monthly') {
    const monthlyData = data.filter((c) => {
      const current = moment(date.toDateString());
      const usedAt = moment(c.used_at);
      return (
        c.used_at &&
        current.month() === usedAt.month() &&
        current.year() === usedAt.year()
      );
    });

    return processFilteredData(monthlyData, date);
  }
};

export default getConsumptionsByPeriod;
