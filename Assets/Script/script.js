// Function to ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  fetchAndDisplayRandomJokes(10);
});

let favorite = [];
let jokeArray = [];
let favContainer = document.getElementById('fav-container');
let fav = document.getElementById('fav');
let jokeList = document.getElementById('joke-list');
let globalJokeTextValue = '';

// Beginning: function to fetch and display dad jokes
async function fetchAndDisplayRandomJokes(numJokes) {
  try {
    // var jokesContainer = document.getElementById('jokesContainer');

    for (let i = 0; i < numJokes; i++) {
      // Fetch a random dad joke from the icanhazdadjoke API
      var response = await fetch('https://icanhazdadjoke.com/', {
        headers: {
          'Accept': 'application/json'
        }
      })

      var data = await response.json();
      var joke = data.joke;
      console.log(joke)

      jokeArray.push(joke);
    }

    console.log(jokeArray)

    // Beginning: display jokes from array, create HTML elements and attributes w/ desired content
    for (let i = 0; i < jokeArray.length; i++) {
      let li = document.createElement('li');
      li.setAttribute('id', 'joke-li')
      li.setAttribute('joke', jokeArray[i].content);

      // Dynamically take jokes from array and display
      let jokeText = document.createElement('p');
      jokeText.setAttribute('id', `pTag-${i}`);
      jokeText.textContent = jokeArray[i];
      li.append(jokeText);

      // Dynamically create favorite buttons
      let buttonFav = document.createElement('button');
      buttonFav.innerText = 'Add to Favorites';
      buttonFav.setAttribute('id', `fav-btn-${i}`);
      buttonFav.addEventListener('click', () =>
        addFavorite(i))

      // Dynamically create send email buttons
      let buttonEmail = document.createElement('button');
      buttonEmail.innerText = 'Send Joke as Email';
      buttonEmail.setAttribute('id', `email-btn-${i}`);
      buttonEmail.setAttribute('class', 'email-btn js-modal-trigger');
      buttonEmail.setAttribute('data-target', 'modal-js-example');

      // Wrap buttons in a div for styling
      let buttonsDiv = document.createElement('div');
      buttonsDiv.style.display = 'flex';
      buttonsDiv.style.gap = '10px';

      // Append buttons to div
      buttonsDiv.appendChild(buttonFav);
      buttonsDiv.appendChild(buttonEmail);

      // Append the div containing both buttons to the li
      li.appendChild(buttonsDiv);

      jokeList.appendChild(li);
    }
    // End: display jokes from array, create HTML elements and attributes w/ desired content

    // Beginning: Modal functionality
    // Functions to open and close a modal
    // function openModal($el) {
    //   $el.classList.add('is-active');
    // }

    // function closeModal($el) {
    //   $el.classList.remove('is-active');
    // }

    // // Add a click event on buttons to open a specific modal
    // (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    //   const modal = $trigger.dataset.target;
    //   const $target = document.getElementById(modal);

    //   $trigger.addEventListener('click', () => {
    //     openModal($target);
    //   });
    // });

    // // Add a click event on various child elements to close the parent modal
    // (document.querySelectorAll('.modal-background, .modal-close') || []).forEach(($close) => {
    //   const $target = $close.closest('.modal');

    //   $close.addEventListener('click', () => {
    //     closeModal($target);
    //   });
    // });
    // End: Modal functionality

    grabJokeText();

    // When "Send Joke as Email" is clicked, capture the text value from the p tag that triggered event and save for sendEmail function
    // const buttons = document.querySelectorAll('.email-btn');
    // buttons.forEach(button => {
    //   button.addEventListener('click', function (event) {
    //     // This function is called when a button is clicked.
    //     // Additional logic to ensure it's an email-btn
    //     if (event.target.classList.contains('email-btn')) {
    //       const jokeTextP = event.target.closest('li').querySelector('p'); // Selecting the <p> element directly now
    //       globalJokeTextValue = jokeTextP ? jokeTextP.textContent : 'Joke not found'; // Use textContent to get just the text

    //       console.log('Joke text:', globalJokeTextValue);
    //     }
    //   });
    // });

  } catch (error) {
    console.error('Error fetching dad joke:', error);
  }
}
// End: function to fetch and display dad jokes

// Beginning: When "Send Joke as Email" is clicked, capture the text value from the p tag that triggered event and save for sendEmail function
function grabJokeText() {
  // Beginning: Modal functionality
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');

    // Reset the form within the modal
    var form = document.getElementById('emailForm');
    if (form) {
      form.reset(); // This resets all form fields to their default values
    }
  };

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });
  // End: Modal functionality

  const buttons = document.querySelectorAll('.email-btn');
  buttons.forEach(button => {
    button.addEventListener('click', function (event) {
      // This function is called when a button is clicked.
      // Additional logic to ensure it's an email-btn
      if (event.target.classList.contains('email-btn')) {
        const jokeTextP = event.target.closest('li').querySelector('p'); // Selecting the <p> element directly now
        globalJokeTextValue = jokeTextP ? jokeTextP.textContent : 'Joke not found'; // Use textContent to get just the text

        console.log('Joke text:', globalJokeTextValue);
      }
    });
  });
};
// End: When "Send Joke as Email" is clicked, capture the text value from the p tag that triggered event and save for sendEmail function


