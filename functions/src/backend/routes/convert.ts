import express from "express";
import asyncHandler from "express-async-handler";
import { WordsApi, ConvertDocumentRequest } from "asposewordscloud";
import jsdom from "jsdom";

const router = express.Router();
router.use(express.raw());

const convertDocApi = new WordsApi("4dc88d9f-8f1e-4f59-8e60-c27aae676945", "81064d294b4eaf273cb348672d5b3a38");

interface LibQuestion {
    question: string;
    marks: number;
    solution: string;
    options: Array<{ option: string; answer: boolean }>;
}

/**
 * @rotue   POST "/api/convert/"
 * @desc    convert docx to html
 */
router.post(
    "/",
    asyncHandler(async function convert(req, res) {
        const questionList: LibQuestion[] = [];
        const request = new ConvertDocumentRequest({
            format: "html",
            document: req.body,
        });

        const result = await convertDocApi.convertDocument(request);

        if (result.response.statusCode !== 200) {
            return res.json({ status: false, msg: "something went wrong with aspose api" });
        }

        const dom = new jsdom.JSDOM(result.body.toString("utf-8"));
        const tableRow = dom.window.document.querySelectorAll("tr");

        let questionDetails: LibQuestion = {
            question: "",
            marks: 0,
            options: [],
            solution: "",
        };

        tableRow.forEach((el) => {
            const tableCols = el.querySelectorAll("td");
            const tag = tableCols[0].innerHTML;
            const value = tableCols[1].innerHTML;

            if (tag.includes("Question")) {
                questionDetails.question = value;
            }

            if (tag.includes("Option")) {
                const isCorrect = tableCols[2].innerHTML.includes("Correct");

                if (isCorrect) {
                    questionDetails.options.push({ option: value, answer: true });
                } else {
                    questionDetails.options.push({ option: value, answer: false });
                }
            }

            if (tag.includes("Solution")) {
                questionDetails.solution = value;
            }

            if (tag.includes("Marks")) {
                questionList.push(questionDetails);

                questionDetails = {
                    question: "",
                    marks: 0,
                    options: [],
                    solution: "",
                };
            }
        });

        return res.json({
            status: true,
            questions: questionList,
        });
    })
);

export default router;
