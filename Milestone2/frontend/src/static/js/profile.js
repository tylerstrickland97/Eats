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
        loadFavorites(user.id);
        loadAllergies(user.id);
    }).catch(err => {
        console.log("We are not logged in");
        document.location = '/';
    })
}

function filterRestaurantName(restaurant_name) {
    let filtered_name = restaurant_name.replaceAll(/[^A-Za-z\s]/g, '');
    filtered_name = filtered_name.replaceAll(' ', '-');
    return filtered_name;
}

function loadAllergies(userId) {
    const userAllergens = document.querySelector('.user-allergens');
    let allergiesSelection = document.createElement('select');

    let allergiesSelectionPlaceholder = document.createElement('option');
    allergiesSelectionPlaceholder.disabled = 'disabled';
    allergiesSelectionPlaceholder.selected = 'selected';
    allergiesSelectionPlaceholder.innerHTML = "Add a new allergy";
    allergiesSelection.appendChild(allergiesSelectionPlaceholder);
    api.getAllergies().then(allergies => {
        allergies.forEach(allergy => {
            fillAllergiesSelection(allergy, allergiesSelection);
        })
    }).catch(err => {
        console.log(err);
    });

    userAllergens.appendChild(allergiesSelection);
}

function fillAllergiesSelection(allergy, selection) {
    let newOption = document.createElement('option');
    newOption.value = allergy.type;
    newOption.innerHTML = allergy.type;
    console.log(newOption);
    selection.appendChild(newOption);
}

function loadFavorites(userId) {
    const userFavorites = document.querySelector('.user-favorites');
    api.getUserFavorites(userId).then(favorites => {
        if (favorites.length == 0) {
            let noFavoritesText = document.createElement('p');
            noFavoritesText.innerHTML = "You currently have no favorites";
            userFavorites.appendChild(noFavoritesText);
        }
        else {
            favorites.forEach(fav => {
                api.getRestaurantById(fav.restaurant_id).then(restaurant => {
                    fillFavoriteHTML(restaurant);
                })
            })
        }

    })

}

function fillFavoriteHTML(restaurant) {
    const userFavorites = document.querySelector('.user-favorites');

    let favoriteContainer = document.createElement('div');
    favoriteContainer.classList.add('account-information');
    favoriteContainer.classList.add('favorite-container');

    let favoriteLogoImg = document.createElement('img');
    favoriteLogoImg.src = `imgs/restaurant-logos/${filterRestaurantName(restaurant.name)}-logo.png`;

    let nameDiv = document.createElement('div');
    nameDiv.classList.add('favorite-name');

    let nameLink = document.createElement('a');
    nameLink.innerHTML = restaurant.name;
    nameLink.href = '/restaurant?id=' + restaurant.id;

    nameDiv.appendChild(nameLink);

    favoriteContainer.appendChild(favoriteLogoImg);
    favoriteContainer.appendChild(nameDiv);

    userFavorites.appendChild(favoriteContainer);
}

