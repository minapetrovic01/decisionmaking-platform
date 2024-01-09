import { Decision } from "./decision";

export class User {
    username: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    job: string;
    decisions: Decision[];
}