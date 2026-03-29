export class Booking {
    constructor(house) {
        this.house = house;
        this.checkin = null;
        this.days = 1;
        this.extra = [];
        this.code = "";
        this.total = 0;
    }

    validate() {
        let errors = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkinDate = new Date(this.checkin);
        if (!this.checkin || today > checkinDate) {
            errors.push("Ogiltigt datum");
        }
        if (isNaN(this.days) || this.days < 1) {
            errors.push("Antal dagar mindre än 1");
        }
        return errors;
    }

    totalCalc() {
        let totalPrice = this.house.pricePerNight * this.days;
        for (let check of this.extra) {
            if (check == "breakfast") {
                totalPrice += 100 * this.days;
            }
            if (check == "wander") {
                totalPrice += 300;
            }
            if (check == "seance") {
                totalPrice += 500;
            }
        }
        if (this.code == "GHOST20") {
            totalPrice *= 0.8;
        }
        this.total = totalPrice;
        return totalPrice;
    }
}