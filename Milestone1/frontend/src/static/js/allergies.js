import api from './APIClient.js';
window.onload = () => {

    api.getAllergiesByUser().then(allergies => {
        allergies.forEach(allergy => {
            fillAllergyHTML(allergy);
        })
    });

    function fillAllergyHTML(allergy) {
        const allergyList = document.getElementById('.allergies');
        allergyList.appendChild(createAllergyHTML(allergy));
    }

    function createAllergyHTML(allergy) {
        let newAllergy = document.createElement('div');

        //idk if this is gonna work
        let allergyName = document.createElement('p');
        allergyName.innerHTML = allergy.name;

        let deleteButton = document.createElement('button');
        //on click of this button, delete/add allergy
        deleteButton.id = "delete";
        deleteButton.value = 'delete';
        //add method to add and delete allergies 

        let horizontalLine = document.createElement('hr');

        newAllergy.appendChild(allergyName);
        newAllergy.appendChild(deleteButton);
        newAllergy.appendChild(horizontalLine);

        return newAllergy;

    }
}