// Beginning: Favorite items section
let favoriteList = document.getElementById('favorite-list');
if (!favoriteList) {
  favoriteList = document.createElement('ul');
  favoriteList.setAttribute('id', 'favorite-list');
  favContainer.appendChild(favoriteList);
}
// add favorites
function addFavorite(jokeIndex, rating) {
  const selectedJoke = jokeArray[jokeIndex];
  console.log(selectedJoke);

  let favJokeObject = {
    content: selectedJoke,
    rating: rating || 0
  };
  // Check if the joke is not already in the favorite array
  if (!favorite.some(fav => fav.content === selectedJoke)) {
    favorite.push(favJokeObject);
    console.log(`Joke added to favorites: ${selectedJoke}`);
    console.log(favorite);

    displayFavoriteJokes();

    // Save the updated favorite array to localStorage
    localStorage.setItem('favoriteJokes', JSON.stringify(favorite));

  } else {
    alert('Already in favorites! 😄');
  }
}

// Add event listener for "Remove from Favorites" button
function removeFavorite(jokeIndex) {
  const selectedJoke = favorite[jokeIndex];
  const indexToRemove = favorite.findIndex(fav => fav.content === selectedJoke);
  if (indexToRemove !== -1) {
    favorite.splice(indexToRemove, 1);
    console.log(`Joke removed from favorites: ${selectedJoke}`);
    localStorage.setItem('favoriteJokes', JSON.stringify(favorite));
    //updateFavoriteButton(jokeIndex, false);
    displayFavoriteJokes();
  }
}

function displayFavoriteJokes() {
  favoriteList.innerHTML = '';

  favorite.forEach((favJoke, jokeIndex) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    li.setAttribute('id', 'joke-li');
    btn.innerText = 'Remove from Favorites';
    btn.setAttribute('id', 'remove-btn')
    btn.addEventListener('click', () => removeFavoriteButton(jokeIndex));
    console.log(favJoke);

    let jokeFavText = document.createElement('p');
    jokeFavText.textContent = favJoke.content;

    li.appendChild(jokeFavText);

    // Create a text node for the joke content and append it to the li
    // const textNode = document.createTextNode(favJoke.content);
    // li.appendChild(textNode);
    // li.appendChild(btn);

    // Dynamically create send email buttons
    let buttonFavEmail = document.createElement('button');
    buttonFavEmail.innerText = 'Send Joke as Email';
    buttonFavEmail.setAttribute('class', 'email-btn js-modal-trigger');
    buttonFavEmail.setAttribute('data-target', 'modal-js-example');

    // // Wrap buttons in a div for styling
    let buttonsFavDiv = document.createElement('div');
    buttonsFavDiv.style.display = 'flex';
    buttonsFavDiv.style.gap = '10px';

    // // Append buttons to div
    buttonsFavDiv.appendChild(btn);
    buttonsFavDiv.appendChild(buttonFavEmail);

    // // Append the div containing both buttons to the li
    li.appendChild(buttonsFavDiv);

    // Create a div for the star rating and add it to the li
    let starRatingDiv = document.createElement('div');
    starRatingDiv.classList.add('rating');

    // Create a new set of five stars for each li
    for (let j = 0; j < 5; j++) {
      let star = document.createElement('i');
      star.classList.add('rating__star', 'fa-regular', 'fa-star');
      starRatingDiv.appendChild(star);
    }

    li.appendChild(starRatingDiv);

    // Execute the rating function for each favorite joke after they are displayed
    const ratingStarsInLi = [...li.querySelectorAll('.rating .rating__star')];
    executeRating(ratingStarsInLi, jokeIndex, favorite);

    // Set the initial state of stars based on the stored rating
    const storedRating = favJoke.rating || 0;

    setInitialStarsState(ratingStarsInLi, storedRating);

    favoriteList.appendChild(li);
    // saveRatingToLocalStorage(jokeIndex, favorite);
  });
  grabJokeText();
}

function removeFavoriteButton(jokeIndex) {
  const joke = favorite[jokeIndex].content;
  const jokeIndexToRemove = favorite.findIndex(fav => fav.content === joke);
  if (jokeIndexToRemove !== -1) {
    favorite.splice(jokeIndexToRemove, 1);
    console.log(`Joke removed from favorites: ${joke}`);
    localStorage.setItem('favoriteJokes', JSON.stringify(favorite));
    //updateFavoriteButton(jokeIndex, false);
    displayFavoriteJokes();
  } else {
    console.error(`Joke with content '${joke}' not found in favorites.`);
  }
}

// End: Favorite items section

