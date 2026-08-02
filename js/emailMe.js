function buildMailtoLink(email, subject, message) {
    return 'mailto:garrettdipalma2@gmail.com?subject=' + encodeURIComponent(subject) +
           '&body=' + encodeURIComponent(message + "\n\nFrom: " + email);
}

function buildEmailJsParams(email, subject, message) {
    return {
        from_email: email,
        subject: subject,
        message: message
    };
}

function setFormStatus(statusEl, message, isError) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = isError ? 'error' : 'success';
}

function isEmailJsConfigured() {
    return typeof emailjs !== 'undefined' &&
        typeof EMAILJS_PUBLIC_KEY !== 'undefined' &&
        typeof EMAILJS_SERVICE_ID !== 'undefined' &&
        typeof EMAILJS_TEMPLATE_ID !== 'undefined' &&
        EMAILJS_PUBLIC_KEY.indexOf('REPLACE_ME') !== 0 &&
        EMAILJS_SERVICE_ID.indexOf('REPLACE_ME') !== 0 &&
        EMAILJS_TEMPLATE_ID.indexOf('REPLACE_ME') !== 0;
}

// Attach event listener only when running in the browser
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
        if (isEmailJsConfigured()) {
            emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
        }
    });

    document.getElementById("contactForm").addEventListener("submit", function(event){
        event.preventDefault();

        var email = document.getElementById("email").value;
        var subject = document.getElementById("subject").value;
        var message = document.getElementById("message").value;
        var statusEl = document.getElementById("formStatus");
        var form = event.target;

        // No EmailJS account configured yet (see js/emailjsConfig.js) — fall
        // back to the plain mailto handoff so contact never fully breaks.
        if (!isEmailJsConfigured()) {
            window.location.href = buildMailtoLink(email, subject, message);
            return;
        }

        setFormStatus(statusEl, 'Sending...', false);

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, buildEmailJsParams(email, subject, message))
            .then(function () {
                setFormStatus(statusEl, "Message sent — thanks for reaching out!", false);
                form.reset();
            })
            .catch(function () {
                setFormStatus(statusEl, "Something went wrong sending your message — opening your email client instead.", true);
                window.location.href = buildMailtoLink(email, subject, message);
            });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { buildMailtoLink: buildMailtoLink, buildEmailJsParams: buildEmailJsParams };
}
