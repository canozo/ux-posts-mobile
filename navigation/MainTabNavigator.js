import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import FollowedScreen from '../screens/FollowedScreen';
import PrivateScreen from '../screens/PrivateScreen';
import NewPostScreen from '../screens/NewPostScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const FollowedStack = createStackNavigator({
  Followed: FollowedScreen,
});

FollowedStack.navigationOptions = {
  tabBarLabel: 'Followed',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-link'}
    />
  ),
};

const PrivateStack = createStackNavigator({
  Followed: PrivateScreen,
});

PrivateStack.navigationOptions = {
  tabBarLabel: 'Private',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-star'}
    />
  ),
};

const NewPostStack = createStackNavigator({
  NewPost: NewPostScreen,
});

NewPostStack.navigationOptions = {
  tabBarLabel: 'New post',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-clipboard'}
    />
  ),
};

const LoginStack = createStackNavigator({
  Logins: LoginScreen,
});

LoginStack.navigationOptions = {
  tabBarLabel: 'Login',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-checkbox'}
    />
  ),
};

const RegisterStack = createStackNavigator({
  Registers: RegisterScreen,
});

RegisterStack.navigationOptions = {
  tabBarLabel: 'Register',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-document'}
    />
  ),
};

export default createBottomTabNavigator({
  LoginStack,
  RegisterStack,
  HomeStack,
  FollowedStack,
  PrivateStack,
  NewPostStack,
});
