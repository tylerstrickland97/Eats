import api from './APIClient.js';

window.onload = () => {

    let signUp = document.getElementById('popup');
    const signupButton = document.getElementById('signup-button');
    const popupCloseButton = document.getElementById('popup-close-button');
    const passwordInput = document.getElementById('password');
    let passwordConfInput = document.getElementById('password-conf');
    let createAccountButton = document.getElementById('createaccountbtn');

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        signUp.style.display = 'block';
    });

    popupCloseButton.addEventListener('click', (e) => {
        e.preventDefault();
        signUp.style.display = 'none';
    });

    createAccountButton.addEventListener('click', (e) => {
        let newFirstName = document.getElementById('fname').value;
        let newLastName = document.getElementById('lname').value;
        let newEmail = document.getElementById('email').value;
        let newUsername = document.getElementById('username').value;
        let newPassword = document.getElementById('password').value;

        api.signUp(newFirstName, newLastName, newUsername, newPassword, newEmail).then(res => {
            if (res) {
                console.log(res);
            }
            else {
                console.log('error');
            }
        })

    })


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