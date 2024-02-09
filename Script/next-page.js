// Add function to ensure DOM is fully loaded

// fetchAndDisplayRandomJokes
// addJokeToLocalStorage

let jokeList = document.getElementById('joke-list');
let jokes = JSON.parse(localStorage.getItem('dadJokes'));
let favorite = [];
let favContainer = document.getElementById('fav-container');
let fav = document.getElementById('fav');
console.log(jokes);

const ratingStars = [...document.getElementsByClassName(".rating__star")];

for (let i = 0; i < jokes.length; i++) {
  let li = document.createElement('li');
  li.setAttribute('joke', jokes[i].content);
  // li.innerHTML = `${jokes[i].date} <br> ${jokes[i].content}`;

  let jokeDate = document.createElement('h6');
  jokeDate.textContent = jokes[i].date;
  li.append(jokeDate);

  let jokeText = document.createElement('p');
  jokeText.textContent = jokes[i].content;
  li.append(jokeText);


  // Dynamically create favorite buttons
  let buttonFav = document.createElement('button');
  buttonFav.innerText = 'Add to Favorites';
  buttonFav.setAttribute('id', `fav-btn-${i}`);
  buttonFav.addEventListener('click', () =>
    addFavorite(i))

  // li.appendChild(buttonFav);

  // Dynamically create send email buttons
  let buttonEmail = document.createElement('button');
  buttonEmail.innerText = 'Send Joke as Email';
  buttonEmail.setAttribute('id', `email-btn-${i}`);
  buttonEmail.setAttribute('class', 'email-btn js-modal-trigger');
  buttonEmail.setAttribute('data-target', 'modal-js-example');

  // Wrap buttons in a div for styling
  let buttonsDiv = document.createElement('div');
  buttonsDiv.style.display = 'flex'; // Use Flexbox
  buttonsDiv.style.gap = '10px'; // Optional: adds space between buttons

  buttonsDiv.appendChild(buttonFav);
  buttonsDiv.appendChild(buttonEmail);

  // Append the div containing both buttons to the li
  li.appendChild(buttonsDiv);


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

  jokeList.appendChild(li);

  // Execute the rating function for each li element
  const ratingStarsInLi = [...li.querySelectorAll('.rating .rating__star')];
  executeRating(ratingStarsInLi, i); // Pass the joke index as a parameter

  // Set the initial state of stars based on the stored rating
  const storedRating = jokes[i].rating || 0;
  setInitialStarsState(ratingStarsInLi, storedRating);
} // end of for (let i = 0; i < jokes.length; i++)


// Beginning: Favorite items section
let favoriteList = document.getElementById('favorite-list');
if (!favoriteList) {
  favoriteList = document.createElement('ul');
  favoriteList.setAttribute('id', 'favorite-list');
  favContainer.appendChild(favoriteList);
}

function addFavorite(jokeIndex) {
  const selectedJoke = jokes[jokeIndex];

  // Check if the joke is not already in the favorite array
  if (!favorite.includes(selectedJoke)) {
    favorite.push(selectedJoke);
    console.log(`Joke added to favorites: ${selectedJoke.content}`);

    // Optionally, you can update the UI to reflect that the joke is now a favorite
    // For example, you can change the button text or color
    updateFavoriteButton(jokeIndex, true);
    displayFavoriteJokes();
  } else {
    // Remove the joke from favorites if it's already there
    const indexToRemove = favorite.findIndex(fav => fav.content === selectedJoke.content);
    if (indexToRemove !== -1) {
      favorite.splice(indexToRemove, 1);
      console.log(`Joke removed from favorites: ${selectedJoke.content}`);
      updateFavoriteButton(jokeIndex, false);
      displayFavoriteJokes();
    }
  }

  // Save the updated favorite array to localStorage
  localStorage.setItem('favoriteJokes', JSON.stringify(favorite));
}

// Add event listener for "Remove from Favorites" button
document.querySelectorAll('.fav-btn-remove').forEach((removeBtn, index) => {
  removeBtn.addEventListener('click', () => removeFavorite(index));
});

