// import React, {useEffect} from 'react';
// import {
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
//   Platform,
//   Text,
// } from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// // import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import RegisterScreen from './src/pages/authScreen/registerScreen';
// import HomeScreen from './src/pages/homeScreen/index';
// import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

// const queryClient = new QueryClient();
// import HomeServiceScreen from './src/pages/homeServiceScreen';
// import LaundaryScreen from './src/pages/laundaryScreen';
// import HomePageScreen from './src/pages/HomePageScreen';
// import PharmacyScreen from './src/pages/PharmacyScreen';
// import DryCleanScreen from './src/pages/dryCleanScreen';
// import ContactUsScreen from './src/pages/contactUsScreen';
// import ProductScreen from './src/pages/productScreen';
// import CartScreem from './src/pages/cartScreen';
// import UniversalSearchScreen from './src/pages/universalSearchScreen';
// import SignupScreen from './src/pages/authScreen/signupScreen';
// import {Provider} from 'react-redux';
// import {store} from './src/redux/store';

// // const Stack = createNativeStackNavigator();

// const App = () => {

//   return (
//     <NavigationContainer>
//       <Provider store={store}>
//         <QueryClientProvider client={queryClient}>
//           <SafeAreaView style={styles.safeArea}>
//             <StatusBar
//               barStyle="dark-content"
//               backgroundColor="transparent"
//               translucent
//             />
//             {/* <NavigationContainer>
//         <Stack.Navigator>
//           <Stack.Screen name={'home'} component={HomeScreen} />
//           <Stack.Screen name={'signup'} component={SignupScreen} />
//           <Stack.Screen name={'register'} component={RegisterScreen} />
//         </Stack.Navigator>
//       </NavigationContainer> */}
//             {/* <HomeScreen /> */}
//             {/* <RegisterScreen /> */}
//             {/* <SignupScreen /> */}
//             {/* <RegisterScreen /> */}
//             {/* <SignupScreen /> */}
//             {/* <HomeServiceScreen /> */}
//             {/* <LaundaryScreen />  */}
//             {/* <HomePageScreen /> */}
//             {/* <PharmacyScreen /> */}
//             {/* <DryCleanScreen /> */}
//             <UniversalSearchScreen />
//             {/* <ContactUsScreen /> */}
//             {/* <ProductScreen /> */}
//             {/* <CartScreem /> */}
//           </SafeAreaView>
//         </QueryClientProvider>
//       </Provider>
//     </NavigationContainer>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: 'white',
//     paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
//   },
// });

import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/Ionicons';

import {store} from './src/redux/store';

// Screens
import HomePageScreen from './src/pages/HomePageScreen';
import HomeScreen from './src/pages/homeScreen';
import RegisterScreen from './src/pages/authScreen/registerScreen';
import PharmacyScreen from './src/pages/PharmacyScreen';
import SignupScreen from './src/pages/authScreen/signupScreen';
import HomeServiceScreen from './src/pages/homeServiceScreen';
import LaundaryScreen from './src/pages/laundaryScreen';
import DryCleanScreen from './src/pages/dryCleanScreen';
import ContactUsScreen from './src/pages/contactUsScreen';
import ProductScreen from './src/pages/productScreen';
import CartScreen from './src/pages/cartScreen';
import UniversalSearchScreen from './src/pages/universalSearchScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

// Move HomeStack OUTSIDE of App
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomePage" component={HomePageScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="UniversalSearch" component={UniversalSearchScreen} />
      {/* Add more screens as needed */}
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <Provider store={store}>
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
              screenOptions={({route}) => ({
                headerShown: false,
                tabBarIcon: ({color, size}) => {
                  let iconName = 'home';
                  if (route.name === 'HomeTab') iconName = 'home';
                  else if (route.name === 'Pharmacy') iconName = 'medkit';
                  else if (route.name === 'Cart') iconName = 'cart';
                  else if (route.name === 'Account') iconName = 'person';
                  return <Icon name={iconName} size={size} color={color} />;
                },
              })}>
              <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{title: 'Home'}}
              />
              <Tab.Screen
                name="Pharmacy"
                component={PharmacyScreen}
                options={{title: 'Pharmacy'}}
              />
              <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{title: 'Cart'}}
              />
              <Tab.Screen
                name="Account"
                component={RegisterScreen}
                options={{title: 'Account'}}
              />
            </Tab.Navigator>
          </SafeAreaView>
        </NavigationContainer>
      </QueryClientProvider>
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
