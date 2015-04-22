/** @jsx React.DOM */

var React = require('react');

module.exports = Comment = React.createClass({
  render: function(){
    var comment = this.props.comment;
    return (
      <li className={"tweet" + (comment.active ? ' active' : '')}>
        <blockquote>
          <span className="content">{comment.text}</span>
        </blockquote>
      </li>
    )
  }
});