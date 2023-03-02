'use strict';

$(document).ready(function () {
  // Variables and Array for Random Dad response and Queue
  const responseQueue = [];
  let workingOnQueue = false;
  const randomDadTexts = [
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
    `OK. I'LL TAKE A NAP.`,
  ];

  getSessionStorageChat();

  /* Extracts Chat from Session Storage
    - get Chat Key reference => tracks number of messages stored
    - loop over getChatKey
    - extract value chatHistory
    - append it to message container
    - scroll down to last message or get random dad message
  */
  function getSessionStorageChat() {
    if (sessionStorage.getItem(`chatKeys`)) {
      const $getChatKey = $(sessionStorage.getItem('chatKeys').split(','));
      $('.message-container').text('');

      $getChatKey.each((idx) => {
        const textBlock = sessionStorage.getItem(`chatHistory${idx}`);
        $('.message-container').append(textBlock);
      });
    }
    $('.message').length > 0 ? scrollToLastMessage(false, 0) : introText();
  }

  // Chat App Introduction on new Chat
  function introText() {
    getRandomDadResponse(
      "Alloh! It's been a while. How are you doing? \nI'm still getting used to typing on this phone keyboard.\nSo bear with me it might take a while to respond."
    );
    getRandomDadResponse(
      'But I will respond to every text. Promise!\nGreetings, Dad'
    );
  }

  /* Save Chat from Session Storage
    - collect all messages
    - loop over messages and count and create Chat Keys reference
    - again loop over messages and store 
    - message value with chatHistory[Chat Key]
  */
  function saveSessionStorageChat() {
    const $chatElements = $('.message');
    const setChatKey = [];

    $chatElements.each((idx) => {
      setChatKey[idx] = idx;
    });
    sessionStorage.setItem('chatKeys', setChatKey);

    $chatElements.each((idx, msg) => {
      sessionStorage.setItem(`chatHistory${idx}`, msg.outerHTML);
    });
  }

  /* DELETE Session Storage
    - get Chat Keys reference
    - loop over keys and remove respective chatHistory messages
      from session storage, 
   */
  $('#delete-chat').on('click', function () {
    const $getChatKey = $(sessionStorage.getItem('chatKeys').split(','));

    $getChatKey.each((idx) => {
      sessionStorage.removeItem(`chatHistory${idx}`);
    });
    getSessionStorageChat();
    sessionStorage.removeItem(`chatKeys`);
  });

  /* Let your Dad tell you a joke
    - calls API to fetch a joke
    - extract the data from response json
    - create text-message and get amused by dad
  */
  $('#joke-button').on('click', function () {
    // fetch GET request tailored to dadjoke => see their documentation https://icanhazdadjoke.com/api
    const config = {
      headers: {
        Accept: 'application/json',
      },
      UserAgent: 'Playing with API for project (https://github.com/ReneCodes)',
    };
    fetch('https://icanhazdadjoke.com/', config)
      .then((res) => res.json())
      .then((data) => {
        buildMessageBlock('Tell me a joke, Dad!', 'right');
        responseQueue.push([data.joke, 2000]);
        workingOnQueue == false ? workOnResponseQueue() : null;
      });
  });

  // Prevents 'reload page on submit' default behaviour
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
      0.092 * (event.target.offsetWidth - event.target.offsetLeft * 2)
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

  /* "SENT" Text Message
    - checks for input value in Textarea,
    - calls functions to build messages and 
      passes function to extract input value
  */
  $('.sent-text-btn').on('click', function () {
    if ($('#input')[0].value.length >= 1) {
      buildMessageBlock(
        getUserMessage() || 'Default Message \n Something went wrong',
        'right',
        true
      );
    }
    focusOnInput();
  });

  // Extracts and returns message from textarea
  function getUserMessage() {
    return $('#input')[0].value;
  }

  // Sets focus on Input textarea
  function focusOnInput() {
    $('#input')[0].focus();
  }

  /** Build Message Blocks
    - create HTML elements
    - add classes and content
    - call timestamp
    - append message to Message-Container
    - call random dad respoonse when message comes from user
    - calling function to store message 
    @param {String} textMessage - text for message
    @param {String} position - class for message to display left | right
    @param {Boolean} human - true: input from user | false: random message
  */
  function buildMessageBlock(message, position = 'left', human = false) {
    const $message = $('<div>');
    const $block = $('<div>');
    const $text = $('<div>');
    const $timestamp = $('<div>');

    $message.addClass('message').addClass(position);
    $block.addClass('text-block');
    $text.addClass('text').text(message).appendTo($block);
    $timestamp
      .addClass('timestamp')
      .html(`<p>${getTimestamp()}</p>`)
      .appendTo($block);
    $message.append($block);

    $('.message-container').append($message);

    // scroll down to end last message
    scrollToLastMessage(true);
    //clear message in textarea when a human send a text
    if (human) {
      $('#input')[0].value = '';
      $('#input')[0].rows = 1;
      getRandomDadResponse();
    }
    saveSessionStorageChat();
  }

  /* Create Timestamp
    - get date
    - extract hour, minutes
    - extract day, month, year
    - concat and return timestamp string
  */
  function getTimestamp() {
    const fullDate = new Date();
    const time = fullDate.toLocaleTimeString(); // '15:36:47'
    const date = fullDate.toDateString().split(' '); // ['Tue', 'Feb', '28', '2023']

    const timeStamp = `${date[2]}.${date[1]}.${date[3].slice(
      2,
      4
    )}&nbsp&nbsp${time.slice(0, 5)}`;

    return timeStamp;
  }

  /** Random Dad Response
    - choose random message from Array
    - calculate delay time depending on text length
    - push message with delay time into response queue
    - call function to work on response queue
    @param {String} text - provided text for generated message
  */
  function getRandomDadResponse(text = '') {
    let randomText = '';
    let delay = 1600;

    if (text) {
      randomText = text;
    } else {
      randomText =
        randomDadTexts[Math.floor(Math.random() * randomDadTexts.length)];
      delay += randomText.length * 15;
    }
    responseQueue.push([randomText, delay]);
    workingOnQueue == false ? workOnResponseQueue() : null;
  }

  /* Working On Response Queue
    - call build message after timeout
    - recursively call function until queue is empty
    - work a response queue to answer chronologically
  */
  function workOnResponseQueue() {
    // is there work todo?
    if (responseQueue.length > 0) {
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

  /** Scroll Down
    - animates to scroll down to last message
      in default time 1.6s
    - instant scroll down when loading messages
    - calls function to fade in only new messages
    @param {Number} time - set delay time for scrolling | default: 1600
    @param {Boolean} newText - true: newly added text | false: text from session storage
  */
  function scrollToLastMessage(newText = false, time = 1600) {
    // Reference: jQuery documentation .animate()
    $('.message-container').animate(
      { scrollTop: $('.message').last()[0].offsetTop },
      {
        duration: time,
        queue: false, // run animation outside queue, start without waiting
      }
    );
    fadeInMessage(newText);
  }

  /** Display messages
    - fade-in every newly added messages
    - instantly display existing messages from storage
    @param {Boolean} _newText - true: opacity duration 800 | false: instantly to opacity 1
  */
  function fadeInMessage(_newText) {
    if (_newText) {
      $('.message').animate({ opacity: 1 }, { duration: 800 });
    } else {
      $('.message').css('opacity', 1);
    }
  }
});
