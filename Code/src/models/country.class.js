export class Country {
    constructor(data) {
        this.code = data['id'];
        this.name = data['snippet']['name'];
    }
}
