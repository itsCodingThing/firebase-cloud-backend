export interface IQuestion {
    created_date: string | number | Date;
    board: string;
    class_name: string;
    subject: string;
    topic: string[];
    chapter: string;
    difficulty_level: string;
    question_text: string;
    question_options?: [{ text: string; value: boolean }];
    question_cat: string;
    question_time?: number;
    question_marks: number;
    pdf_solution?: string;
    video_solution?: string;
    hasOption: boolean;
}

export interface IAddQuestionsListRequestBody {
    created_date: string | number | Date;
    list: IQuestion[];
    number_of_questions: number;
}

export interface IGetFilterQuestionsRequestBody {
    board: string;
    class_name: string;
    subject: string;
    difficulty_level: string;
    question_marks: number;
    number_of_questions: number;
}

export interface IGetFilterQuestionIdRequestBody {
    board: string;
    class_name: string;
    subject: string;
    difficulty_level: string;
    question_marks: number;
    question_id_list: string[];
}

export interface IGetFilterTopicListRequestBody {
    board: string;
    class_name: string;
    subject: string;
}

export interface IEditQuestionRequestBody {
    question_id: string;
    question_text: string;
}

export interface IPreFormattedPaperRequestBody {
    board: string;
    class_name: string;
    subject: string;
    chapter: string[];
    total_marks: number;
}

export interface IResponsePaperFormattedRoute {
    [key: string]: IQuestion[];
}
