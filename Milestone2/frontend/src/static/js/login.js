import api from './APIClient.js';

window.onload = () => {
    //login
    const errorBox = document.querySelector('#errorbox');

    const loginForm = document.getElementById('login');
    const loginBtn = document.getElementById('login-btn');
    const loginUser = document.getElementById('login-user');
    const loginPass = document.getElementById('login-pass');

    let signUp = document.getElementById('popup');
    const signupButton = document.getElementById('signup-button');
    const signupForm = document.getElementById('signup-form');

    //signup fields
    const submitSignup = document.getElementById('signup-submit');
    const signUpUser = document.getElementById('username');
    // const signUpPassword = document.getElementById('password');
    const firstname = document.getElementById('fname');
    const lastname = document.getElementById('lname');
    const email = document.getElementById('email');

    const popupCloseButton = document.getElementById('popup-close-button');
    const passwordInput = document.getElementById('password');
    let passwordConfInput = document.getElementById('password-conf');

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        signUp.style.display = 'block';
    });

    popupCloseButton.addEventListener('click', (e) => {
        e.preventDefault();
        signUp.style.display = 'none';
    });

    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        console.log(loginUser.value);
        console.log(loginPass.value);
        api.logIn(loginUser.value, loginPass.value).then(userData => {
            document.location = "/";
        }).catch((err)) //=> {
    });

    // loginBtn.addEventListener('click', e => {
    //     // e.preventDefault();
    //     api.logIn(loginUser.value, loginPass.value).then(userData => {
    //         document.location = "/home";
    //     }).catch((err)) //=> {

    //     //     errorBox.classList.remove("hidden");
    //     //     errorBox.innerHTML = err;
    //     // });
    // });

    signupForm.addEventListener('submit', e => {
        e.preventDefault();
        console.log(firstname.value);
        console.log(lastname.value);
        console.log(signUpUser.value);
        console.log(passwordInput.value);
        console.log(email.value); 
        // signUp: (firstname, lastname, username, password, email) => {
        api.signUp(firstname.value, lastname.value, signUpUser.value, passwordInput.value, email.value).then(userData => {
            document.location = "/";
        }).catch((err) => {

            errorBox.classList.remove("hidden");
            errorBox.innerHTML = err;
        });
    });


    function checkPasswords() {
        if (passwordInput.value != passwordConfInput.value) {
            passwordConfInput.setCustomValidity("Password does not match");
        } else {
            passwordConfInput.setCustomValidity("");
        }
    }

    passwordInput.addEventListener("change", (e) => {
        checkPasswords();
    });

    passwordConfInput.addEventListener("change", (e) => {
        checkPasswords();
    });
}