var Snoocore = require('snoocore');

var reddit = new Snoocore({
  userAgent: 'Episode Talk - v0.0.1'
});

module.exports = {
  
  getSubreddit: function (subreddit) {
    var children = [];
    var handleSlice = function (slice) {
      if (slice.empty) {
        return children;
      }
      
      function saveComment(linkId, body, replies, parent, created) {
        console.log("link: " + linkId + "    body: " + body + "    replies: " + JSON.stringify(replies) + "   parent: " + parent);
        
        var comment = {
          linkid: linkId,
          active: false,
          text: body,
          replies: replies,
          parentid: parent,
          date: created,
          show: subreddit,
          episode: 0
        };
    
        // Create a new model instance with our object
        var commentEntry = new Comment(comment);
    
        // Save 'er to the database
        commentEntry.save(function(err) {
          if (!err) {
            // If everything is cool, socket.io emits the tweet.
            //io.emit('tweet', tweet);
            console.log('comment saved');
          }
          else {
            console.log('comment failed to save');
          }
        });
    
      }
    
      function extractReplies(json) {
        if (json == undefined || json.data == undefined)
          return [];
      } 
      
      slice.stickied.forEach(function(item, i) {
        console.log(item.data.id);
        console.log(subreddit);
        reddit('/r/$subreddit/comments/$article').get({
          $subreddit: subreddit,
          $article: item.data.id,
          context: 1,
          limit: 10,
          sort: 'hot'
        }).done(function(result) {
          if (result.length <= 1)
            return null;
          // console.log(JSON.stringify(comment[1].data.children[0].data.replies.data.children[0].data.body));
          //console.log(JSON.stringify(comment[1].data.children[0].data.body));
          var comments = result[1].data.children;
          var replies;
          //console.log(JSON.stringify(comments));
          for (var i = 1; i < comments.length; i++) {
            console.log(JSON.stringify(comments[i]));
            if (!comments[i].data)
              continue;
              
            replies = extractReplies(comments[i].data.replies);// ? comments[i].data.replies.data.children : [];
            saveComment(
              comments[i].data.link_id,
              comments[i].data.body,
              replies,
              item.data.id,
              comments[i].data.created
            );
          }
          
        });

      });
      // request(item.data.url + '.json', function(error, response, body) {
      //     if (error)
      //       console.log('Failed to get reddit data for: ' + item.data.title);
            
      //     console.log("got response for " + item.data.title + " : " + response.statusCode);
      //     //console.log(response.body);
      //     if (response == undefined || response.body == undefined) {
      //       console.log("Error: Response did not contain a body: ")
      //       console.dir(response);
      //       return;
      //     }
      //     results = JSON.parse(response.body);
      //     console.dir(response.body);
      //     //callback();
      //   });
      //   return;
      children = children.concat(slice.children);
      return slice.next().then(handleSlice);
    }
    
    return reddit('/r/$subreddit/hot').listing({
      $subreddit: subreddit,
      limit: 10
    }).then(handleSlice);
  },
  
  getAll: function () {
  
    var children = [];
  
    function handleSlice(slice) {
      if (slice.empty) {
        return children;
      }
  
      printSlice(slice);
      children = children.concat(slice.children);
      return slice.next().then(handleSlice);
    }
    
    function printSlice(slice) {
      slice.stickied.forEach(function(item, i) {
        console.log('**STICKY**', item.data.title.substring(0, 20) + '...');
      });
    
      slice.children.forEach(function(child, i) {
        console.log(slice.count + i + 1, child.data.title.substring(0, 20) + '...');
      });
    }
    console.log("fetching reddit posts");
    
    return reddit('/r/$subreddit/hot').listing({
      $subreddit: 'thewalkingdead',
      limit: 10
    }).then(handleSlice);
  },
  
  clearSubreddit: function (subreddit) {
    Comment.clearComments(subreddit);
  }
}
