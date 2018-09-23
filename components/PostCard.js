import React, { Component } from 'react';
import { Image, Text, View, Button, TextInput } from 'react-native';
import firebase from '../config/constants';
import Comment from './Comment';

class PostCard extends Component {
  constructor(props) {
    super(props);
    this.handleStars = this.handleStars.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
    this.followStatus = this.followStatus.bind(this);
    this.handleComment = this.handleComment.bind(this);

    this.state = {
      uid: props.uid,
      currentUser: props.currentUser,
      key: props.postid,
      datetime: props.datetime,
      author: '',
      authorPic: '',
      privacy: '',
      title: '',
      body: '',
      stars: {},
      followers: {},
      comments: {},
      commentDraft: ''
    };
  }

  handleStars(event) {
    var starry = {};
    // db reference
    var dbRef = firebase.database().ref('/posts/' + this.state.key);

    // get initial state
    var updates = {
      author: this.state.author,
      authorPic: this.state.authorPic,
      body: this.state.body,
      privacy: this.state.privacy,
      title: this.state.title,
      uid: this.state.uid
    }

    if (!this.state.stars) {
      // no stars have been added
      starry[this.state.currentUser.uid] = true;
    } else if (!(this.state.currentUser.uid in this.state.stars)) {
      // stars have been added but maybe the user hasn't added any
      starry = this.state.stars;
      starry[this.state.currentUser.uid] = true;
    } else {
      // user has added stars
      starry = this.state.stars;
      starry[this.state.currentUser.uid] = !this.state.stars[this.state.currentUser.uid];
    }
    // update db and state
    updates.stars = starry;
    dbRef.update(updates).then(() => {
      const path = '/user-posts/' + this.state.uid + '/' + this.state.key;
      firebase.database().ref(path).update(updates);
    });
    this.setState({ stars: starry });
  }

  handleDelete(event) {
    // delete request that will be sent
    const request = {
      postId: this.state.key,
      poster: this.state.uid,
      deleter: this.state.currentUser.uid
    };

    // make a new post on delete-requests to request a new deletion
    firebase.database().ref('/delete-requests/').push(request).then((snap) => {
      this.setState({});
    });
  }

  countStars() {
    var count = 0;
    for (let key in this.state.stars) {
      if (this.state.stars[key]) {
        count += 1;
      }
    }
    return count;
  }

  handleComment(event) {
    // original comments
    var updatedComments = this.state.comments || {};
    // new comment
    const newComment = {
      author: this.state.currentUser.username,
      text: this.state.commentDraft,
      uid: this.state.currentUser.uid
    };

    // push new comment to db
    this.dbRefComments.push(newComment).then((snap) => {
      // get new comment key and add it to state
      const key = snap.key;
      updatedComments[key] = newComment;
      this.setState(updatedComments);
      this.setState({ commentDraft: '' });
    });
  }

  handleFollow(event) {
    var followy = {};

    if (!this.state.followers) {
      // there are no followers yet so we create a new node
      followy[this.state.currentUser.uid] = true;
    } else if (!(this.state.currentUser.uid in this.state.followers)) {
      // there are followers but the user isnt' following
      followy = this.state.followers;
      followy[this.state.currentUser.uid] = true;
    } else {
      // there are followers and the user has followed, invert result
      followy = this.state.followers;
      followy[this.state.currentUser.uid] = !this.state.followers[this.state.currentUser.uid];
    }
    // update db and state
    this.dbRefFollowers.update(followy);
    this.setState({ followers: followy });
  }

  followStatus() {
    if (this.state.followers
      && this.state.currentUser.uid in this.state.followers
      && this.state.followers[this.state.currentUser.uid] === true) {
        return 'Unfollow';
      } else {
        return 'Follow';
      }
  }

  userIsLogged() {
    // if this.state.currentUser is {} then...
    return Object.keys(this.state.currentUser).length !== 0
      || this.state.currentUser.constructor !== Object;
  }

  getActionIcons() {
    var icons = [];

    // only show delete option for the respective authors
    if (this.state.uid === this.state.currentUser.uid) {
      icons.push(
        <Button
          key={0}
          onPress={this.handleDelete}
          title='Delete'
        />
      );
    }

    // only show star option if the user is logged in
    if (this.userIsLogged()) {
      icons.push(
        <Button
          key={1}
          onPress={this.handleStars}
          title='Star'
        />
      );
    }

    return (
      <View>
        {icons}
      </View>
    );
  }

  getCommentField() {
    if (this.userIsLogged()) {
      return (
        <View>
          <Text component="p">
            Add a comment:
          </Text>
          <TextInput
            value={this.state.commentDraft}
            onChangeText={(text) => this.setState({ commentDraft: text })}
          />
        </View>
      );
    } else {
      return (
        <View></View>
      );
    }
  }

  getActionCards() {
    if (this.userIsLogged()) {
      return (
        <View>
          <Button
            // color="#841584"
            onPress={this.handleComment}
            title='Post comment'
          />
          <Button
            // color="#841584"
            onPress={this.handleFollow}
            title={this.followStatus()}
          />
        </View>
      );
    } else {
      return (
        <View></View>
      );
    }
  }

  render() {
    var comments = [];
    for (let key in this.state.comments) {
      let comment = this.state.comments[key];
      comments.push(<Comment
        key={key}
        author={comment.author}
        text={comment.text}
        uid={comment.uid}
      />);
    }
    return (
      <View dateTime={this.state.datetime.toString()}>
        <View>
          <Image
            style={{width: 50, height: 50}}
            source={{uri: this.state.authorPic ? this.state.authorPic : 'https://my.mixtape.moe/xspklg.jpg'}}
          />
          <Text>{this.state.author}</Text>
          <Text>{'Star count: ' + (this.state.stars ? this.countStars() : 0)}</Text>
        </View>
        <View>
          <Text>
            {this.state.title}
          </Text>
          <Text>
            {this.state.body}
          </Text>
          {comments}
          {this.getCommentField()}
        </View>
      {this.getActionCards()}
      {this.getActionIcons()}
      </View>
    );
  }

  componentDidMount() {
    // posts
    this.dbRefPost = firebase.database().ref('/posts/' + this.state.key);
    this.dbCallbackPost = this.dbRefPost.on('value', (snap) => {
      this.setState(snap.val());
    });

    // user-posts
    this.dbRefUserPost = firebase.database().ref('/user-posts/' + this.state.key);
    this.dbCallbackUserPost = this.dbRefUserPost.on('value', (snap) => {
      this.setState(snap.val());
    });

    // followers
    this.dbRefFollowers = firebase.database().ref('/followers/' + this.state.uid);
    this.dbCallbackFollowers = this.dbRefFollowers.on('value', (snap) => {
      this.setState({ followers: snap.val() });
    });

    // comments
    this.dbRefComments = firebase.database().ref('/comments/' + this.state.key);
    this.dbCallbackComments = this.dbRefComments.on('value', (snap) => {
      this.setState({ comments: snap.val() });
    });
  }

  componentWillUnmount() {
    // posts
    this.dbRefPost.off('value', this.dbCallbackPost);
    // users
    this.dbRefUserPost.off('value', this.dbCallbackUserPost);
    // followers
    this.dbRefFollowers.off('value', this.dbCallbackFollowers);
    // comments
    this.dbRefComments.off('value', this.dbCallbackComments);
  }
}

export default PostCard;