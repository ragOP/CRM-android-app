import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/Ionicons';

import {persistor, store, useAppSelector} from './src/redux/store';

// Screens
import HomePageScreen from './src/pages/HomePageScreen';
import HomeScreen from './src/pages/homeScreen';
import RegisterScreen from './src/pages/authScreen/registerScreen';
import PharmacyScreen from './src/pages/PharmacyScreen';
import HomeServiceScreen from './src/pages/homeServiceScreen';
import LaundaryScreen from './src/pages/laundaryScreen';
import DryCleanScreen from './src/pages/dryCleanScreen';
import ContactUsScreen from './src/pages/contactUsScreen';
import ProductScreen from './src/pages/productScreen';
import CartScreen from './src/pages/cartScreen';
import UniversalSearchScreen from './src/pages/universalSearchScreen';
import Blog from './src/components/Blog';
import HouseServiceScreen from './src/pages/homeServiceScreen';
import UserProfileScreen from './src/components/UserProfileScreen/UserProfileScreen';
import LoginScreen from './src/pages/authScreen/loginScreen';
import {PersistGate} from 'redux-persist/integration/react';
import ViewOrdersScreen from './src/components/ViewOrderScreen/ViewOrderScreen';
import LoginValidation from './src/components/Validation/LoginValidation';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

const HomeStack = () => {
  const reduxAuth = useAppSelector(state => state.auth);
  const isLoggedIn = Boolean(reduxAuth.token);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomePage" component={HomePageScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="UniversalSearch" component={UniversalSearchScreen} />
      <Stack.Screen name="LaundaryScreen" component={LaundaryScreen} />
      <Stack.Screen name="HouseServiceScreen" component={HouseServiceScreen} />
      <Stack.Screen name="ProductScreen" component={ProductScreen} />
    </Stack.Navigator>
  );
};

const AccountStack = () => {
  const reduxAuth = useAppSelector(state => state.auth);
  const isLoggedIn = Boolean(reduxAuth.token);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isLoggedIn ? (
        <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
      ) : (
        <>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </>
      )}
      <Stack.Screen name="ViewOrderScreen" component={ViewOrdersScreen} />
    </Stack.Navigator>
  );
};

const CartStack = () => {
  const reduxAuth = useAppSelector(state => state.auth);
  const isLoggedIn = Boolean(reduxAuth.token);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isLoggedIn ? (
        <Stack.Screen name="CartScreen" component={CartScreen} />
      ) : (
        <Stack.Screen name="LoginValidation" component={LoginValidation} />
      )}
    </Stack.Navigator>
  );
};

const tabScreenOptions = ({route}: {route: any}) => ({
  headerShown: false,
  tabBarIcon: ({color, size}: {color: string; size: number}) => {
    let iconName = 'home';
    if (route.name === 'HomeTab') {
      iconName = 'home';
    } else if (route.name === 'Pharmacy') {
      iconName = 'medkit';
    } else if (route.name === 'Cart') {
      iconName = 'cart';
    } else if (route.name === 'Account') {
      iconName = 'person';
    } else if (route.name === 'Blog') {
      iconName = 'book';
    }
    return <Icon name={iconName} size={size} color={color} />;
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <SafeAreaView style={styles.safeArea}>
              <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
              />
              <Tab.Navigator
                initialRouteName="HomeTab"
                screenOptions={tabScreenOptions}>
                <Tab.Screen
                  name="HomeTab"
                  component={HomeStack}
                  options={{title: 'Home'}}
                />
                {/* <Tab.Screen
                  name="Pharmacy"
                  component={PharmacyScreen}
                  options={{title: 'Pharmacy'}}
                /> */}
                <Tab.Screen
                  name="Blog"
                  component={Blog}
                  options={{title: 'Blog'}}
                />
                <Tab.Screen
                  name="Cart"
                  component={CartStack}
                  options={{title: 'Cart'}}
                />

                <Tab.Screen
                  name="Account"
                  component={AccountStack}
                  options={{title: 'Account'}}
                />
              </Tab.Navigator>
            </SafeAreaView>
          </NavigationContainer>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
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
