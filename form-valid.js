document.getElementById("contactForm").addEventListener("submit", function(event) {
    // Basic validation for the contact form
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;

    if (!name || !email || !message) {
        alert("Please fill out all fields.");
        event.preventDefault(); // Prevent form submission
    }
});

