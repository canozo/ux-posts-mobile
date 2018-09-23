import React from 'react';
import { ScrollView, StyleSheet, Button, TextInput, Text } from 'react-native';
import { auth } from '../helpers/auth';


export default class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.state = {
      message: '',
      email: '',
      password: '',
    };
  }
  
  static navigationOptions = {
    title: 'Register',
  };

  handleRegister() {
    auth(this.state.email, this.state.password).catch((error) => {
      this.setState({ message: error.message });
    });
    this.setState({
      email: '',
      password: ''
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>Email:</Text>
        <TextInput
          value={this.state.email}
          onChangeText={(text) => {this.setState({ email: text })}}
        />
        <Text>Password:</Text>
        <TextInput
          value={this.state.password}
          secureTextEntry={true}
          onChangeText={(text) => {this.setState({ password: text })}}
        />
        <Button
          onPress={this.handleRegister}
          title="Register"
          color="#841584"
        />
        <Text>{this.state.message}</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
