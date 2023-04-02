module.exports = class {
    constructor(data) {
        this.id = data.restaurant_id;
        this.name = data.restaurant_name;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name
        }
    }
}