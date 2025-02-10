import { StyleSheet, View } from 'react-native';
import React, { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {}

const Card = ({ children }: CardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>{children}</View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#fff',
    boxShadow: '2 2 3 gray',
    marginHorizontal: 10,
    marginVertical: 15,
  },
  cardContent: {
    marginHorizontal: 5,
    marginVertical: 10,
  },
});
