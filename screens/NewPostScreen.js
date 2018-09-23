import React from 'react';
import { ScrollView, StyleSheet, Button, TextInput, Text } from 'react-native';
import firebase from '../config/constants';


export default class NewPostScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      currentUser: {},
      title: '',
      body: '',
      privacy: ''
    };
  }
  
  static navigationOptions = {
    title: 'Make a new post',
  };

  handleSubmit() {
    // build the new post
    const newPost = {
      author: this.state.currentUser.username,
      authorPic: this.state.currentUser.profile_picture,
      body: this.state.body,
      stars: {},
      title: this.state.title,
      privacy: this.state.privacy.toLowerCase(),
      uid: this.state.currentUser.uid,
      serverTime: 0
    };

    // push the new request
    this.dbRefPosts.push(newPost).then((snap) => {
      const key = snap.key;
      const path = `/user-posts/${this.state.currentUser.uid}/${key}`;
      firebase.database().ref(path).set(newPost);
    });

    // reset form
    this.setState({
      title: '',
      body: '',
      privacy: ''
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>Title:</Text>
        <TextInput
          value={this.state.title}
          onChangeText={(text) => {this.setState({ title: text })}}
        />
        <Text>Body:</Text>
        <TextInput
          value={this.state.body}
          onChangeText={(text) => {this.setState({ body: text })}}
        />
        <Text>Privacy:</Text>
        <TextInput
          placeholder='public, private or followers'
          value={this.state.privacy}
          onChangeText={(text) => {this.setState({ privacy: text })}}
        />
        <Button
          onPress={this.handleSubmit}
          title="Make new post"
          color="#841584"
        />
      </ScrollView>
    );
  }

  setUser(user) {
    // if user not in db: add him
    firebase.database().ref('/users/' + user.uid).on('value', (snap) => {
      if (!snap.val()) {
        firebase.database().ref('/users/' + user.uid).set({
          email: user.email,
          profile_picture: user.photoURL ? user.photoURL : 'https://my.mixtape.moe/xspklg.jpg',
          username: user.displayName
        });
      }
    });

    // add user info to state
    this.setState({ currentUser: {
      uid: user.uid,
      email: user.email,
      profile_picture: user.profile_picture ? user.profile_picture : 'https://my.mixtape.moe/xspklg.jpg',
      username: user.displayName ? user.displayName : user.email
    } });
  }

  componentDidMount() {
    var user = firebase.auth().currentUser;
    if (user) {
      this.setUser(user);
    }

    // posts ref
    this.dbRefPosts = firebase.database().ref('/posts-requests');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
