import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Splash = () => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Song');
    }, 2000);
  });

  return (
    <View style={styles.center}>
      <Text style={{color: '#000'}}>Hello From Splash</Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
