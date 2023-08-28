import api from './APIClient.js';

window.onload = () => {
    let signUp = document.getElementById('popup');
    const signupButton = document.getElementById('signup-button');
    //const signupForm = document.getElementById('signup-form');

    //signup fields
    let submitSignup = document.getElementById('signup-submit');
    let signUpUser = document.getElementById('username');
    let signUpPassword = document.getElementById('password');
    let passwordConfInput = document.getElementById('password-conf');
    let firstname = document.getElementById('fname');
    let lastname = document.getElementById('lname');
    let email = document.getElementById('email');

    const createAccountButton = document.getElementById('createaccountbtn');
    const popupCloseButton = document.getElementById('popup-close-button');
    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        checkPasswords();
        let err = document.getElementById('username-taken');
        if (username.value != '') {
            api.getUserByUsername(username.value).then(response => {
                if (response.status == "FOUND") {
                    err.style.display = 'block';
                    signUpUser.setCustomValidity("Username already exists");
                } else {
                    signUpUser.setCustomValidity("");
                    err.style.display = 'none';
                }
            })
            .catch((err) => {
                console.log(`Error: ${err}`);
            });
        }
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
            if (!checkPasswords()) {
                throw new Error('Password fields must match');
            }
        } catch (e) {
            signupMessage.innerHTML = `Error creating account: ${e.message}`;
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
                console.log(res);
                if (res) {
                    signupMessage.innerHTML = 'Successfully created account';
                    signupMessage.classList.add('signup-success-message');
                    signUp.style.display = 'none';
                    // Reset form fields
                    signUpUser.innerHTML = '';
                    signUpPassword.innerHTML = '';
                    passwordConfInput.innerHTML = '';
                    firstname.innerHTML = '';
                    lastname.innerHTML = '';
                    email.innerHTML = '';
                    // Login user on successful signup
                    api.logIn(newUsername, newPassword).then(user => {
                        document.location = "/home";
                    }).catch(err => {
                        loginMessage.classList.add('login-error-message');
                        loginMessage.innerHTML = 'Error logging in';
                    })
                }
                else {
                    signupMessage.innerHTML = 'Error creating account';
                    signupMessage.classList.add('signup-error-message');
                }
            });
        })
        .catch(e => {
            signupMessage.innerHTML = `Error creating account: ${e.message}`;
            signupMessage.classList.add('signup-error-message');
        });
    });

    popupCloseButton.addEventListener('click', (e) => {
        e.preventDefault();
        signUp.style.display = 'none';
    });

    function checkPasswords() {
        let err = document.getElementById('password-mismatch');
        if (signUpPassword.value != passwordConfInput.value) {
            err.style.display = "block";
            passwordConfInput.setCustomValidity("Password does not match");
            return false;
        } else {
            err.style.display = "none";
            passwordConfInput.setCustomValidity("");
            return true;
        }
    }



    signUpPassword.addEventListener("input", (e) => {
        checkPasswords();
    });

    passwordConfInput.addEventListener("input", (e) => {
        checkPasswords();
    });

    username.addEventListener("input", (e) => {
        let err = document.getElementById('username-taken');
        if (username.value == '') {
            err.style.display = 'none';
            return;
        }
        api.getUserByUsername(username.value).then(response => {
            if (response.status == "FOUND") {
                err.style.display = 'block';
                signUpUser.setCustomValidity("Username already exists");
            } else {
                signUpUser.setCustomValidity("");
                err.style.display = 'none';
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