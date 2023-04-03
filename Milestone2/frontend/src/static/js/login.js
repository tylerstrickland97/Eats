import api from './APIClient.js';

window.onload = () => {
    let signUp = document.getElementById('popup');
    const signupButton = document.getElementById('signup-button');
    //const signupForm = document.getElementById('signup-form');

    //signup fields
    const submitSignup = document.getElementById('signup-submit');
    const signUpUser = document.getElementById('username');
    // const signUpPassword = document.getElementById('password');
    const firstname = document.getElementById('fname');
    const lastname = document.getElementById('lname');
    const email = document.getElementById('email');

    const createAccountButton = document.getElementById('createaccountbtn');
    const popupCloseButton = document.getElementById('popup-close-button');
    const passwordInput = document.getElementById('password');
    let passwordConfInput = document.getElementById('password-conf');
    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        signUp.style.display = 'block';
    });

    createAccountButton.addEventListener('click', (e) => {
        let newFirstName = document.getElementById('fname').value;
        let newLastName = document.getElementById('lname').value;
        let newEmail = document.getElementById('email').value;
        let newUsername = document.getElementById('username').value;
        let newPassword = document.getElementById('password').value;
        let successMsg = document.querySelector('.signup-success');
        console.log(successMsg);


        api.signUp(newFirstName, newLastName, newUsername, newPassword, newEmail).then(res => {
            console.log(res);
            successMsg.style.display = 'block';

            });
        });

    popupCloseButton.addEventListener('click', (e) => {
        e.preventDefault();
        signUp.style.display = 'none';
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

    let loginButton = document.querySelector('.button-login');
    loginButton.addEventListener('click', (e) => {
        let loginUsername = document.getElementById('login-username').value;
        let loginPassword = document.getElementById('login-password').value;
        api.logIn(loginUsername, loginPassword).then(user => {
            document.location = "/home";
        }).catch(err => {

        })
    })
}