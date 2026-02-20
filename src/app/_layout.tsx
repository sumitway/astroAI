import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { store } from '@store/index';
import { Colors } from '@theme/index';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Regular':    require('../../assets/fonts/SpaceGrotesk-Regular.ttf'),
    'SpaceGrotesk-Medium':     require('../../assets/fonts/SpaceGrotesk-Medium.ttf'),
    'SpaceGrotesk-Bold':       require('../../assets/fonts/SpaceGrotesk-Bold.ttf'),
    'SpaceGrotesk-Light':      require('../../assets/fonts/SpaceGrotesk-Light.ttf'),
    'SpaceGrotesk-SemiBold':   require('../../assets/fonts/SpaceGrotesk-SemiBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <Provider store={store}>
          <StatusBar style="light" backgroundColor={Colors.cosmicVoid} />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.cosmicVoid } }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="chart-detail" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="planet-detail" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="astrologer/[id]" options={{ presentation: 'card', headerShown: false }} />
            <Stack.Screen name="booking/[astrologerId]" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/register" options={{ headerShown: false }} />
          </Stack>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
