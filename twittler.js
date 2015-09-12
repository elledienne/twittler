var latestTweetIndex = null; // This var keeps track of the latest tweet showed
var $feed;

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
    var $tweet = $('<article class="tweet"></article>');
    $tweet.html(
      '<section class="tweet-info">' +
      '  <ul>' +
      '    <li class="username"><a href="userprofile.html?' + tweet.user + '">' + tweet.user + '</a></li>' +
      '    <li class="timestamp"> - ' + tweet.created_at + ' </li>' +
      '  </ul>' +
      '</section>' +
      '<section class="tweet-content">' + tweet.message + '</section>'
    );
    $tweet.prependTo($feed);
    latestTweetIndex++;
  }
};

// This function keeps checking if new tweets are added to the streams.home array
var checkUpdates = function(){
  if(latestTweetIndex === null || latestTweetIndex !== streams.home.length){
    showTweet(); // If new tweets -> call the function to show them
  }
  setTimeout(checkUpdates, 100);
}

$(document).ready(function(){
  $feed = $('body .feed');
  $feed.html('');
  var pageURL = window.location.href
  var page = pageURL.slice(pageURL.lastIndexOf('/')+1, -5);

  if(page === 'index') {
    checkUpdates(); // Here is where the magic begins
  } else if(page === 'userprofile') {
    var username = window.location.search;
  }
});
