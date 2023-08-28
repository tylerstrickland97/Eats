module.exports = class {
    constructor(data) {
        this.id = data.favorite_id;
        this.userId = data.user_id;
        this.restaurantId = data.restaurant_id;
    }

    toJson() {
        return {
            id: this.id,
            userId: this.userId,
            restaurantId: this.restaurantId
        }
    }
}