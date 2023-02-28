/**
 * get access to input
 * attache eventlistener "enter"
 * create message function

 * 
 * get access to input
 * attache eventlistener "click"
 * create message function
 * 
 * function create message 
 * build and create text-block
 * create timestamp function
 * attach classes
 * append text-block to message-container
 * scroll down to lowest text-block function
 * call auto-answer function with (random time function)
 * 
 * function random time
 * generate and return random millisecond 
 * 
 * function auto-answer
 * build and create text-block
 * fill text with random text from text-array-library
 * create timestamp function
 * attach classes
 * append text-block to message-container
 * scroll down to lowest text-block function
 * 
 * function create timestamp 
 * https://api.jquery.com/event.timeStamp/
 * get new date (new Date).getTime()
 * extract date dd/mmm/yy
 * calculate time 24h
 * build timestamp 27. Feb. 23 | 14:02
 * hour and minutes shall always have 2 digits 00 - 24
 * return timestamp
 * 
 * function lowest-text-block-scroll
 * get position on last text-block
 * scroll down to it
*/

/*
  jQuery
  2 ways to loop through jQuery collection
  
  $paragraphs.each(function (index, element){
    $paragraph = $(element);
    $paragraph.html(paragraph.html() + "...woweeee!");
  })

  // using this keyword
  $paragraphs.each(function (index, element){
    $paragraph = $(this);
    $paragraph.html(paragraph.html() + "...woweeee!");
  })
*/

/*
  jQuery eventlistener
    .on('listener', function(event){});

  $("#dog-pic").on("click", function(event) {
        var $dot = $("<div></div>");
        console.log(event);
        $dot.addClass("dot");
        $dot.css("top", event.pageY + 'px')
            .css("left", event.pageX + 'px');
        $dot.appendTo("body");
  });

*/

$(document).ready(function () {
  // Creates a new <audio> element
  var $sound = $('<audio preload=auto>');
  // See below for more sound URLs you can use
  $sound.attr(
    'src',
    'https://www.kasandbox.org/programming-sounds/retro/hit1.mp3'
  );

  // Play sound on send
  $('.btn').on('click', function () {
    $sound[0].play();
    buildMessageBlock('This is a test message', 'right');
  });

  $('#send-text').on('submit', function (event) {
    event.preventDefault();
  });

  $('#input').on('input', function (event) {
    // console.log(event);
  });

  // build message
  function buildMessageBlock(message, user) {
    const $message = $('<div>');
    const $block = $('<div>');
    const $text = $('<div>');
    const $timestamp = $('<div>');

    $message.addClass('message').addClass(user);
    $block.addClass('text-block');
    $text.addClass('text').text(message).appendTo($block);
    $timestamp.addClass('timestamp').text('timestamp').appendTo($block);
    $message.append($block);
    $('.message-container').append($message);
    // scroll down to end of message block

    //clear message in textarea
    $('#input')[0].value = '';
    $('#input')[0].focus();
  }
});
