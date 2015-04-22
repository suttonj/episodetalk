/** @jsx React.DOM */

var React = require('react');

module.exports = Header = React.createClass({
  render: function(){
    var count = this.props.count;
    var show = this.props.show;
    var episode = this.props.episode;
    
    return (
      <div className="header-info active">
        <h2> {this.props.show } Episode {this.props.episode}</h2>
      </div>
    )
  }
});