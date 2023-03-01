'use strict';

$(document).ready(function () {
  scrollToLastMessage();

  const randomDadText = [
    'Alloh!',
    'Try turning it on and off again.',
    'let me ask your mom',
    'Is it broken?',
    'I have no idea :( Sorry',
    'Thanks, Glad I could help.',
    'Do What You Love',
    'Work Smarter, Not Harder',
    'Come home before the street lights come on',
    'I FINALLY FIGURED OUT HOW TO LOCK THE CAPITAL KEY. THIS IS A GAME CHANGER',
    ':-)',
    'What is Grumpy Cat?',
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
    only send message when input value greater-equal 1
  */
  $('.btn').on('click', function () {
    // if ($('#input')[0].value.length >= 1) {}
    $sound[0].play();
    buildMessageBlock(getUserMessage() || 'Test Test', 'right', true);
    getTimestamp();
    focusOnInput();
  });

  // prevents 'reload page on submit' default behaviour
  $('#send-text').on('submit', function (event) {
    event.preventDefault();
  });

  /* AUTO GROW TEXTAREA HEIGHT
    - checks for line-breaks in the input field
    - auto adds/decreases rows of textarea => max rows 4
    - auto insert line-break when writing continuously
  */
  $('#input').on('input', function (event) {
    let inputValue = event.target.value.split(/\n/g);
    if (inputValue.length > 1 && event.target.rows <= 4) {
      event.target.rows = inputValue.length;
    } else if (inputValue.length === 1) {
      event.target.rows = inputValue.length;
    }

    let maxLetterPerLine = Math.ceil(
      0.092 * (event.target.offsetWidth - event.target.offsetTop * 2)
    );

    // Auto insert linebreak in textarea input when
    // char length exceeds textarea's width
    if (inputValue[inputValue.length - 1].length >= maxLetterPerLine) {
      const splitInput = event.target.value.split(' ');
      const lastWord = splitInput.slice(-1);

      const prepend = splitInput.slice(0, -1).join(' ');
      event.target.value = prepend + '\n' + lastWord;
    }
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
      $('#input')[0].rows = 1;
      focusOnInput();
      getRandomDadResponse();
    }
  }
  /* TODO
    DONE: choose random message
    DONE: call build message with delay
    show dad is typing 
  */

  // creating a response queue to answer chronologically
  // pull random text out of the array
  // calculate delay time depending on text length
  // push to response queue
  // call func to work on responses
  const responseQueue = [];
  let workingOnQueue = false;
  function getRandomDadResponse() {
    const randomText =
      randomDadText[Math.floor(Math.random() * randomDadText.length)];
    const delay = randomText.length * 150;
    // console.log('Dad text delay', delay);
    responseQueue.push([randomText, delay]);
    console.log(randomText);
    // setTimeout(buildMessageBlock, delay, randomText);
    workingOnQueue == false ? workOnResponseQueue() : null;
  }

  // Working on response queue
  // create response message after timeout
  // recursively call function until queue is empty
  function workOnResponseQueue() {
    if (responseQueue.length > 0) {
      // is there work todo?
      workingOnQueue = true;
      const task = responseQueue[0];
      setTimeout(() => {
        buildMessageBlock(task[0]);
        responseQueue.shift();
        workOnResponseQueue();
      }, task[1]);
    } else {
      workingOnQueue = false;
    }
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
