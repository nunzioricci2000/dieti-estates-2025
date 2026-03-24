export {
    User,
    Agent, 
    Admin
}

abstract class User {
    email: string;

    constructor(email: string) {
        this.email = email;
    }
}

class Agent extends User {}

class Admin extends User {}
