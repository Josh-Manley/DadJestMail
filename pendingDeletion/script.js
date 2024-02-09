emailjs.init('e4IMeDjiTLqb2QzFb'); //Your EmailJS user ID

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
        fetchDadJokeAndSendEmail(email);
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


// Beginning: Fetch a random dad joke and initiate addJokeToLocalStorage & sendEmail functions
async function fetchDadJokeAndSendEmail(email) {
    try {
        // Fetch a random dad joke from the icanhazdadjoke API
        var response = await fetch('https://icanhazdadjoke.com/', {
            headers: {
                'Accept': 'application/json'
            }
        });

        var data = await response.json();
        var joke = data.joke;

        // Add joke to local storage
        addJokeToLocalStorage(joke);

        // Send email with the dad joke content
        sendEmail(email, joke);

    } catch (error) {
        console.error('Error fetching dad joke:', error);
    }
}
// End: Fetch a random dad joke and initiate addJokeToLocalStorage & sendEmail functions

document.addEventListener('DOMContentLoaded', function () {
    fetchAndDisplayRandomJokes(10);
});

async function fetchAndDisplayRandomJokes(numJokes) {
    try {
        var jokesContainer = document.getElementById('jokesContainer');

        for (let i = 0; i < numJokes; i++) {
            // Fetch a random dad joke from the icanhazdadjoke API
            var response = await fetch('https://icanhazdadjoke.com/', {
                headers: {
                    'Accept': 'application/json'
                }
            });

            var data = await response.json();
            var joke = data.joke;

            // Add joke to local storage (optional)
            addJokeToLocalStorage(joke);

            // Create a new paragraph element to display the joke
            var jokeParagraph = document.createElement('p');
            jokeParagraph.textContent = joke;

            // Append the joke paragraph to the container
    
        }
    } catch (error) {
        console.error('Error fetching dad joke:', error);
    }
}

// Beginning: Add joke to local storage
function addJokeToLocalStorage(joke) {
    
    var jokes = JSON.parse(localStorage.getItem('dadJokes')) || [];

    // Add the current date along with the joke
    
    var currentDate = moment().format("MMM Do YYYY")
    var formattedDate = currentDate // Adjust the date format as needed

    var jokeObject = {
        date: formattedDate,
        content: joke,
    };

    jokes.push(jokeObject);

    if (jokes.length > 20) {
        jokes = jokes.slice(jokes.length - 20);
    }

    localStorage.setItem('dadJokes', JSON.stringify(jokes));
}
// End: Add joke to local storage


// Beginning: Send Email
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

const ratingStars = [...document.getElementsByClassName("rating__star")];