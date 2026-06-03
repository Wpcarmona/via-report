

export class User {
    uid: string;
    email: string;
    fullName: string;
    createdAt: Date;

    constructor(uid: string, email: string, fullName: string, createdAt: Date) {
        this.uid = uid;
        this.email = email;
        this.fullName = fullName;
        this.createdAt = createdAt;
    }
}