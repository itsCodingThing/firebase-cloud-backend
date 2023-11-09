import * as functions from "firebase-functions";

import { firestoreDB, firestoreTimestamp } from "../../../utils/firestore";

async function batchNotificationHistory(
    schoolId: string,
    studentIdList: string[],
    msg: { title: string; content: string },
    userType: string,
    notificationType: string
) {
    const school = firestoreDB.collection("schools").doc(schoolId);
    const notificationHistory = school.collection("notifications");

    const batch = firestoreDB.batch();

    studentIdList.forEach((id) => {
        const docRef = notificationHistory.doc();

        batch.set(docRef, {
            user_id: id,
            title: msg.title,
            description: msg.content,
            user_type: userType,
            notification_type: notificationType,
            craeted_date: firestoreTimestamp.now(),
        });
    });

    return batch.commit();
}

export default functions.firestore
    .document("schools/{schoolId}/lectures/{lectureId}")
    .onCreate(async (snapshot, context) => {
        const { schoolId } = context.params;
        const school = firestoreDB.collection("schools").doc(schoolId);
        const lecture = snapshot.data();

        try {
            let studentIdList: string[] = [];

            if (lecture.student_list.length === 0) {
                // Fetch all students for that class and section
                const list = await school.collection("students").where("class_id", "==", lecture.class_id).get();

                list.forEach((doc) => {
                    studentIdList.push(doc.id);
                });
            } else {
                // Fetch students from the student_id list
                studentIdList = lecture.student_list;
            }

            await batchNotificationHistory(
                schoolId,
                studentIdList,
                { title: lecture.title, content: lecture.description },
                "STUDENT",
                "LECTURE"
            );
        } catch (error) {
            functions.logger.error({ msg: error.message });
        }
    });
