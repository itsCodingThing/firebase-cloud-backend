import { IUserClass } from "./Common";

export interface ITeacher {
    name: string;
    id: string;
    class_id_list: string[];
    school_id: string;
    class_list: IUserClass[];
    login_id: string;
    password: string;
    address: string;
    email: string;
    image_url: string;
    phone: string;
    status: boolean;
    gender: string;
    created_date: string;
}
