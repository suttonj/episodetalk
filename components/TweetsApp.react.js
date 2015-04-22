/** @jsx React.DOM */

var React = require('react');
var Comments = require('./Comments.react.js');
var Loader = require('./Loader.react.js');
var NotificationBar = require('./NotificationBar.react.js');

// Export the TweetsApp component
module.exports = TweetsApp = React.createClass({

  // Method to add a tweet to our timeline
  addTweet: function(comment){

    // Get current application state
    var updated = this.state.comments;

    // Increment the unread count
    var count = this.state.count + 1;

    // Increment the skip count
    var skip = this.state.skip + 1;

    // Add tweet to the beginning of the tweets array
    updated.unshift(comment);

    // Set application state
    this.setState({comments: updated, count: count, skip: skip});

  },

  // Method to get JSON from server by page
  getPage: function(page){

    // Setup our ajax request
    var request = new XMLHttpRequest(), self = this;
    request.open('GET', 'page/' + page + "/" + this.state.skip, true);
    request.onload = function() {

      // If everything is cool...
      if (request.status >= 200 && request.status < 400){

        // Load our next page
        self.loadPagedTweets(JSON.parse(request.responseText));

      } else {

        // Set application state (Not paging, paging complete)
        self.setState({paging: false, done: true});

      }
    };

    // Fire!
    request.send();

  },

  // Method to show the unread tweets
  showNewTweets: function(){

    // Get current application state
    var updated = this.state.comments;

    // Mark our tweets active
    updated.forEach(function(comment){
      comment.active = true;
    });

    // Set application state (active tweets + reset unread count)
    this.setState({comments: updated, count: 0});

  },

  // Method to load tweets fetched from the server
  loadPagedTweets: function(comments){

    // So meta lol
    var self = this;

    // If we still have tweets...
    if(comments.length > 0) {

      // Get current application state
      var updated = this.state.comments;

      // Push them onto the end of the current tweets array
      comments.forEach(function(comment){
        updated.push(comment);
      });

      // This app is so fast, I actually use a timeout for dramatic effect
      // Otherwise you'd never see our super sexy loader svg
      setTimeout(function(){

        // Set application state (Not paging, add tweets)
        self.setState({comments: updated, paging: false});

      }, 1000);

    } else {

      // Set application state (Not paging, paging complete)
      this.setState({done: true, paging: false});

    }
  },

  // Method to check if more tweets should be loaded, by scroll position
  checkWindowScroll: function(){

    // Get scroll pos & window data
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var s = (document.body.scrollTop || document.documentElement.scrollTop || 0);
    var scrolled = (h + s) > document.body.offsetHeight;

    // If scrolled enough, not currently paging and not complete...
    if(scrolled && !this.state.paging && !this.state.done) {

      // Set application state (Paging, Increment page)
      this.setState({paging: true, page: this.state.page + 1});

      // Get the next page of tweets from the server
      this.getPage(this.state.page);

    }
  },

  // Set the initial component state
  getInitialState: function(props){

    props = props || this.props;

    // Set initial application state using props
    return {
      comments: props.comments,
      count: 0,
      page: 0,
      paging: false,
      skip: 0,
      done: false
    };

  },

  componentWillReceiveProps: function(newProps, oldProps){
    this.setState(this.getInitialState(newProps));
  },

  // Called directly after component rendering, only on client
  componentDidMount: function(){

    // Preserve self reference
    var self = this;

    // Initialize socket.io
    var socket = io.connect();

    // On tweet event emission...
    socket.on('tweet', function (data) {

        // Add a tweet to our queue
        self.addTweet(data);

    });

    // Attach scroll event to the window for infinity paging
    window.addEventListener('scroll', this.checkWindowScroll);

  },

  // Render the component
  render: function(){

    return (
      <div className="tweets-app">
        <Header show={this.state.show} episode={this.state.episode} />
        <Comments comments={this.state.comments} />
        <Loader paging={this.state.paging}/>
        <NotificationBar count={this.state.count} onShowNewTweets={this.showNewTweets}/>
      </div>
    )

  }

});