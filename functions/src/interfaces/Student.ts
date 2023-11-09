import { IUserClass } from "./Common";

export interface IStudent {
    id: string;
    name: string;
    login_id: string;
    password: string;
    address: string;
    mobile: string;
    phone: string;
    email: string;
    image_url: string;
    gender: string;
    class_id: string;
    school_id: string;
    reg_number: string;
    mother_name: string;
    father_name: string;
    fahter_mobile: string;
    approved: boolean;
    created_date: string;
    class: IUserClass;
}
