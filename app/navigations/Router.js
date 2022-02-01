import {NavigationContainer} from '@react-navigation/native';
import React, {useContext} from 'react';
import {Text, View} from 'react-native';
import TestNavigator from './TestNavigator';

const Router = () => {
  return (
    <NavigationContainer>
      <TestNavigator />
    </NavigationContainer>
  );
};

export default Router;
