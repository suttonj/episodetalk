var JSX = require('node-jsx').install(),
  React = require('react'),
  TweetsApp = require('./components/TweetsApp.react'),
  Comment = require('./models/Comment');

module.exports = {

  index: function(req, res) {
    // Call static model method to get tweets in the db
    Comment.getComments(0,0, function(comments, pages) {

      // Render React to a string, passing in our fetched tweets
      var markup = React.renderComponentToString(
        TweetsApp({
          comments: comments
        })
      );

      // Render our 'home' template
      res.render('home', {
        markup: markup, // Pass rendered react markup
        state: JSON.stringify(comments) // Pass current state to client side
      });

    });
  },

  page: function(req, res) {
    // Fetch tweets by page via param
    Comment.getComments(req.params.page, req.params.skip, function(comments) {

      // Render as JSON
      res.send(comments);

    });
  }

}