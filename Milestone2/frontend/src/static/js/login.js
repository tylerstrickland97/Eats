
window.onload = () => {
    let signUp = document.getElementById('popup');
    const signupButton = document.getElementById('signup-button');
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