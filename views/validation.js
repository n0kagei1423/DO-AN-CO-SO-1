const form = document.getElementById('form');
const email_input = document.getElementById('email');
const password_input = document.getElementById('password');
const re_password = document.getElementById('re-password');
const username_input = document.getElementById('username');
const error_message = document.getElementById('error-message');

form.addEventListener("click", (e) => {
    alert('cc');
    let errors = []

    if (username_input) {
        errors = getSignupFormErrors(email_input.value, username_input.value, password_input.value, re_password.value);
    }
    else {
        // errors = getLoginFormErrors(email_input.value, password_input.value);
    }

    if (errors.length > 0) {
        e.preventDefault();
        error_message.innerText = errors.join('. ');
    }
})

function getSignupFormErrors(email, username, password, re_password) {
    let errors = [];

    if (email === '' || email == null) {
        errors.push('Email is required');
        email_input.parentElement.classList.add('incorrect');
    }
    if (username === '' || username == null) {
        errors.push('Username is required');
        username_input.parentElement.classList.add('incorrect');
    }
    if (password === '' || password == null) {
        errors.push('Password is required');
        password_input.parentElement.classList.add('incorrect');
    }
    if (re_password === '' || re_password == null) {
        errors.push('Please confirm your password');
        re_password.parentElement.classList.add('incorrect');
    }

    return errors;

}