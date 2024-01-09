import { Alternative } from "./alternative";
import { Criteria } from "./criteria";
import { User } from "./user";

export class Decision {
    id: string;
    name: string;
    description: string;
    date: Date;
    alternatives: Alternative[];
    criterias: Criteria[];
    owner:User;
}