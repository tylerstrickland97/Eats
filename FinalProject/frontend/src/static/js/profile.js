import api from './APIClient.js';

let fname = document.getElementById('user-fname');
let lname = document.getElementById('user-lname');
let username = document.getElementById('user-username');
let email = document.getElementById('user-email');
let fullname = document.getElementById('user-fullname');
let userid = document.getElementById('user-id');

window.onload = () => {

    const logoutButton = document.getElementById('logout');
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        api.logOut().then(res => {
            document.location = '/';
        })
            .catch(e => {
                console.log("Error occured during logout process");
            });
    })

    api.getCurrentUser().then(user => {

        // fname.innerHTML = user.first_name;
        fname.value = user.first_name;
        lname.value = user.last_name;
        username.value = user.username;
        email.value = user.email;
        fullname.innerHTML = `${user.first_name} ${user.last_name}`;
        userid.innerHTML = user.username;
        loadFavorites(user.id);
        loadAllergies(user.id);
    }).catch(err => {
        console.log("We are not logged in");
        //document.location = '/';
    })
}

function filterRestaurantName(restaurant_name) {
    let filtered_name = restaurant_name.replaceAll(/[^A-Za-z\s]/g, '');
    filtered_name = filtered_name.replaceAll(' ', '-');
    return filtered_name;
}

function loadAllergies(userId) {
    const userAllergens = document.querySelector('.user-allergens');
    userAllergens.innerHTML = '<h2>My Allergies<h2>';
    api.getAllergiesByUser(userId).then(allergies => {
        if (allergies.length == 0) {
            let noAllergiesMsg = document.createElement('h3');
            noAllergiesMsg.innerHTML = "You have no reported allergies";
            userAllergens.appendChild(noAllergiesMsg);
        }
        else {
            allergies.forEach(allergy => {
                api.getAllergyById(allergy.allergy_id).then(result => {
                    fillAllergyHTML(result, userId);
                });
            })
        }
    }).catch(err => {
        console.log(err);
    });
    fillAllergiesSelection(userId);
}

function fillAllergiesSelection(userId) {
    const userAllergens = document.querySelector('.user-allergens');
    const allergensSelectionContainer = document.createElement('div');
    allergensSelectionContainer.classList.add('allergen-container');
    let allergiesSelection = document.createElement('select');

    let allergiesSelectionPlaceholder = document.createElement('option');
    allergiesSelectionPlaceholder.disabled = 'disabled';
    allergiesSelectionPlaceholder.selected = 'selected';
    allergiesSelectionPlaceholder.innerHTML = "Add a new allergy";
    allergiesSelection.appendChild(allergiesSelectionPlaceholder);
    api.getAllergies().then(allergies => {
        allergies.forEach(allergy => {
            addAllergyToSelection(allergy, allergiesSelection, userId);
        })
    }).catch(err => {
        console.log(err);
    });

    let addButton = document.createElement('button');
    addButton.className = 'btn btn-outline-secondary'
    addButton.innerHTML = "Add Allergen";
    addButton.addEventListener('click', function () {
        let allergyId = allergiesSelection.selectedIndex;
        api.addUserAllergy(userId, allergyId).then(result => {
            console.log('Successfully added allergy');
            loadAllergies(userId);
        }).catch(err => {
            console.log(err);
        });
    });
    allergensSelectionContainer.appendChild(allergiesSelection);
    allergensSelectionContainer.appendChild(addButton);
    userAllergens.appendChild(allergensSelectionContainer);
}

function fillAllergyHTML(allergy, userId) {
    let mainContainer = document.querySelector('.user-allergens');
    let allergenContainer = document.createElement('div');
    allergenContainer.classList.add('allergen-container');
    let nameDiv = document.createElement('div');
    nameDiv.innerHTML = allergy.type;

    let buttonContainer = document.createElement('div');
    buttonContainer.classList.add('allergen-button-container');
    let removeButton = document.createElement('button');
    removeButton.innerHTML = 'Remove';
    removeButton.className = "btn btn-outline-secondary remove-btn";
    removeButton.addEventListener('click', function () {
        api.removeUserAllergy(userId, allergy.type).then(results => {
            if (results) {
                loadAllergies(userId);
            }
            else {
                console.log('Failed to remove');
            }
        }).catch(err => {
            console.log(err);
        })
    });
    buttonContainer.appendChild(removeButton);

    allergenContainer.appendChild(nameDiv);
    allergenContainer.appendChild(buttonContainer);
    mainContainer.appendChild(allergenContainer);
}

function addAllergyToSelection(allergy, selection, userId) {
    let newOption = document.createElement('option');
    newOption.value = allergy.type;
    newOption.innerHTML = allergy.type;
    selection.appendChild(newOption);
}

function loadFavorites(userId) {
    const userFavorites = document.querySelector('.user-favorites');
    api.getUserFavorites(userId).then(favorites => {
        if (favorites.length == 0) {
            let noFavoritesText = document.createElement('h3');
            noFavoritesText.innerHTML = "You currently have no favorites";
            let noFavoritesButton = document.createElement('button');
            noFavoritesButton.innerText = "Find Some Good Eats";
            noFavoritesButton.className = "btn btn-outline-secondary no-fav-btn";

            noFavoritesButton.addEventListener('click', e => {
                document.location.href = '/home';
            });
            userFavorites.appendChild(noFavoritesText);
            userFavorites.appendChild(noFavoritesButton);
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

let editBtn = document.getElementById('edit-btn');
let saveBtn = document.getElementById('save-btn');
editBtn.addEventListener('click', e => {

    if (saveBtn.display = 'none') {
        saveBtn.style.display = 'block';
    }
    saveBtn.required = true;

    fname.disabled = false;
    lname.disabled = false;
    username.disabled = false;
    email.disabled = false;
    fullname.disabled = false;
});

saveBtn.addEventListener('click', e => {
    saveBtn.style.display = "none";
    saveBtn.required = false;

    fname.disabled = true;
    lname.disabled = true;
    username.disabled = true;
    email.disabled = true;
    fullname.disabled = true;
    // let userId;
    // api.getCurrentUser().then(user => {
    //     userId = user.id;
    //     console.log(userId);
    //     console.log(user.id);
    // });
    // console.log(userId);
    // console.log(fname.value);
    // console.log(lname.value);
    // console.log(username.value);
    // console.log(email.value);
    // // consolale.log(fname.value+ lname.value + username.valu+  email.value);
    // api.editProfile(userId, fname.value, lname.value, username.value, email.value).then(results => {
    //     if (results) {
    //         // loadAllergies(userId);
    //         console.log(results);
    //     }
    //     else {
    //         console.log('Failed to remove');
    //     }
    // });


});



