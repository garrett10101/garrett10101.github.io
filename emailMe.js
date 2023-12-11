document.getElementById("contactForm").addEventListener("submit", function(event){
    event.preventDefault();
    
    var email = document.getElementById("email").value;
    var subject = document.getElementById("subject").value;
    var message = document.getElementById("message").value;

    // Construct the mailto link
    var mailtoLink = 'mailto:garrettdipalma2@gmail.com?subject=' + encodeURIComponent(subject) +
                     '&body=' + encodeURIComponent(message + "\n\nFrom: " + email);

    window.location.href = mailtoLink; // Open the mailto link
});
