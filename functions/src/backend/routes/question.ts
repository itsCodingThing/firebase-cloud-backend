import express from "express";
import { validationResult, checkSchema } from "express-validator";
import asyncHandler from "express-async-handler";

import { QuestionModel } from "../db/model/question";
import { IAddQuestionsListRequestBody, IPreFormattedPaperRequestBody } from "../interfaces/question";
import { CustomException } from "../utils/errorHandlers";
import { getSectionWiseQuestions } from "../utils/questionsControllerUtil";

const router = express.Router();

/**
 * @rotue   POST "/api/question/add"
 * @desc    add new questions
 */
router.post(
    "/add",
    checkSchema({
        list: { isArray: { options: { min: 1 } } },
        "list.*.board": { isString: true, not: true, isEmpty: true },
        "list.*.class_name": { isString: true, not: true, isEmpty: true },
        "list.*.subject": { isString: true, not: true, isEmpty: true },
        "list.*.topic": { isArray: { options: { min: 1 } } },
        "list.*.chapter": { isString: true, not: true, isEmpty: true },
        "list.*.difficulty_level": { isString: true, not: true, isEmpty: true },
        "list.*.question_text": { isString: true, not: true, isEmpty: true },
        "list.*.question_marks": { isInt: true },
        "list.*.question_cat": { isString: true, not: true, isEmpty: true },
        "list.*.question_options": { isArray: { options: { min: 4, max: 4 } } },
        "list.*.hasOption": { isBoolean: true },
        number_of_questions: { isInt: true },
        created_date: { isInt: true },
    }),
    asyncHandler(async function questionAdd(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new CustomException("ERR_CLIENT_REQUEST_BODY", 500, "client request body error", errors.array());
        }

        const body: IAddQuestionsListRequestBody = req.body;
        const result = await QuestionModel.addQuestionsList(
            body.list.map((question) => ({ ...question, created_date: new Date(body.created_date) }))
        );

        return res.json({
            msg: "questions successfully saved",
            data: result,
        });
    })
);

/**
 * @rotue   GET "/api/question/questions"
 * @desc    get questions specified by the filter
 */
router.get(
    "/questions",
    asyncHandler(async function getQuestionsById(req, res) {
        const { ids } = req.query;

        if (typeof ids === "string") {
            const list = ids.split(",");
            const result = await QuestionModel.find({ _id: { $in: list } }, "question_text question_options hasOption");
            const questionList = list.map((id) => result.find((question) => question.id === id));
            return res.json({ data: questionList });
        }

        if (Array.isArray(ids)) {
            const list = ids as string[];
            const result = await QuestionModel.find({ _id: { $in: list } }, "question_text question_options hasOption");
            const questionList = list.map((id) => result.find((question) => question.id === id));
            return res.json({ data: questionList, msg: "Successfully retreived required questions in order" });
        }

        return res.status(500).json({ msg: "ids must be a comma sepreated string or an array" });
    })
);

/**
 * @rotue   POST "/api/question/paper/format"
 * @desc    get questions specified by the filter
 */
router.post(
    "/paper/format",
    checkSchema({
        board: { in: ["body"], errorMessage: "board required", isString: true, not: true, isEmpty: true },
        class_name: { in: ["body"], errorMessage: "class name required", isString: true, not: true, isEmpty: true },
        subject: { in: ["body"], errorMessage: "subject required", isString: true, not: true, isEmpty: true },
        chapter: { in: ["body"], errorMessage: "chapter array is required", isArray: { options: { min: 1 } } },
        total_marks: { in: ["body"], errorMessage: "total marks required", isInt: true },
    }),
    asyncHandler(async function generatePaper(req, res) {
        // validate payload body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new CustomException(
                "ERR_CLIENT_REQUEST_BODY",
                500,
                "client request body error",
                errors.array({ onlyFirstError: true })
            );
        }

        const body: IPreFormattedPaperRequestBody = req.body;
        const result = await getSectionWiseQuestions(body.total_marks, body);

        return res.json({
            msg: "successfully retreive the data",
            data: result,
            total_questions: Object.values(result).reduce((acc, curr) => acc + curr.length, 0),
        });
    })
);

/**
 * @rotue   POST "/api/question/paper/refetch"
 * @desc    get a new question based on previous seletected questions
 */
router.post(
    "/paper/refetch",
    checkSchema({
        board: { in: ["body"], errorMessage: "board required", isString: true, not: true, isEmpty: true },
        class_name: { in: ["body"], errorMessage: "class name required", isString: true, not: true, isEmpty: true },
        subject: { in: ["body"], errorMessage: "subject required", isString: true, not: true, isEmpty: true },
        chapter: { in: ["body"], errorMessage: "chapter array is required", isArray: { options: { min: 1 } } },
        question_marks: { in: ["body"], errorMessage: "question marks required", isInt: true },
        question_ids: {
            in: ["body"],
            errorMessage: "question id array min length 1",
            isArray: { options: { min: 1 } },
        },
        number_of_questions: { in: ["body"], isInt: true },
    }),
    asyncHandler(async function getNewQuestion(req, res) {
        // validate payload body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new CustomException(
                "ERR_CLIENT_REQUEST_BODY",
                500,
                "client request body error",
                errors.array({ onlyFirstError: true })
            );
        }

        const body = req.body;
        const result = await QuestionModel.findFreshQuestionsByFilters({
            question_ids: body.question_ids,
            board: body.board,
            class_name: body.class_name,
            subject: body.subject,
            chapter: body.chapter,
            question_marks: body.question_marks,
            number_of_questions: body.number_of_questions,
        });

        return res.json({ data: result, total_count: result.length, msg: "successfully get new questions" });
    })
);

export default router;
