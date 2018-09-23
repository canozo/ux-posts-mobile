import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import FollowedScreen from '../screens/FollowedScreen';
import PrivateScreen from '../screens/PrivateScreen';
import NewPostScreen from '../screens/NewPostScreen';
import SettingsScreen from '../screens/SettingsScreen';

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

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-checkbox'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  FollowedStack,
  PrivateStack,
  NewPostStack,
  SettingsStack,
});
