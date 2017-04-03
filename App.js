import React, {Component} from 'react'
import {Platform, StyleSheet, View, StatusBar} from 'react-native'
import Expo, { Icon } from 'expo'
import { NavigationProvider, StackNavigation } from '@expo/ex-navigation'
import Router from './navigation/router'

class AppContainer extends Component {
  render() {
    return (
      <View style={styles.container}>
        <NavigationProvider router={Router}>
          <StackNavigation id='root' initialRoute='home' />
        </NavigationProvider>

        {Platform.OS === 'ios' && <StatusBar barStyle='default' />}
        {Platform.OS === 'android' &&
          <View style={styles.statusBarUnderlay} />}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
})

export default AppContainer
