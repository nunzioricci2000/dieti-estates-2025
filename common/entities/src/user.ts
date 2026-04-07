export {
    User,
    Agent, 
    Admin
}

class User {
    email: string;
    username: string;

    constructor(email: string, username: string) {
        this.email = email;
        this.username = username;
    }
}

class Agent extends User {}

class Admin extends User {}
