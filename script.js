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


// Beginning: Add joke to local storage
function addJokeToLocalStorage(joke) {
    var jokes = JSON.parse(localStorage.getItem('dadJokes')) || [];

    jokes.push(joke);

    if (jokes.length > 5) {
        jokes = jokes.slice(jokes.length - 5);
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
var modal = document.querySelector('.modal');
var overlay = document.querySelector('.overlay');
var btnCloseModal = document.querySelector('.close-modal');
var btnOpenModal = document.querySelector('.show-modal');

// When "Show Example" button is clicked, remove class "hidden" from relevant elements and initiate fetchDadJoke function
var openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    fetchDadJoke();
};

// Fetch random dad joke, add it to local storage, and display it in the modal
async function fetchDadJoke() {
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

        // Display joke in modal
        var example = document.querySelector('.exampleDadJoke');
        example.textContent = joke;

    } catch (error) {
        console.error('Error fetching dad joke:', error);
    }
};

// When "X" button is clicked or user clicks outside of modal, add class "hidden" to relevant elements
var closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

// Click listeners specific to modal functionality
btnOpenModal.addEventListener('click', openModal);
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// End: Modal functionality