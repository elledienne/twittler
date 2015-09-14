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
//var $feed;
var nodes = {};

function User(name, bio, ntweet, following, follower){
  this.name = name;
  this.bio = bio;
  this.numberOfTweets = ntweet;
  this.following = following;
  this.follower = follower;
  this.tweets = [];
}
var checkChar = function(){
  //nodes.textareaDOM = $('.tweet-composer .form textarea[name=tweet-text-composer]');
  nodes.charCounter = nodes.charCounter || $('.tweet-composer #send-tweet #char-counter');
  var numberOfChar = 140-nodes.textareaDOM.val().length;
  nodes.charCounter.text(numberOfChar);
  if(numberOfChar < 0){
    nodes.sendTweetButton.prop('disabled', true);
  } else if(nodes.sendTweetButton.prop('disabled') === true && numberOfChar >= 0){
    nodes.sendTweetButton.attr('disabled', false);
  }
}

$(document).on('keyup', '.tweet-composer textarea', function(){
  checkChar();
});

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
    $tweet.prependTo(nodes.feed);
    latestTweetIndex++;
  }
};

var updateTimestamps = function(){
  //var tweetsDOM = $('.panel .feed .tweet .timestamp');
  for(var i = 0; i < nodes.tweetsDOM.length; i++){
    var timestamp = nodes.tweetsDOM.eq(i).attr('moment');
    nodes.tweetsDOM.eq(i).text(moment(timestamp, 'x').fromNow());
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
  //$('.side-profile .profile-image-container').css('background-image', 'url(\'media/img/' + username + '.jpg\')');
  nodes.profileDOM = $('.side-profile');
  var user = streams.users[username];
  nodes.profileDOM.find('.profile-image-container').css('background-image', 'url(\'media/img/' + username + '.jpg\')');
  nodes.profileDOM.find('#name').text(user.name);
  nodes.profileDOM.find('#bio').text(user.bio);
  nodes.profileDOM.find('.tweets-count .number').text(user.numberOfTweets);
  nodes.profileDOM.find('.following .number').text(user.following);
  nodes.profileDOM.find('.follower .number').text(user.follower);
}

var sendTweet = function(){
  //var textareaDOM = $('.tweet-composer .form textarea[name=tweet-text-composer]');
  var tweet = {};
  tweet.user = 'elledienne';
  tweet.message = nodes.textareaDOM.val();
  nodes.textareaDOM.val('');
  tweet.created_at = moment();
  addTweet(tweet);
  nodes.charCounter.text(140);
}

$(document).ready(function(){
  //$feed = $('body .feed');
  nodes.feed = $('body .feed');
  nodes.tweetsDOM = $('.panel .feed .tweet .timestamp');

  nodes.feed.html('');
  var pageURL = window.location.href;
  pageURL = pageURL.slice(pageURL.lastIndexOf('/')+1);
  var page = pageURL.slice(0, pageURL.indexOf('.'));
  
  var username = window.location.search.slice(1) || loggedUser;
  updateUserProfile(username);
  if(page === 'index') {
    checkUpdates(); // Here is where the magic begins
    nodes.textareaDOM = $('.tweet-composer .form textarea[name=tweet-text-composer]');
    nodes.sendTweetButton = $('.tweet-composer #send-tweet');
    nodes.sendTweetButton.on('click', sendTweet);
  } else if(page === 'userprofile') {
    var streams = JSON.parse(localStorage.getItem('streams'));
    filterUserStream(streams, username);
  }
});
