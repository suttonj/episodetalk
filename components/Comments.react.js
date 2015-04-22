/** @jsx React.DOM */

var React = require('react');
var Comment = require('./Comment.react.js');

module.exports = Comments = React.createClass({

  // Render our tweets
  render: function(){

    // Build list items of single tweet components using map
    var content = this.props.comments.map(function(comment){
      return (
        <Comment key={comment._id} comment={comment} />
      )
    });

    // Return ul filled with our mapped tweets
    return (
      <ul className="tweets">{content}</ul>
    )

  }

}); 