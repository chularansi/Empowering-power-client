import { Consumption } from '@/types/consumption';
import { Summary } from '@/types/summary';

const processSummaryData = (summaryData: Consumption[]) => {
  let summaryDataArr: Summary[] = [];

  const fridgePeakObj = getSummary(summaryData, 'Fridge');
  const ovenPeakObj = getSummary(summaryData, 'Oven');
  const lightsPeakObj = getSummary(summaryData, 'Lights');
  const evPeakObj = getSummary(summaryData, 'EV');

  summaryDataArr.push(fridgePeakObj, ovenPeakObj, lightsPeakObj, evPeakObj);

  return summaryDataArr;
};

const getSummary = (data: Consumption[], itemName: string): Summary => {
  const total = data
    .filter(({ name }) => name === itemName)
    .reduce((sum, item) => sum + item.kwh, 0);

  const totalPH = data
    .filter(({ name, isPeak }) => name === itemName && isPeak)
    .reduce((sum, item) => sum + item.kwh, 0);

  const peakPercent = Math.floor((totalPH / total) * 100);

  return {
    name: itemName,
    percent: peakPercent ? peakPercent : 0,
  };
};

export default processSummaryData;
