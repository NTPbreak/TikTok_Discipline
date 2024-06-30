import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TimeManager: React.FC = () => {
  const [usageTime, setUsageTime] = useState<number>(0); // Temps d'utilisation en minutes
  const [timeLimit, setTimeLimit] = useState<number>(0); // Limite de temps en minutes
  const [timeLimitInput, setTimeLimitInput] = useState<string>(''); // Valeur de l'entrée de limite de temps

  useEffect(() => {
    const loadUsageTime = async () => {
      const savedUsageTime = await AsyncStorage.getItem('usageTime');
      const savedTimeLimit = await AsyncStorage.getItem('timeLimit');
      if (savedUsageTime) setUsageTime(parseInt(savedUsageTime, 10));
      if (savedTimeLimit) setTimeLimit(parseInt(savedTimeLimit, 10));
    };
    loadUsageTime();
    
    const interval = setInterval(() => {
      setUsageTime(prevUsageTime => {
        const newUsageTime = prevUsageTime + 1;
        AsyncStorage.setItem('usageTime', newUsageTime.toString());
        if (newUsageTime >= timeLimit && timeLimit > 0) {
          Alert.alert('Temps d\'utilisation dépassé', 'Vous avez atteint la limite de temps d\'utilisation pour aujourd\'hui.');
        }
        return newUsageTime;
      });
    }, 60000); // Mise à jour toutes les minutes

    return () => clearInterval(interval);
  }, [timeLimit]);

  const handleSetTimeLimit = () => {
    const limit = parseInt(timeLimitInput, 10);
    if (!isNaN(limit)) {
      setTimeLimit(limit);
      AsyncStorage.setItem('timeLimit', limit.toString());
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Temps d'utilisation</Text>
      <Text style={styles.time}>Temps d'utilisation : {usageTime} minutes</Text>
      <Text style={styles.time}>Limite de temps : {timeLimit} minutes</Text>
      <TextInput
        style={styles.input}
        placeholder="Définir une limite de temps (minutes)"
        value={timeLimitInput}
        onChangeText={setTimeLimitInput}
        keyboardType="numeric"
      />
      <Button title="Définir la limite de temps" onPress={handleSetTimeLimit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  time: {
    fontSize: 18,
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default TimeManager;
