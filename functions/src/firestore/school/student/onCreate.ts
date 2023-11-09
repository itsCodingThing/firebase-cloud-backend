import * as functions from "firebase-functions";

import { sendNodeMailer } from "../../../utils/mail";
import { firestoreDB, firestoreTimestamp } from "../../../utils/firestore";
import { IStudent } from "../../../interfaces/Student";

export default functions.firestore
    .document("schools/{schoolId}/students/{studentId}")
    .onCreate(async (snapshot, context) => {
        const { schoolId, studentId } = context.params;
        const studentData = <IStudent>snapshot.data();

        const leaderBoardCollection = firestoreDB.collection("schools").doc(schoolId).collection("leaderboard");
        const schoolDocSnapshot = await firestoreDB.collection("schools").doc(schoolId).get();

        await Promise.allSettled([
            // create leaderboard
            leaderBoardCollection.doc(studentId).set({
                id: studentId,
                student_name: studentData.name,
                student_id: studentId,
                class_name: studentData.class.class_name,
                class_id: studentData.class_id,
                section: studentData.class.section,
                total_paper: 0,
                attempted_papers: 0,
                total_marks: 0,
                obtained_marks: 0,
                status: false,
                craeted_date: firestoreTimestamp.now(),
                school_id: studentData.school_id,
            }),

            // send mail to student
            sendNodeMailer(
                {
                    to: studentData.email,
                    from: "examkul.developers@gmail.com",
                    subject: "ClassInPocket Registration",
                },
                {
                    type: "student",
                    userName: studentData.name,
                    userLoginId: studentData.login_id,
                    userPassword: studentData.password,
                    orgName: schoolDocSnapshot.get("name"),
                }
            ),
        ]);
    });
