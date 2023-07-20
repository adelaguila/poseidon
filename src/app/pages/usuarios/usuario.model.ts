import { environment } from "src/environments/environment";

const apiUrl = environment.api_url;
const frontUrl = environment.front_url;

export class Usuario {
    constructor(
        public email: string,
        public name: string,
        public isActive: boolean,
        public roles: string,
        public password?: string,
        public google?: boolean,
        public image?: string,
        public id?: string
    ) {}

    get imagenUrl() {
        if (this.image) {
            return `${apiUrl}/files/user/${this.image}`;
        } else {
            return `${apiUrl}/files/user/default.jpg`;
        }
    }
}
