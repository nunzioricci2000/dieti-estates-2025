export {
    type User,
    type Agent, 
    type Admin
}

abstract class User {
    email: string;

    constructor(email: string) {
        this.email = email;
    }
}

class Agent extends User {}

class Admin extends User {}
