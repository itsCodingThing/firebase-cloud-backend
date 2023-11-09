import { Schema, model, Document, Model, Types } from "mongoose";
import { IQuestion } from "../../interfaces/question";

interface QuestionModel extends Model<IQuestion> {
    addQuestionsList(questionsList: IQuestion[]): Promise<string[]>;

    findQuestionsByFilters(params: {
        board: string;
        class_name: string;
        subject: string;
        chapter: string[];
        question_marks: number;
        number_of_questions: number;
    }): Promise<QuestionDocument[]>;

    findFreshQuestionsByFilters(params: {
        question_ids: string[];
        board: string;
        class_name: string;
        subject: string;
        chapter: string[];
        question_marks: number;
        number_of_questions: number;
    }): Promise<QuestionDocument[]>;
}

const questionSchema = new Schema<IQuestion, QuestionModel>({
    board: { type: String, required: true, index: true },
    class_name: { type: String, required: true, index: true },
    subject: { type: String, required: true, index: true },
    topic: [{ type: String, required: true }],
    chapter: { type: String, required: true, index: true },
    difficulty_level: { type: String, required: true, index: true },
    question_text: { type: String, required: true },
    question_options: [{ text: { type: String }, value: { type: String } }],
    question_cat: { type: String, required: String },
    question_time: { type: Number },
    question_marks: { type: Number, index: true, required: true },
    pdf_solution: { type: String },
    video_solution: { type: String },
    created_date: { type: Date, default: Date.now },
    hasOption: { type: Boolean, required: true },
});

questionSchema.statics.addQuestionsList = async function (questionsList: IQuestion[]) {
    const result = await QuestionModel.insertMany(questionsList, { lean: true });
    return result.map((question) => question.id);
};

questionSchema.statics.findQuestionsByFilters = async function (body: {
    board: string;
    class_name: string;
    subject: string;
    chapter: string[];
    question_marks: number;
    number_of_questions: number;
}) {
    const questions_list = await this.aggregate()
        .match({
            board: body.board,
            class_name: body.class_name,
            subject: body.subject,
            chapter: { $in: body.chapter },
            question_marks: body.question_marks,
        })
        .sample(body.number_of_questions);

    return questions_list;
};

questionSchema.statics.findFreshQuestionsByFilters = async function (body: {
    question_ids: string[];
    board: string;
    class_name: string;
    subject: string;
    chapter: string[];
    question_marks: number;
    number_of_questions: number;
}) {
    const questions_list = await this.aggregate()
        .match({
            _id: { $nin: body.question_ids.map((id: string) => Types.ObjectId(id)) },
            board: body.board,
            class_name: body.class_name,
            subject: body.subject,
            chapter: { $in: body.chapter },
            question_marks: body.question_marks,
        })
        .sample(body.number_of_questions);
    return questions_list;
};

questionSchema.index({
    board: 1,
    class_name: 1,
    subject: 1,
    topic: 1,
    chapter: 1,
    difficulty_level: 1,
    question_marks: 1,
});

export interface QuestionDocument extends IQuestion, Document {}
export const QuestionModel = model<IQuestion, QuestionModel>("Question", questionSchema);
