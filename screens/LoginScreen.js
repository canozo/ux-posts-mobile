import React from 'react';
import { ScrollView, StyleSheet, Button, TextInput, Text } from 'react-native';
import { login } from '../helpers/auth';


export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.state = {
      message: '',
      email: 'cano@unitec.edu',
      password: 'password',
    };
  }
  
  static navigationOptions = {
    title: 'Login',
  };

  handleLogin() {
    login(this.state.email, this.state.password).then((response) => {
      if (response.user) {
        console.log(response.user);
        this.setState({ message: 'Logged in succesfully!' });
      }
    }).catch((error) => {
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
          onPress={this.handleLogin}
          title="Login"
          color="#841584"
        />
        <Text>{this.state.message}</Text>
      </ScrollView>
    );
  }

  componentDidMount() {
    console.log('Mounted login');
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
