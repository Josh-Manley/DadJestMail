emailjs.init('e4IMeDjiTLqb2QzFb'); //Your EmailJS user ID

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

        // Convert time to milliseconds
        var scheduledTime = new Date(time).getTime();
        var currentTime = new Date().getTime();

        console.log("Scheduled Time " + scheduledTime);
        console.log("Current Time " + currentTime);

        // Check if the scheduled time is in the future
        if (scheduledTime < currentTime) {
            alert('Please select a future time for sending the email.');
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

            // Send email with the dad joke content
            sendEmail(email, joke);
        } catch (error) {
            console.error('Error fetching dad joke:', error);
        }
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