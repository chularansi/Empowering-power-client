import { Consumption } from '@/types/consumption';

const processData = (data: Consumption[]) => {
  console.log('DATA: ', data);
  const barData = data.map((item) => ({
    label: item.name,
    value: Math.floor(item.kwh),
    frontColor: item.isPeak ? '#ff0000' : '#ff9500',
    gradientColor: item.isPeak ? '#ffab00' : '#ffd400',
  }));

  return barData;
};

export default processData;
