import { TextInput, ScrollView, View} from 'react-native'
import { Content, List, ListItem, Text } from 'native-base'
import React, {Component} from 'react'
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {
  withNavigation
} from '@expo/ex-navigation'

const io = require('socket.io-client')

@withNavigation
export default class Home extends Component {
  static route = {
    navigationBar: {
      title: 'ws-chat'
    }
  }

  state = {
    messages: [{
      name: 'Seena',
      message: 'Welcome'
    }],
    hasConnectivity: false,
    text: ''
  }
  componentDidMount (props) {
    this.socket = io('https://server-yzgtsbjhmp.now.sh')

    this.socket.on('connect', () => this.setState({ hasConnectivity: true }))

    this.socket.on('recieve', (message) => {
      requestIdleCallback(() => {
        this.setState({messages: this.state.messages.concat(message)})
      })
    })
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
            editable={this.hasConnectivity}
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
