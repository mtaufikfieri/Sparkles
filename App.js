import React from 'react';
import {View} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as ReduxProvider} from 'react-redux';
import Song from './app/components/Song';
import Router from './app/navigations/Router';
import {Store} from './app/redux/store';

const App = () => {
  return (
    <ReduxProvider store={Store}>
      <PaperProvider>
        <Song />
        {/* <Router /> */}
      </PaperProvider>
    </ReduxProvider>
  );
};

export default App;
