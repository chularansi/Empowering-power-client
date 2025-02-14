import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { SymbolView } from 'expo-symbols';
import Card from '@/components/Card';
import { barDataItem } from 'react-native-gifted-charts';
import ConsumptionChart from '@/components/ConsumptionChart';
import { Consumption } from '@/types/consumption';
import getConsumptionsByPeriod from '@/shared/consumptionsDataByPeriod';
import processData from '@/shared/processData';
import moment from 'moment';
import Ionicons from '@expo/vector-icons/Ionicons';
import processSummaryData from '@/shared/processSummaryData';

const index = () => {
  const baseUrl = 'https://empowering-power.onrender.com';
  const userId = 1;

  const [data, setData] = useState<Consumption[]>([]);
  const [chartData, setChartData] = useState<barDataItem[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(
    new Date('2024-12-26 00:00:00')
  );
  const [periodType, setPeriodType] = React.useState<
    'Daily' | 'Weekly' | 'Monthly'
  >('Daily');
  const [summaryData, setSummaryData] = useState<Consumption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchConsumptions();
      setData(fetchedData);
      const dailyData = getConsumptionsByPeriod(
        fetchedData,
        'Daily',
        currentDate
      );
      setSummaryData(dailyData!);
      setChartData(processData(dailyData!));
      setIsLoading(false);
    };
    fetchData();
  }, [currentDate]);

  const fetchConsumptions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/api/consumptions/${userId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnPeriodChange = (index: number) => {
    if (index === 0) {
      const dailyData = getConsumptionsByPeriod(
        [...data],
        'Daily',
        currentDate
      );
      setSummaryData(dailyData!);
      setChartData(processData(dailyData!));
    }
    if (index === 1) {
      const weeklyData = getConsumptionsByPeriod(
        [...data],
        'Weekly',
        currentDate
      );
      setSummaryData(weeklyData!);
      setChartData(processData(weeklyData!));
    }
    if (index === 2) {
      const monthlyData = getConsumptionsByPeriod(
        [...data],
        'Monthly',
        currentDate
      );
      setSummaryData(monthlyData!);
      setChartData(processData(monthlyData!));
    }
  };

  const handlePrevious = () => {
    const today = Number(moment(currentDate.toDateString()).format('DD'));

    if (periodType === 'Daily') {
      if (today > 1) {
        setCurrentDate(
          moment(currentDate.toDateString()).subtract(1, 'day').toDate()
        );
      }
    }

    // if (periodType === 'Weekly') {
    //   const currentMonth = moment(currentDate.toDateString()).month();
    //   const previousMonth = moment(currentDate.toDateString())
    //     .subtract(7, 'days')
    //     .month();

    //   if (previousMonth === currentMonth) {
    //     setCurrentDate(
    //       moment(currentDate.toDateString()).subtract(7, 'days').toDate()
    //     );
    //   }
    // }
  };

  const handleNext = () => {
    const maxDays = moment(currentDate.toDateString()).daysInMonth();
    const today = Number(moment(currentDate.toDateString()).format('DD'));

    if (periodType === 'Daily') {
      if (today < maxDays) {
        setCurrentDate(
          moment(currentDate.toDateString()).add(1, 'day').toDate()
        );
      }
    }

    // if (periodType === 'Weekly') {
    //   const currentMonth = moment(currentDate.toDateString()).month();
    //   const nextMonth = moment(currentDate.toDateString())
    //     .add(7, 'days')
    //     .month();

    //   if (nextMonth === currentMonth) {
    //     setCurrentDate(
    //       moment(currentDate.toDateString()).subtract(7, 'days').toDate()
    //     );
    //   }
    // }
  };

  const getSummaryData = () => {
    // return processSummaryData(summaryData).filter((item) => item.percent > 5);
    return processSummaryData(summaryData);
  };

  const summary = getSummaryData().map((item, index) => {
    return (
      <Text key={index} style={{ fontWeight: 'bold' }}>
        {item.name}: {item.percent}%
      </Text>
    );
  });

  const peakUsage = () => {
    if (periodType === 'Daily') {
      return (
        <Text>{moment(currentDate.toDateString()).format('YYYY MMM D')}</Text>
      );
    }
    if (periodType === 'Weekly') {
      const currentMonth = moment(currentDate.toDateString()).month();

      const current = moment(currentDate.toDateString());
      const monday = current.clone().weekday(1);
      const sunday = current.clone().weekday(7);
      if (currentMonth === monday.month() && currentMonth === sunday.month()) {
        return (
          <Text>
            {monday.format('YYYY MMM D')} - {sunday.format('YYYY MMM D')}
          </Text>
        );
      } else {
        <Text></Text>;
      }
    }
    if (periodType === 'Monthly') {
      return (
        <Text>{moment(currentDate.toDateString()).format('YYYY MMM')}</Text>
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Card>
        <Text style={{ fontWeight: 400, fontSize: 12 }}>
          Peak Usage: {peakUsage()}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 15,
          }}
        >
          {summary}
        </View>
        <ConsumptionChart data={chartData} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginTop: 16,
          }}
        >
          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={handlePrevious}
          >
            <SymbolView
              name="chevron.left.circle.fill"
              type="hierarchical"
              tintColor={'gray'}
              fallback={
                <Ionicons name="arrow-back-circle" size={24} color="gray" />
              }
            />
            <Text style={{ fontSize: 11, color: 'gray' }}>Prev</Text>
          </TouchableOpacity>
          <SegmentedControl
            values={['Daily', 'Weekly', 'Monthly']}
            style={{ width: 250 }}
            selectedIndex={
              periodType === 'Daily' ? 0 : periodType === 'Weekly' ? 1 : 2
            }
            onChange={(event) => {
              const index = event.nativeEvent.selectedSegmentIndex;
              handleOnPeriodChange(index);
              setPeriodType(
                index === 0 ? 'Daily' : index === 1 ? 'Weekly' : 'Monthly'
              );
            }}
          />
          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={handleNext}
          >
            <SymbolView
              name="chevron.right.circle.fill"
              type="hierarchical"
              tintColor={'gray'}
              fallback={
                <Ionicons name="arrow-forward-circle" size={24} color="gray" />
              }
            />
            <Text style={{ fontSize: 11, color: 'gray' }}>Next</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ff9500',
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'f5f5f5',
    paddingTop: StatusBar.currentHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
