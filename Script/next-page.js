let jokeList = document.getElementById('joke-list');
let jokes = JSON.parse(localStorage.getItem('dadJokes'));
let favorite = [];
let favContainer = document.getElementById('fav-container');
let fav = document.getElementById('fav');
console.log(jokes);

const ratingStars = [...document.getElementsByClassName(".rating__star")];

for (let i = 0; i < jokes.length; i++) {
  let li = document.createElement('li')
  li.setAttribute('joke', jokes[i].content)
  li.innerHTML = `${jokes[i].date} <br> ${jokes[i].content}`;

  let b = document.createElement('button');
  b.innerText = 'Add to Favorites';
  b.setAttribute('id', `fav-btn-${i}`);
  b.addEventListener('click', () => 
  addFavorite(i))

  li.appendChild(b);

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
}

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

// code for star rating

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