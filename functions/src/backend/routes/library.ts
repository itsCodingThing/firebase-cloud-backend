import express from "express";
import asyncHandler from "express-async-handler";
import { getLibQuestionsDetails, getQuestionsByids } from "../db/fire";

const router = express.Router();

/**
 * @rotue   GET "/api/library/"
 * @desc    library questions details
 */
router.get(
    "/",
    asyncHandler(async function (req, res) {
        const data = await getLibQuestionsDetails();

        res.set("Cache-Control", "public, max-age=300, s-maxage=600");
        return res.json({
            msg: "successfully retreive data.",
            data,
        });
    })
);

/**
 * @rotue   GET "/api/library/questions?ids"
 * @desc    get library questions from ids
 */
router.get(
    "/questions",
    asyncHandler(async function (req, res) {
        const ids = req.query.ids as string[];
        const data = await getQuestionsByids(ids);

        return res.json({ msg: "successfully retreive questions by ids", data });
    })
);

export default router;
