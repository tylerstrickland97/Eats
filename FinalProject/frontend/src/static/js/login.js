import api from './APIClient.js';

window.onload = () => {
    let signUp = document.getElementById('popup');
    const signupButton = document.getElementById('signup-button');
    //const signupForm = document.getElementById('signup-form');

    //signup fields
    const submitSignup = document.getElementById('signup-submit');
    const signUpUser = document.getElementById('username');
    //const signUpPassword = document.getElementById('password');
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
        let signupMessage = document.querySelector('.signup-message');
        try {
            if (newFirstName == '') {
                throw new Error('Must have first name');
            }
            if (newLastName == '') {
                throw new Error('Must have last name');
            }
            if (newEmail == '') {
                throw new Error('Must have email');
            }
            if (newUsername == '') {
                throw new Error('Must have username')
            }
            if (newPassword == '') {
                throw new Error('Must have password');
            }
        } catch (e) {
            signupMessage.innerHTML = 'Error creating account';
            signupMessage.classList.add('signup-error-message');
            return;
        };
        
        api.getUserByUsername(newUsername).then(response => {
            console.log(response.status);
            if (response.status == "FOUND") {
                throw new Error("User already exists");
            }
        })
        .then(() => {
            api.signUp(newFirstName, newLastName, newUsername, newPassword, newEmail).then(res => {
                if (res) {
                    signupMessage.innerHTML = 'Successfully created account';
                    signupMessage.classList.add('signup-success-message');
                    signUp.style.display = 'none';
                }
                else {
                    signupMessage.innerHTML = 'Error creating account';
                    signupMessage.classList.add('signup-error-message');
                }
            });
        })
        .catch(err => {
            signupMessage.innerHTML = 'Error creating account';
            signupMessage.classList.add('signup-error-message');
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

    username.addEventListener("change", (e) => {
        api.getUserByUsername(username.value).then(response => {
            if (response.status == "FOUND") {
                signUpUser.setCustomValidity("Username already exists");
            } else {
                signUpUser.setCustomValidity("");
            }
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        });
    })

    let loginButton = document.querySelector('.button-login');
    let loginMessage = document.querySelector('.login-msg');
    loginButton.addEventListener('click', (e) => {
        let loginUsername = document.getElementById('login-username').value;
        let loginPassword = document.getElementById('login-password').value;
        api.logIn(loginUsername, loginPassword).then(user => {
            document.location = "/home";
        }).catch(err => {
            loginMessage.classList.add('login-error-message');
            loginMessage.innerHTML = 'Error logging in';
        })
    })
}