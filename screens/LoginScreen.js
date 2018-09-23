import React from 'react';
import { ScrollView, StyleSheet, Button, TextInput, Text } from 'react-native';
import { login } from '../helpers/auth';
import firebase from '../config/constants';


export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.state = {
      currentUser: {},
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
        this.setState({ message: 'Logged in succesfully!' });
      }
    }).catch((error) => {
      this.setState({ message: error.message });
    });

    var user = firebase.auth().currentUser;
    if (user) {
      this.setState({
        currentUser: {
          uid: user.uid,
          email: user.email,
          profile_picture: user.photoURL,
          username: user.displayName ? user.displayName : user.email
        },
        email: '',
        password: ''
      });
    }
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
        <Text>
          Currently logged in as: {this.state.currentUser.uid ? this.state.currentUser.uid : 'No one'}
        </Text>
      </ScrollView>
    );
  }

  setUser(user) {
    // if user not in db: add him
    firebase.database().ref('/users/' + user.uid).on('value', (snap) => {
      if (!snap.val()) {
        firebase.database().ref('/users/' + user.uid).set({
          email: user.email,
          profile_picture: user.photoURL ? use.photoURL : 'https://my.mixtape.moe/xspklg.jpg',
          username: user.displayName
        });
      }
    });

    // add user info to state
    this.setState({ currentUser: {
      uid: user.uid,
      email: user.email,
      profile_picture: user.profile_picture ? user.profile_picture : 'https://my.mixtape.moe/xspklg.jpg',
      username: user.displayName
    } });
  }

  componentDidMount() {
    var user = firebase.auth().currentUser;
    if (user) {
      this.setUser(user);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
