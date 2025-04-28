import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Platform,
  Text,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RegisterScreen from './src/pages/authScreen/registerScreen';
import HomeScreen from './src/pages/homeScreen/index';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClient = new QueryClient();
import HomeServiceScreen from './src/pages/homeServiceScreen';
import LaundaryScreen from './src/pages/laundaryScreen';
import HomePageScreen from './src/pages/HomePageScreen';
import PharmacyScreen from './src/pages/PharmacyScreen';
import DryCleanScreen from './src/pages/dryCleanScreen';
import ContactUsScreen from './src/pages/contactUsScreen';
import ProductScreen from './src/pages/productScreen';
import CartScreem from './src/pages/cartScreen';
import UniversalSearchScreen from './src/pages/universalSearchScreen';
import SignupScreen from './src/pages/authScreen/signupScreen';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';

// const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaView style={styles.safeArea}>
            <StatusBar
              barStyle="dark-content"
              backgroundColor="transparent"
              translucent
            />
            {/* <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={'home'} component={HomeScreen} />
          <Stack.Screen name={'signup'} component={SignupScreen} />
          <Stack.Screen name={'register'} component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer> */}
            {/* <HomeScreen /> */}
            {/* <RegisterScreen /> */}
            {/* <SignupScreen /> */}
            {/* <RegisterScreen /> */}
            {/* <SignupScreen /> */}
            {/* <HomeServiceScreen /> */}
            {/* <LaundaryScreen />  */}
            <HomePageScreen />
            {/* <PharmacyScreen /> */}
            {/* <DryCleanScreen /> */}
            {/* <UniversalSearchScreen /> */}
            {/* <ContactUsScreen /> */}
            {/* <ProductScreen /> */}
            {/* <CartScreem /> */}
          </SafeAreaView>
        </QueryClientProvider>
      </Provider>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
