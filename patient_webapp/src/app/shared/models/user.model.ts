import { Visit } from './visit.model';

export class User {
    public firstName: string;
    public lastName: string;
    public email: string;
    public userId: string;
    public emergencyContactName: string;
    public localId: string;
    public phoneNum: number;
    public visits: Array<Visit>;
}