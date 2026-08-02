// EmailJS setup — see README.md for the full walkthrough.
//
// 1. Create a free account at https://www.emailjs.com/
// 2. Add an email service (connects the account that actually sends mail).
// 3. Create an email template. In the template's "To Email" field, use a
//    masked forwarding alias (e.g. a Firefox Relay / duck.com / SimpleLogin
//    address that forwards to your real inbox) instead of your personal
//    address, so your real email never has to be entered here or exposed.
// 4. Copy your Public Key, Service ID, and Template ID below.
//
// These three values are safe to expose in client-side code — they identify
// which template to use, not credentials to your inbox.

var EMAILJS_PUBLIC_KEY = 'REPLACE_ME_PUBLIC_KEY';
var EMAILJS_SERVICE_ID = 'REPLACE_ME_SERVICE_ID';
var EMAILJS_TEMPLATE_ID = 'REPLACE_ME_TEMPLATE_ID';

if (typeof module !== 'undefined') {
    module.exports = {
        EMAILJS_PUBLIC_KEY: EMAILJS_PUBLIC_KEY,
        EMAILJS_SERVICE_ID: EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID: EMAILJS_TEMPLATE_ID
    };
}
