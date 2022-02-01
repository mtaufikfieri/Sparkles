import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {View, Text} from 'react-native';
import Song from '../components/Song';
import Splash from '../components/Splash';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

const TestNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Splash" component={Splash} />
      <HomeStack.Screen name="Song" component={Song} />
    </HomeStack.Navigator>
  );
};

export default TestNavigator;
