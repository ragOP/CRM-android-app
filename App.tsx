import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {PaperProvider} from 'react-native-paper';
import {PersistGate} from 'redux-persist/integration/react';

import {persistor, store, useAppSelector} from './src/redux/store';

// Screens
import HomePageScreen from './src/pages/HomePageScreen';
import HomeScreen from './src/pages/homeScreen';
import RegisterScreen from './src/pages/authScreen/registerScreen';
import LaundaryScreen from './src/pages/laundaryScreen';
import ProductScreen from './src/pages/productScreen';
import CartScreen from './src/pages/cartScreen';
import UniversalSearchScreen from './src/pages/universalSearchScreen';
import Blog from './src/components/Blog';
import HouseServiceScreen from './src/pages/homeServiceScreen';
import UserProfileScreen from './src/components/UserProfileScreen/UserProfileScreen';
import LoginScreen from './src/pages/authScreen/loginScreen';
import ViewOrdersScreen from './src/components/ViewOrderScreen/ViewOrderScreen';
import LoginValidation from './src/components/Validation/LoginValidation';
import CustomSnackbar from './src/components/CustomSnackbar/CustomSnackbar';
import TransactionLogs from './src/components/TransactionLogs/TransactionLogs';
import ForgetPasswordScreen from './src/pages/forgetPasswordScreen';
import FaqScreen from './src/components/Faq';
import PrivacyPolicyScreen from './src/components/PrivacyPolicy';
import TermsConditionsScreen from './src/components/TermsCondition';
import BuyNowScreen from './src/pages/BuyNowScreen/BuyNowScreen';
import EditProfileScreen from './src/components/EditProfileScreen/EditProfileScreen';
import SingleBlogScreen from './src/components/SingleBlogScreen';

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
      <Stack.Screen name="BuyNowScreen" component={BuyNowScreen} />
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
          <Stack.Screen
            name="ForgetPasswordScreen"
            component={ForgetPasswordScreen}
          />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </>
      )}
      <Stack.Screen name="ViewOrderScreen" component={ViewOrdersScreen} />
      <Stack.Screen name="TransactionLogsScreen" component={TransactionLogs} />
      <Stack.Screen name="FaqScreen" component={FaqScreen} />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
      />
      <Stack.Screen
        name="TermsConditionsScreen"
        component={TermsConditionsScreen}
      />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

const BlogStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BlogListScreen" component={Blog} />
      <Stack.Screen name="SingleBlogScreen" component={SingleBlogScreen} />
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

const MainTabs = () => {
  const insets = useSafeAreaInsets();

  const tabScreenOptions = ({route}: {route: any}) => ({
    headerShown: false,
    tabBarStyle: {
      height: Platform.OS === 'ios' ? 25 + insets.bottom : 60,
      paddingBottom: Platform.OS === 'ios' ? insets.bottom : 10,
      backgroundColor: 'white',
    },
    tabBarIcon: ({
      color,
      size,
      focused,
    }: {
      color: string;
      size: number;
      focused: boolean;
    }) => {
      let iconName = 'home-outline';
      if (route.name === 'HomeTab') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'Blog') {
        iconName = focused ? 'post' : 'post-outline';
      } else if (route.name === 'Cart') {
        iconName = focused ? 'cart' : 'cart-outline';
      } else if (route.name === 'Account') {
        iconName = focused ? 'account' : 'account-outline';
      }
      return (
        <MaterialCommunityIcons name={iconName} size={size} color={color} />
      );
    },
  });

  return (
    <Tab.Navigator initialRouteName="HomeTab" screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{title: 'Home'}}
      />
      <Tab.Screen name="Blog" component={BlogStack} options={{ title: 'Blog' }} />
      <Tab.Screen name="Cart" component={CartStack} options={{title: 'Cart'}} />
      <Tab.Screen
        name="Account"
        component={AccountStack}
        options={{title: 'Account'}}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <PaperProvider>
              <SafeAreaView style={styles.safeArea}>
                <NavigationContainer>
                  <MainTabs />
                  <CustomSnackbar />
                </NavigationContainer>
                <StatusBar backgroundColor="transparent" translucent />
              </SafeAreaView>
            </PaperProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default App;