function removeFavorite(jokeIndex) {
  if (jokeIndex >= 0 && jokeIndex < favorite.length) {
    const removedJoke = favorite.splice(jokeIndex, 1)[0];
    console.log(`Joke removed from favorites: ${removedJoke.content}`);
    displayFavoriteJokes();
    localStorage.setItem('favoriteJokes', JSON.stringify(favorite));
  } else {
    console.error("Invalid jokeIndex or favorite structure.");
  }
}

function displayFavoriteJokes() {
  favoriteList.innerHTML = ''

  favorite.forEach((favJoke, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${favJoke.date} <br> ${favJoke.content}`;
    favoriteList.appendChild(li);
  });
}

function updateFavoriteButton(jokeIndex, Favorite) {
  const favBtn = document.getElementById(`fav-btn-${jokeIndex}`);
  if (favBtn) {
    favBtn.innerText = Favorite ? 'Remove from Favorites' : 'Add to Favorites';
    favBtn.classList.toggle('fave-btn-remove', Favorite);
    // Optionally, you can also change the button color or style
  }
}

// Optionally, you can also initialize the UI based on the existing favorites
const storedFavoriteJokes = JSON.parse(localStorage.getItem('favoriteJokes')) || [];
favorite = storedFavoriteJokes;

// Update UI for existing favorite jokes
for (let i = 0; i < jokes.length; i++) {
  const isFavorite = storedFavoriteJokes.some(fav => fav.content === jokes[i].content);
  updateFavoriteButton(i, isFavorite);
}

displayFavoriteJokes();
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

function executeRating(stars, jokeIndex) {
  const starClassActive = "fa-solid";
  const starClassInactive = "fa-regular";
  const starsLength = stars.length;

  stars.map((star, index) => {
    star.onclick = () => {
      for (let i = 0; i <= index; i++) {
        stars[i].classList.remove(starClassInactive);
        stars[i].classList.add(starClassActive);
      }

      for (let i = index + 1; i < starsLength; i++) {
        stars[i].classList.remove(starClassActive);
        stars[i].classList.add(starClassInactive);
      }

      // Save the rating to local storage
      const rating = index + 1;
      saveRatingToLocalStorage(jokeIndex, rating);
    };
  });
}

function saveRatingToLocalStorage(jokeIndex, rating) {
  let storedJokes = JSON.parse(localStorage.getItem('dadJokes')) || [];

  console.log("storedJokes:", storedJokes);
  console.log("jokeIndex:", jokeIndex);

  if (jokeIndex >= 0 && jokeIndex < storedJokes.length) {
    storedJokes[jokeIndex].rating = rating;
    localStorage.setItem('dadJokes', JSON.stringify(storedJokes));
  } else {
    console.error("Invalid jokeIndex or storedJokes structure.");
  }
}
// Execute the rating function for each li element
document.querySelectorAll('#joke-list li').forEach((li, index) => {
  const ratingStarsInLi = [...li.querySelectorAll('.rating .rating__star')];
  executeRating(ratingStarsInLi, index);
});
// End: code for star rating



// When "Send Joke as Email" is clicked, capture the text value from the p tag that triggered event and save for sendEmail function
let globalJokeTextValue = ''; 

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
emailjs.init('e4IMeDjiTLqb2QzFb'); //Your EmailJS user ID

function sendEmail(email, joke) {
  // Use EmailJS to send email
  emailjs.send('service_wv4ctg4', 'template_036nw4v', {
      to_email: email,
      joke_content: joke
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


// Beginning: Modal functionality
// Functions to open and close a modal
function openModal($el) {
  $el.classList.add('is-active');
}

function closeModal($el) {
  $el.classList.remove('is-active');
}

// function closeAllModals() {
//   (document.querySelectorAll('.modal') || []).forEach(($modal) => {
//     closeModal($modal);
//   });
// }

// Add a click event on buttons to open a specific modal
(document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
  const modal = $trigger.dataset.target;
  const $target = document.getElementById(modal);

  $trigger.addEventListener('click', () => {
    openModal($target);
  });
});

// Add a click event on various child elements to close the parent modal
(document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
  const $target = $close.closest('.modal');

  $close.addEventListener('click', () => {
    closeModal($target);
  });
});

// // Add a keyboard event to close all modals
// document.addEventListener('keydown', (event) => {
//   if(e.key === "Escape") {
//     closeAllModals();
//   }
// });

// End: Modal functionality