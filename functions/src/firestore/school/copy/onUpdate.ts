import { firestore, logger } from "firebase-functions";
import { fieldValue, firestoreDB, firestoreTimestamp } from "../../../utils/firestore";

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
    const studentLeaderBoardPaperListColl = studentLeaderBoardDocRef.collection("paper_list");
    const studentLeaderBoardDocData = await studentLeaderBoardDocRef.get();

    await studentLeaderBoardPaperListColl.doc(copyPayload.paperId).set({
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

export default firestore.document("schools/{schoolId}/copies/{copyId}").onUpdate(async (snapshot, context) => {
    const { schoolId } = context.params;
    const copyBefore = snapshot.before;
    const copyAfter = snapshot.after;
    const { paper, ...restCopy } = copyAfter.data();

    const notificationCollectionRef = firestoreDB.collection("schools").doc(schoolId).collection("notifications");

    try {
        // on copy assigned by admin
        if (!copyBefore.get("copy_assigned") && copyAfter.get("copy_assigned")) {
            await notificationCollectionRef.add({
                user_id: restCopy.teacher_id,
                user_type: "TEACHER",
                action_type: "COPYASSIGNED",
                title: paper.paper_name,
                description: `Paper(${paper.paper_name}) of ${restCopy.student_details.name}(${paper.class_name}) is assigned to you.\nTap to check.`,
                data: copyAfter.data(),
                created_date: firestoreTimestamp.now(),
            });
        }

        // on copy checked by teacher
        if (!copyBefore.get("is_result_declared") && copyAfter.get("is_result_declared")) {
            await updateStudentLeaderBoard(restCopy.student_id, schoolId, {
                paperId: paper.id,
                paperTotalMarks: paper.paper_total_marks,
                paperObtainedMarks: restCopy.question_obtained_list.reduce(
                    (acc: number, curr: number) => acc + curr,
                    0
                ),
                attempted: true,
                id: paper.id,
                paperName: paper.paper_name,
                examType: paper.exam_type,
                paperType: paper.paper_type,
                questionType: paper.question_type,
                testType: paper.test_type,
                subjectList: paper.subject_list,
                startTime: paper.start_time,
                endTime: paper.end_time,
            });

            await notificationCollectionRef.add({
                user_id: restCopy.student_id,
                user_type: "STUDENT",
                action_type: "COPYCHECKED",
                title: `${paper.paper_name}`,
                notification_type: "RESULT",
                description: `Your result of ${paper.paper_name}(${paper.class_name}) has been declared.`,
                data: copyAfter.data(),
                created_date: firestoreTimestamp.now(),
            });
        }
    } catch (error) {
        logger.error(error);
    }
});
