// set up data structures
window.streams = {};
streams.home = [];
streams.users = {};
streams.users.shawndrost = new User('Steve Jobs', 'An apple a day keeps the doctor away', 1, 30, 19234);
streams.users.sharksforcheap = new User('Bill Gates', 'I used to steal tech stuff, now i\'m a maecenas', 568, 1390, 9247);
streams.users.mracus = new User('Mark Zuckerberg', 'I LOVE TWITTRL !!! The best social network ever!', 918472, 391, 7193);
streams.users.douglascalhoun = new User('Larry Page', 'Just google it', 1739, 192, 1324);
window.users = Object.keys(streams.users);

var latestTweetIndex = null; // This var keeps track of the latest tweet showed
var $feed;

function User(name, bio, ntweet, following, follower){
  this.name = name;
  this.bio = bio;
  this.numberOfTweets = ntweet;
  this.following = following;
  this.follower = follower;
  this.tweets = [];
}

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

var filterUserStream = function(stream, username){
  streams.home = stream.users[username].tweets;
  console.log(streams)
  showTweet();
}

var updateUserProfile = function(username){
  $('.side-profile .profile-image-container').css('background-image', 'url(\'media/img/' + username + '.jpg\')');
  var profileDOM = $('.side-profile');
  var user = streams.users[username];
  profileDOM.find('#name').text(user.name);
  profileDOM.find('#bio').text(user.bio);
  profileDOM.find('.tweets-count .number').text(user.numberOfTweets);
  profileDOM.find('.following .number').text(user.following);
  profileDOM.find('.follower .number').text(user.follower);

}

$(document).ready(function(){
  $feed = $('body .feed');
  $feed.html('');
  var pageURL = window.location.href;
  pageURL = pageURL.slice(pageURL.lastIndexOf('/')+1);
  var page = pageURL.slice(0, pageURL.indexOf('.'));
  console.log(page);
  
  if(page === 'index') {
    checkUpdates(); // Here is where the magic begins
  } else if(page === 'userprofile') {
    console.log('here');
    var username = window.location.search.slice(1);
    updateUserProfile(username);
    var streams = JSON.parse(localStorage.getItem('streams'));
    filterUserStream(streams, username);
  }
});