// Beginning: code for star rating
function setInitialStarsState(stars, rating) {
  const starClassActive = "fa-solid";
  const starClassInactive = "fa-regular";

  for (let i = 0; i < stars.length; i++) {
    if (i < rating) {
      stars[i].classList.add(starClassActive);
    } else {
      stars[i].classList.remove(starClassActive);
    }
    stars[i].classList.add(starClassInactive);
  }
}

function executeRating(stars, jokeIndex, favorites) {
  const starClassActive = "fa-solid";
  const starClassInactive = "fa-regular";
  const starsLength = stars.length;

  stars.map((star, index) => {
    star.onclick = () => {
      console.log(`Clicked on star ${index + 1} for joke ${jokeIndex}`);
      for (let i = 0; i <= index; i++) {
        stars[i].classList.remove(starClassInactive);
        stars[i].classList.add(starClassActive);
      }

      for (let i = index + 1; i < starsLength; i++) {
        stars[i].classList.remove(starClassActive);
        stars[i].classList.add(starClassInactive);
      }

      favorites[jokeIndex].rating = index + 1;

      // Save the rating to local storage
      saveRatingToLocalStorage(jokeIndex, index + 1, favorites);
    };
  });
}

function saveRatingToLocalStorage(jokeIndex, rating, favorites) {
  let storedFavorites = JSON.parse(localStorage.getItem('favoriteJokes')) || [];

  if (jokeIndex >= 0 && jokeIndex < favorites.length) {
    const selectedJoke = favorites[jokeIndex];
    const existingFavoriteIndex = storedFavorites.findIndex(fav => fav.content === selectedJoke.content);

    if (existingFavoriteIndex !== -1) {
      storedFavorites[existingFavoriteIndex].rating = rating;
      localStorage.setItem('favoriteJokes', JSON.stringify(storedFavorites));
    } else {
      console.error("Selected joke not found in stored favorites.");
    }
  } else {
    console.error("Invalid jokeIndex or favorites structure.");
  }
}

// Ensure that the localStorage is loaded before displaying favorite jokes
const storedFavoriteJokes = JSON.parse(localStorage.getItem('favoriteJokes')) || [];
favorite = storedFavoriteJokes;

// Display favorite jokes with star ratings
displayFavoriteJokes();

// Execute the rating function for each favorite joke after they are displayed
document.querySelectorAll('#favorite-list li').forEach((li, index) => {
  const ratingStarsInLi = [...li.querySelectorAll('.rating .rating__star')];
  executeRating(ratingStarsInLi, index, favorite);
});
// End: code for star rating

// When form is submitted, get jokeTextValue and initiate sendEmail function
var form = document.getElementById('emailForm');

// Beginning: When "Send Email" is clicked, get form values, initiate isValidEmail function, and determine when to send email
form.addEventListener('submit', function (event) {
  event.preventDefault();

  // Get form values
  var email = document.getElementById('email').value;
  var time = document.getElementById('time').value;

  // Validate email format
  if (!isValidEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  console.log("time is " + time);

  // Convert "Scheduled Time" user input to milliseconds
  var scheduledTime = new Date(time).getTime();

  // Get current time and round it down to the nearest minute (aka omit the seconds) for easier comparison
  var now = new Date();
  var currentTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()).getTime();

  console.log(currentTime)
  console.log(scheduledTime)

  // Check if the scheduled time is in the past, if so, present alert
  if (scheduledTime < currentTime) {
    alert('Please select a current or future time for sending the email.');
    return;
  }

  // Calculate the delay until the scheduled time
  var delay = scheduledTime - currentTime;

  console.log("Delay " + delay);

  // Schedule email sending after the specified delay
  setTimeout(function () {
    // Fetch a random dad joke from the icanhazdadjoke API and send email
    sendEmail(email, globalJokeTextValue);
  }, delay);

  console.log('Email will be sent at:', new Date(scheduledTime));
});
// End: When "Send Email" is clicked, get form values, initiate isValidEmail function, and determine when to send email

// Beginning: Ensure a valid email address is entered
function isValidEmail(email) {
  // Very basic email validation
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
// End: Ensure a valid email address is entered

// Beginning: Send Email
emailjs.init('OSTC9CDijl7B2xwUF'); //Your EmailJS user ID
let sender = document.getElementById('sender-name');
let recipient = document.getElementById('to-name')
function sendEmail(email, joke) {
  // Use EmailJS to send email
  emailjs.send('service_q71jh2q', 'template_ax0nhz9', {
    to_email: email,
    joke_content: joke,
    to_name: recipient.value,
    from_name: sender.value
  })
    .then(function (response) {
      console.log('Email sent:', response);
      alert('Email sent successfully!');
    }, function (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again later.');
    });
};
// End: Send Email

//function to refresh page when refresh button is clicked
function refreshPg() {
  window.location.reload();
}
window.addEventListener('load', () => {
  // timeout for refresh button delay
  window.setTimeout(() => {
    const elements = document.querySelectorAll('.hide');
    elements.forEach(element => {
      element.classList.remove('hide');
    });
  }, 1300);
});