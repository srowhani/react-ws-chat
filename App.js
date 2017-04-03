import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ListView
} from 'react-native';

const { Component } = React
const io = require('socket.io-client')

export default class App extends Component {
  state = {
    hasConnected: false,
    text: '',
    messages: []
  }

  constructor () {
    super(...arguments)
    const rowHasChanged = (a, b) => a !== b
    this.state.elements = new ListView.DataSource({rowHasChanged})
  }
  componentDidMount (props) {
    this.socket = socket = io('https://server-vkbzceuxiz.now.sh')

    socket.on('connect', () => this.setState({hasConnected: true}))

    socket.on('recieve', (message) => {
      this.state.messages.push(message)
      this.setState({
        elements: this.state.elements.cloneWithRows(this.state.messages)
      })
    })

  }
  performSubmit () {
    this.socket.emit('send', this.state.text)
    this.setState({
      text: ''
    })
  }

  render() {
    return (
      <View style={styles.container}>

        <TextInput
          style={styles.input}
          value={this.state.text}
          onChangeText={(text) => {
            this.setState({text})
          }}
          editable={this.state.hasConnected}
          onSubmitEditing={() => this.performSubmit()}
        />

        <ListView
          dataSource={this.state.elements}
          renderRow={(data) => (
            <Text>
              {data.name}: {data.message}
            </Text>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    marginTop: 50,
    padding: 10
  }
});
