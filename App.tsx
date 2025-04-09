import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components';
import { AppNavigator } from './src/navigation/AppNavigator';
import theme from './src/styles/theme';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor={theme.colors.primary} 
        />
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}