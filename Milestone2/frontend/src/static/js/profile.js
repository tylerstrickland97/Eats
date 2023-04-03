import api from './APIClient.js';

window.onload = () => {
    api.getCurrentUser().then(user => {
        let fname = document.getElementById('user-fname');
        let lname = document.getElementById('user-lname');
        let username = document.getElementById('user-username');
        let email = document.getElementById('user-email');
        let fullname = document.getElementById('user-fullname');
        let userid = document.getElementById('user-id');
        fname.innerHTML = user.first_name;
        lname.innerHTML = user.last_name;
        username.innerHTML = user.username;
        email.innerHTML = user.email;
        fullname.innerHTML = `${user.first_name} ${user.last_name}`;
        userid.innerHTML = user.username;
    })
}

