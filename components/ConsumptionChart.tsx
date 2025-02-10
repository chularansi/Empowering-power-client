import { StyleSheet, View } from 'react-native';
import React from 'react';
import { BarChart, barDataItem } from 'react-native-gifted-charts';

interface ConsumptionChartProps {
  data: barDataItem[];
}

const ConsumptionChart = ({ data }: ConsumptionChartProps) => {
  return (
    <View>
      <BarChart
        data={data}
        height={200}
        width={250}
        barWidth={15}
        minHeight={1}
        barBorderRadius={2}
        showGradient={true}
        initialSpacing={10}
        spacing={20}
        noOfSections={3}
        xAxisLabelTextStyle={{ fontSize: 10 }}
        yAxisTextStyle={{ color: 'gray' }}
        xAxisThickness={0}
        yAxisThickness={0}
        isAnimated
        animationDuration={500}
      />
    </View>
  );
};

export default ConsumptionChart;

const styles = StyleSheet.create({});
