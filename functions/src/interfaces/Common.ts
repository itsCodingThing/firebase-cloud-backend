export interface IUserClass {
    status: boolean;
    id: string;
    class_id: string;
    class_name: string;
    section: string;
    board: string;
    subject_list: string[];
    action_status: string;
    created_date: string;
}

export interface ISchoolBase {
    id: string;
    action_status: boolean;
    address: string;
    app: Record<string, unknown>;
    attendence: boolean;
    board_list: string[];
    catagory: string;
    class_list: string[];
    created_date: string;
    email: string;
    examania: Record<string, unknown>;
    lecture: Record<string, unknown>;
    logo: string;
    mobile: string;
    name: string;
    paper_cat_list: string[];
    password: string;
    quizo: Record<string, unknown>;
    reg_number: string;
    reject: Record<string, unknown>;
    section_list: string[];
    show_on_cip: boolean;
    status: boolean;
    subject_list: string[];
    user_type: string;
    white_labled: boolean;
}
