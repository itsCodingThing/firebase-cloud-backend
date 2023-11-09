import { QuestionModel } from "../db/model/question";
import { IPreFormattedPaperRequestBody, IResponsePaperFormattedRoute } from "../interfaces/question";

export async function getSectionWiseQuestions(format = 80, body: IPreFormattedPaperRequestBody) {
    if (format === 25) {
        // 25 marks questions
        const result: IResponsePaperFormattedRoute = {
            section1: await QuestionModel.findQuestionsByFilters({
                board: body.board,
                class_name: body.class_name,
                subject: body.subject,
                chapter: body.chapter,
                question_marks: 1,
                number_of_questions: 4,
            }),
            section2: await QuestionModel.findQuestionsByFilters({
                board: body.board,
                class_name: body.class_name,
                subject: body.subject,
                chapter: body.chapter,
                question_marks: 2,
                number_of_questions: 3,
            }),
            section3: await QuestionModel.findQuestionsByFilters({
                board: body.board,
                class_name: body.class_name,
                subject: body.subject,
                chapter: body.chapter,
                question_marks: 3,
                number_of_questions: 2,
            }),
            section4: await QuestionModel.findQuestionsByFilters({
                board: body.board,
                class_name: body.class_name,
                subject: body.subject,
                chapter: body.chapter,
                question_marks: 5,
                number_of_questions: 1,
            }),
            section5: await QuestionModel.findQuestionsByFilters({
                board: body.board,
                class_name: body.class_name,
                subject: body.subject,
                chapter: body.chapter,
                question_marks: 4,
                number_of_questions: 1,
            }),
        };
        return result;
    }

    if (body.total_marks === 50) {
        // 50 marks questions
        const result: IResponsePaperFormattedRoute = {
            section1: await QuestionModel.findQuestionsByFilters({
                board: body.board,
                class_name: body.class_name,
                subject: body.subject,
                chapter: body.chapter,
                question_marks: 1,
                number_of_questions: 12,
            }),
            section2: await QuestionModel.findQuestionsByFilters({
                board: body.board,
                class_name: body.class_name,
                subject: body.subject,
                chapter: body.chapter,
                question_marks: 2,
                number_of_questions: 6,
            }),
            section3: await QuestionModel.findQuestionsByFilters({
                board: body.board,
                class_name: body.class_name,
                subject: body.subject,
                chapter: body.chapter,
                question_marks: 3,
                number_of_questions: 4,
            }),
            section4: await QuestionModel.findQuestionsByFilters({
                board: body.board,
                class_name: body.class_name,
                subject: body.subject,
                chapter: body.chapter,
                question_marks: 5,
                number_of_questions: 2,
            }),
            section5: await QuestionModel.findQuestionsByFilters({
                board: body.board,
                class_name: body.class_name,
                subject: body.subject,
                chapter: body.chapter,
                question_marks: 4,
                number_of_questions: 1,
            }),
        };
        return result;
    }

    // 80 marks questions
    const result: IResponsePaperFormattedRoute = {
        section1: await QuestionModel.findQuestionsByFilters({
            board: body.board,
            class_name: body.class_name,
            subject: body.subject,
            chapter: body.chapter,
            question_marks: 1,
            number_of_questions: 16,
        }),
        section2: await QuestionModel.findQuestionsByFilters({
            board: body.board,
            class_name: body.class_name,
            subject: body.subject,
            chapter: body.chapter,
            question_marks: 2,
            number_of_questions: 6,
        }),
        section3: await QuestionModel.findQuestionsByFilters({
            board: body.board,
            class_name: body.class_name,
            subject: body.subject,
            chapter: body.chapter,
            question_marks: 3,
            number_of_questions: 7,
        }),
        section4: await QuestionModel.findQuestionsByFilters({
            board: body.board,
            class_name: body.class_name,
            subject: body.subject,
            chapter: body.chapter,
            question_marks: 5,
            number_of_questions: 3,
        }),
        section5: await QuestionModel.findQuestionsByFilters({
            board: body.board,
            class_name: body.class_name,
            subject: body.subject,
            chapter: body.chapter,
            question_marks: 4,
            number_of_questions: 4,
        }),
    };
    return result;
}
