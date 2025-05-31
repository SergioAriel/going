import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Going</Text>
          <Text style={styles.subtitle}>Your marketplace with cryptocurrency payments</Text>
        </View>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.buttonText}>Explore Products</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('Categories')}
          >
            <Text style={styles.buttonText}>Browse Categories</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#14BFFB',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonsContainer: {
    padding: 20,
    gap: 10,
  },
  button: {
    backgroundColor: '#14BFFB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#D300E5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});