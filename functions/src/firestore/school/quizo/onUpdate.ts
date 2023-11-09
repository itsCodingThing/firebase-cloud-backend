import { firestore as firestoreTrigger, logger } from "firebase-functions";
import { fieldValue, firestoreDB } from "../../../utils/firestore";

interface CopyPayload {
    paperId: string;
    paperObtainedMarks: number;
    paperTotalMarks: number;
    attempted: boolean;
    id: string;
    paperName: string;
    paperType: string;
    questionType: string;
    testType: string;
    examType: string;
    subjectList: string[];
    startTime: string;
    endTime: string;
}

async function updateStudentLeaderBoard(studentId: string, schoolId: string, copyPayload: CopyPayload) {
    const studentLeaderBoardDocRef = firestoreDB
        .collection("schools")
        .doc(schoolId)
        .collection("leaderboard")
        .doc(studentId);
    const studentLeaderBoardDocData = await studentLeaderBoardDocRef.get();

    await studentLeaderBoardDocRef
        .collection("paper_list")
        .doc(copyPayload.paperId)
        .set({
            attempted: true,
            paper_obtained_marks: copyPayload.paperObtainedMarks,
            id: copyPayload.id,
            paper_id: copyPayload.paperId,
            paper_name: copyPayload.paperName,
            paper_type: copyPayload.paperType,
            question_type: copyPayload.questionType,
            test_type: copyPayload.testType,
            exam_type: copyPayload.examType,
            subject_list: copyPayload.subjectList,
            start_time: copyPayload.startTime,
            end_time: copyPayload.endTime,
            paper_total_marks: copyPayload.paperTotalMarks,
            class_id: studentLeaderBoardDocData.get("class_id"),
            student_id: studentLeaderBoardDocData.get("student_id"),
            student_classname: studentLeaderBoardDocData.get("class_name"),
            student_section: studentLeaderBoardDocData.get("section"),
            student_name: studentLeaderBoardDocData.get("student_name"),
            school_id: studentLeaderBoardDocData.get("school_id"),
        });

    await studentLeaderBoardDocRef.update({
        attempted_papers: fieldValue.increment(1),
        obtained_marks: fieldValue.increment(copyPayload.paperObtainedMarks),
        total_marks: fieldValue.increment(copyPayload.paperTotalMarks),
    });
}

export default firestoreTrigger.document("/schools/{schoolId}/quizo/{quizoId}").onUpdate(async (snapshot, context) => {
    const { schoolId } = context.params;
    const examCompleted = snapshot.after.get("exam_completed") ?? true;

    try {
        if (examCompleted) {
            const { paper, ...restCopy } = snapshot.after.data();
            const payload: CopyPayload = {
                paperId: paper.id,
                id: paper.id,
                attempted: true,
                paperTotalMarks: paper.paper_total_marks,
                paperObtainedMarks: restCopy.obtained_marks,
                paperName: paper.paper_name,
                examType: paper.exam_type,
                paperType: paper.paper_type,
                questionType: paper.question_type,
                testType: paper.test_type,
                subjectList: paper.subject_list,
                startTime: paper.start_time,
                endTime: paper.end_time,
            };

            await updateStudentLeaderBoard(restCopy.student_id, schoolId, payload);
        }
    } catch (error) {
        logger.error(error);
    }
});
