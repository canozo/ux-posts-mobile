import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import firebase from '../config/constants';
import PostCard from '../components/PostCard';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      posts: {},
      users: {},
    };
  }

  static navigationOptions = {
    title: 'Home',
  };

  sortByDate(arr) {
    return arr.sort((a, b) => {
      let na = a.props.datetime;
      let nb = b.props.datetime;
      if (na < nb) {
        return 1;
      }
      if (na > nb) {
        return -1;
      }
      return 0;
    });
  }

  render() {
    var result = [];
    if (this.state.posts) {
      for (let key in this.state.posts) {
        let post = this.state.posts[key];
        result.push(<PostCard
          key={key}
          postid={key}
          uid={post.uid}
          currentUser={this.state.currentUser}
          datetime={post.serverTime}
        />);
      }
      if (result.length === 0) {
        return (
          <Text>There's nothing here yet!</Text>
        );
      }
      return (
        <ScrollView>{this.sortByDate(result)}</ScrollView>
      );
    } else {
      return (
        <Text>There's nothing here yet!!</Text>
      );
    }
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
    this.setState({
      currentUser: {
        uid: user.uid,
        email: user.email,
        profile_picture: user.photoURL,
        username: user.displayName ? user.displayName : user.email
      }
    });
  }

  componentDidMount() {
    let apiUrl;
    var user = firebase.auth().currentUser;
    if (user) {
      this.setUser(user);
    }

    apiUrl = `https://us-central1-examen-2-jc.cloudfunctions.net/getPosts?privacy=public`;

    // posts
    this.dbRefPosts = firebase.database().ref('/posts');
    this.dbCallbackPosts = this.dbRefPosts.on('value', (snap) => {
      axios.get(apiUrl).then((resp) => {
        this.setState({ posts: resp.data });
      }).catch((error) => {
        console.log('Error getting the post data!', error);
      });
    });

    // users
    this.dbRefUsers = firebase.database().ref('/users');
    this.dbCallbackUsers = this.dbRefUsers.on('value', (snap) => {
      this.setState({ users: snap.val() });
    });
  }

  componentWillUnmount() {
    // posts
    this.dbRefPosts.off('value', this.dbCallbackPosts);
    // users
    this.dbRefUsers.off('value', this.dbCallbackUsers);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
