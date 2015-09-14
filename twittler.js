// set up data structures
window.streams = {};
streams.home = [];
streams.users = {};
streams.users.shawndrost = new User('Steve Jobs', 'An apple a day keeps the doctor away', 1, 30, 19234);
streams.users.sharksforcheap = new User('Bill Gates', 'I used to steal tech stuff, now i\'m a maecenas', 568, 1390, 9247);
streams.users.mracus = new User('Mark Zuckerberg', 'I LOVE TWITTRL !!! The best social network ever!', 918472, 391, 7193);
streams.users.douglascalhoun = new User('Larry Page', 'Just google it', 1739, 192, 1324);
streams.users.elledienne = new User('Lorenzo De Nobili', 'I\'m a 22-years-old italian guy. I love coding, i love tweets and most of all i love Hack Reactor =P', 77, 158, 209);
window.users = Object.keys(streams.users);

var loggedUser = 'elledienne' // Not the safest login system ever, but for the purpose of this website should be enough
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
  while(latestTweetIndex <= streams.home.length-1){
    var tweet = streams.home[latestTweetIndex];
    var $tweet = $('<article class="tweet bottom-border"></article>');
    $tweet.html(
      '<section class="tweet-info">' +
      '  <ul>' +
      '    <li class="username"><a href="userprofile.html?' + tweet.user + '">' + tweet.user + '</a></li>' +
      '    <li class="timestamp" moment="' + tweet.created_at + '"> - ' + moment(tweet.created_at).fromNow() + ' </li>' +
      '  </ul>' +
      '</section>' +
      '<section class="tweet-content">' + tweet.message + '</section>'
    );
    $tweet.prependTo($feed);
    latestTweetIndex++;
  }
};

var updateTimestamps = function(){
  var tweetsDOM = $('.panel .feed .tweet .timestamp');
  for(var i = 0; i < tweetsDOM.length; i++){
    var timestamp = tweetsDOM.eq(i).attr('moment');
    tweetsDOM.eq(i).text(moment(timestamp, 'x').fromNow());
  }
}

// This function keeps checking if new tweets are added to the streams.home array
var checkUpdates = function(){
  // The last logical AND is for development purpose only; That continuous flow of tweets was exasperating =P
  if((latestTweetIndex === null || latestTweetIndex !== streams.home.length) && latestTweetIndex <= 50){
    showTweet(); // If new tweets -> call the function to show them
  }
  updateTimestamps();
  setTimeout(checkUpdates, 1000);
}

var filterUserStream = function(stream, username){
  streams.home = stream.users[username].tweets;
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

var sendTweet = function(){
  var textareaDOM = $('.tweet-composer .form textarea[name=tweet-text-composer]');
  var tweet = {};
  tweet.user = 'elledienne';
  tweet.message = textareaDOM.val();
  textareaDOM.val('');
  tweet.created_at = moment();
  addTweet(tweet);
}

$(document).ready(function(){
  $feed = $('body .feed');
  $feed.html('');
  var pageURL = window.location.href;
  pageURL = pageURL.slice(pageURL.lastIndexOf('/')+1);
  var page = pageURL.slice(0, pageURL.indexOf('.'));
  
  var username = window.location.search.slice(1) || loggedUser;
  updateUserProfile(username);
  if(page === 'index') {
    checkUpdates(); // Here is where the magic begins
    $('.tweet-composer #send-tweet').on('click', sendTweet);
  } else if(page === 'userprofile') {
    var streams = JSON.parse(localStorage.getItem('streams'));
    filterUserStream(streams, username);
  }
});
