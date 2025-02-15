import { Text, View, StyleSheet } from 'react-native';

const index = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Empowering Energy Consumers</Text>
      <Text style={styles.text}>Alva</Text>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#388E3C',
    marginBottom: 40,
  },
});
