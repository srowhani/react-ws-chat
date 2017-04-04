import { TextInput, ScrollView, View, StyleSheet} from 'react-native'
import { Content, List, ListItem, Text } from 'native-base'
import React, {Component} from 'react'
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {
  withNavigation
} from '@expo/ex-navigation'
import { Notifications } from 'expo'
const io = require('socket.io-client')

@withNavigation
export default class Home extends Component {
  static route = {
    navigationBar: {
      title: 'ws-chat'
    }
  }
  state = {
    messages: [],
    hasConnectivity: false,
    text: ''
  }
  componentWillMount (props) {
    this._notifManager = Notifications.addListener(
      this._notifHandler.bind(this)
    )
    this.socket = io('https://server-yzgtsbjhmp.now.sh')
    this.socket.on('connect', () => {
      requestIdleCallback(() => {
        this.setState({
          messages: this.state.messages.concat({
            message: `Successfully connected`
          }),
          hasConnectivity: true
        })
      })
    })

    this.socket.on('recieve', (message) => {
      requestIdleCallback(() => {
        this.setState({messages: this.state.messages.concat(message)})
        Notifications.presentLocalNotificationAsync({
          title: `New message from ${message.name}`,
          body: `${message.message}`,
          data: {
            body: message,
          },
          ios: {
            sound: true,
          },
          android: {
            vibrate: true,
          },
        })
      })
    })
  }

  componentWillUnmount () {
    this._notifManager.remove();
  }

  _notifHandler (notification) {
    this.props.navigator.showLocalAlert(
      notification.data.body.message,
      notificationStyle
    )
  }

  _submit () {
    requestIdleCallback(() => {
      this.socket.emit('send', this.state.text)
      this.setState({
        text: ''
      })
    })
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <List
            dataArray={this.state.messages}
            renderRow={this._renderRow}
          />
        </ScrollView>
        <View>
          <TextInput
            placeholder='Send'
            editable={this.state.hasConnectivity}
            onChangeText={(text) => this.setState({text})}
            onSubmitEditing={() => this._submit()}
            style={{bottom: 0, padding: 10}}
            value={this.state.text}
          />
        </View>
        <KeyboardSpacer/>
      </View>
    )
  }

  _renderRow (item) {
    return (
      <ListItem>
        <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
        <Text style={{paddingLeft: 10}}>{item.message}</Text>
      </ListItem>
    )
  }
}

const notificationStyle = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  text: {
    color: `#${(Math.random() * 0xFFFFFF << 0).toString(16)}`
  }
})
