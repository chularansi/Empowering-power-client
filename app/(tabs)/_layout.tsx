import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';
import { Consumption } from '@/types/consumption';
import axios from 'axios';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';

export default function RootLayout() {
  const baseUrl = 'https://empowering-power.onrender.com';
  const userId = 1;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Consumption[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchConsumptions();
      setData(fetchedData);

      setIsLoading(false);
    };
    fetchData();
  }, []);

  const fetchConsumptions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/api/consumptions/${userId}`);
      return response.data;
    } catch (error) {
      console.log(error);
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
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: () => <FontAwesome name="home" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          headerShown: false,
          tabBarIcon: () => (
            <MaterialIcons name="dashboard" size={24} color="black" />
          ),
        }}
        initialParams={{ fetchData: data }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Setting',
          headerShown: false,
          tabBarIcon: () => (
            <MaterialIcons name="settings" size={24} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: 'f5f5f5',
    paddingTop: StatusBar.currentHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
