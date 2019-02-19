export class Category {
    constructor(data) {
        this.id = data['id'];
        this.name = data['snippet']['title'];
    }
}
