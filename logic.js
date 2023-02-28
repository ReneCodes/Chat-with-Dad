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
  scrollToLastMessage();

  const randomDadText = [
    'Alloh!',
    'Whitespace',
    'let me ask your mom',
    'Is it broken?',
    'I have no idea :( Sorry',
  ];

  // Creates a new <audio> element
  const $sound = $('<audio preload=auto>');
  // See below for more sound URLs you can use
  $sound.attr(
    'src',
    'https://www.kasandbox.org/programming-sounds/retro/hit1.mp3'
  );

  // Play sound on send
  /* TODO
    only send message when inut value greater-equal 1
  */
  $('.btn').on('click', function () {
    // if ($('#input')[0].value.length >= 1) {}
    $sound[0].play();
    buildMessageBlock(getUserMessage() || 'Test Test', 'right', true);
    getTimestamp();
    focusOnInput();
  });

  $('#send-text').on('submit', function (event) {
    event.preventDefault();
  });

  $('#input').on('input', function (event) {
    // console.log(event);
  });

  // extract human message from textarea
  function getUserMessage() {
    return $('#input')[0].value;
  }

  function focusOnInput() {
    $('#input')[0].focus();
  }

  // build message
  /* TODO
    call timestamp
    attach timestamp
  */
  function buildMessageBlock(message, position = 'left', human = false) {
    const $message = $('<div>');
    const $block = $('<div>');
    const $text = $('<div>');
    const $timestamp = $('<div>');

    $message.addClass('message').addClass(position);
    $block.addClass('text-block');
    $text.addClass('text').text(message).appendTo($block);
    $timestamp.addClass('timestamp').text(getTimestamp()).appendTo($block);
    $message.append($block);

    $('.message-container').append($message);
    // scroll down to end last message
    scrollToLastMessage(true);
    //clear message in textarea when a human send a text
    if (human) {
      $('#input')[0].value = '';
      focusOnInput();
      getRandomDadResponse();
    }
  }
  /* TODO
    DONE: choose random message
    DONE: call build message with delay
    show dad is typing 
  */
  function getRandomDadResponse() {
    const randomText =
      randomDadText[Math.floor(Math.random() * randomDadText.length)];
    const delay = randomText.length * 500;
    console.log('Dad text delay', delay);
    setTimeout(buildMessageBlock, delay, randomText);
  }

  /* TODO
    DONE: get date
    DONE: extract hour, minutes
    DONE: extract day, month, year
    Done: return timestamp string
  */
  function getTimestamp() {
    const fullDate = new Date();
    const time = fullDate.toLocaleTimeString(); // '15:36:47'
    const date = fullDate.toDateString().split(' '); // ['Tue', 'Feb', '28', '2023']

    const timeStamp = `${date[2]}.${date[1]}.${date[3].slice(
      2,
      4
    )} ${time.slice(0, 5)}`;

    return timeStamp;
  }

  /* TODO
    DONE: scrolling behaviour -> smooth
    DONE: scroll to last item in container
  */
  function scrollToLastMessage(newText = false) {
    // Reference: jQuery documentation .animate()
    $('.message-container').animate(
      { scrollTop: $('.message').last()[0].offsetTop },
      {
        duration: 1600,
        queue: false, // run animation outside queue, start without waiting
      }
    );
    // only fade-in newly added messages
    if (newText) {
      $('.message').animate({ opacity: 1 }, { duration: 1000 });
    } else {
      $('.message').css('opacity', 1);
    }
  }
});
