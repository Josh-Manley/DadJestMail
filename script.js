emailjs.init('e4IMeDjiTLqb2QzFb'); //Your EmailJS user ID
//test

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelector('.show-modal');


const openModal = function() {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
}; 

const closeModal = function() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.addEventListener('click', openModal);
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);


// Adding key press on esc to close modals
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();  
    }
});


var form = document.getElementById('emailForm');

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

    // Convert user input to milliseconds
    var scheduledTime = new Date(time).getTime();

    // Get current time and round it down to the nearest minute (aka omit the seconds for easier comparison)
    var now = new Date();
    var currentTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()).getTime();

    console.log("Scheduled Time " + new Date(scheduledTime).toString());
    console.log("Current Time " + new Date(currentTime).toString());

    // Check if the scheduled time is in the past
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

function isValidEmail(email) {
    // Very basic email validation, you might want to use a more robust validation method
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

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

        addJokeToLocalStorage(joke);

        // Send email with the dad joke content
        sendEmail(email, joke);
    } catch (error) {
        console.error('Error fetching dad joke:', error);
    }
}

function addJokeToLocalStorage(joke) {
    var jokes = JSON.parse(localStorage.getItem('dadJokes')) || [];

    jokes.push(joke);

    if (jokes.length > 5) {
        jokes = jokes.slice(jokes.length - 5);
    }

    localStorage.setItem('dadJokes', JSON.stringify(jokes));
}

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