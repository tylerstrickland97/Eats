module.exports = class {
    constructor(data) {
        console.log(data);
        this.id = data.allergy_id;
        this.type = data.allergy_type;
    }

    toJSON() {
        return {
            id: this.id,
            type: this.type
        }
    }
}