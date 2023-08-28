module.exports = class {
    constructor(data) {
        this.id = data.item_id;
        this.restaurant = data.restaurant;
        this.name = data.name;
        this.calories = data.calories;
        this.fat_g = data.fat_g;
        this.carbohydrates_g = data.carbohydrates_g;
        this.protein_g = data.protein_g;
        this.sodium_mg = data.sodium_mg;
        this.cholesterol_mg = data.cholesterol_mg;
        this.fiber_g = data.fiber_g;
        this.restaurant_id = data.restaurant_id;
    }

    toJSON() {
        return {
            id: this.id,
            restaurant: this.restaurant,
            name: this.name,
            calories: this.calories,
            fat: this.fat_g,
            carbohydrates: this.carbohydrates_g,
            protein: this.protein_g,
            sodium: this.sodium_mg,
            cholesterol: this.cholesterol_mg,
            fiber: this.fiber_g,
            restaurant_id: this.restaurant_id
        }
    }
}