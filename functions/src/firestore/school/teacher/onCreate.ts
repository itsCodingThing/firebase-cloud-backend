import * as functions from "firebase-functions";

import { ITeacher } from "../../../interfaces/Teacher";
import { firestoreDB } from "../../../utils/firestore";
import { sendNodeMailer } from "../../../utils/mail";

export default functions.firestore
    .document("schools/{schoolId}/teachers/{teacherId}")
    .onCreate(async (snapshot, context) => {
        const { schoolId } = context.params;

        const teacherData = <ITeacher>snapshot.data();
        const schoolDocSnapshot = await firestoreDB.collection("schools").doc(schoolId).get();

        await sendNodeMailer(
            {
                to: teacherData.email,
                from: "examkul.developers@gmail.com",
                subject: "ClassInPocket Registration",
            },
            {
                type: "teacher",
                userName: teacherData.name,
                userLoginId: teacherData.email,
                userPassword: teacherData.password,
                orgName: schoolDocSnapshot.get("name"),
            }
        );
    });
