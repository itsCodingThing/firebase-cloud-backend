import { IQuestion } from "./question";

export interface IPaperSection {
    title: string;
    time: number;
    total_marks: number;
    question_list: IQuestion[];
}

export interface IPaper {
    board: string;
    class: string;
    subject: string;
    chapter: string[];
    topic: string[];
    paper_title: string;
    paper_marks: number;
    paper_duration: number;
    paper_description: string;
    paper_start_time: string;
    paper_end_time: string;
    school_id: string;
    class_id: string;
    student_id: string[];
    sections: IPaperSection[];
}
