function buildMailtoLink(email, subject, message) {
    return 'mailto:garrettdipalma2@gmail.com?subject=' + encodeURIComponent(subject) +
           '&body=' + encodeURIComponent(message + "\n\nFrom: " + email);
}

// Attach event listener only when running in the browser
if (typeof document !== 'undefined') {
    document.getElementById("contactForm").addEventListener("submit", function(event){
        event.preventDefault();

        var email = document.getElementById("email").value;
        var subject = document.getElementById("subject").value;
        var message = document.getElementById("message").value;

        var mailtoLink = buildMailtoLink(email, subject, message);

        window.location.href = mailtoLink; // Open the mailto link
    });
}

module.exports = { buildMailtoLink };
