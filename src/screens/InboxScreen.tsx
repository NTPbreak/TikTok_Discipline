import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InboxScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Boîte de réception</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InboxScreen;