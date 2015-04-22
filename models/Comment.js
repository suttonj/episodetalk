var mongoose = require('mongoose');

// Create a new schema for our Comment data
var schema = new mongoose.Schema({
    linkid      : String
  , active      : Boolean
  , text        : String
  , replies     : String
  , parentid    : String
  , show        : String
  , episode     : Number
  , date        : Date
});

// Create a static getComments method to return Comment data from the db
schema.statics.getComments = function(page, skip, callback) {

  var comments = [],
      start = (page * 10) + (skip * 1);

  // Query the db, using skip and limit to achieve page chunks
  Comment.find({},'linkid text replies parentid show date episode',{skip: start, limit: 10}).sort({date: 'desc'}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      comments = docs;  // We got comments
      comments.forEach(function(comment){
        comment.active = true; // Set them to active
      });
    }

    // Pass them back to the specified callback
    callback(comments);

  });

};

schema.statics.clearComments = function(subreddit) {
  Comment.find({ show: subreddit }).remove();
};

// Return a Comment model based upon the defined schema
module.exports = Comment = mongoose.model('Comment', schema);