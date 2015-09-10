$(document).ready(function(){
  var latestTweetIndex = null; // This var keeps track of the latest tweet showed
  var $body = $('body');
  $body.html('');

  // This function prepend a new DIV inside the BODY element for every new tweet
  var showTweet = function(){
    if(latestTweetIndex === null){
      latestTweetIndex = 0;
    }
    if(latestTweetIndex >= 25){ // For development purpose; That continuous flow of tweets was exasperating =P
      return;
    }
    while(latestTweetIndex <= streams.home.length-1){
      var tweet = streams.home[latestTweetIndex];
      var $tweet = $('<div></div>');
      $tweet.text('@' + tweet.user + ': ' + tweet.message);
      $tweet.prependTo($body);
      latestTweetIndex++;
    }
  };

  // This function keep checking if new tweets are added to the streams.home array
  var checkUpdates = function(){
    if(latestTweetIndex === null || latestTweetIndex !== streams.home.length){
      showTweet(); // If new tweets -> call the function to show them
    }
    setTimeout(checkUpdates, 100);
  }

  checkUpdates(); // Here is where the magic begins

});
