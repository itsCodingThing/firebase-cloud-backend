import { format } from "date-fns";
import { firestore, logger } from "firebase-functions";
import { firestoreDB, firestoreTimestamp } from "../../../utils/firestore";

async function batchNotificationHistory(
    schoolId: string,
    studentIdList: string[],
    msg: { title: string; content: string; start_time: FirebaseFirestore.Timestamp },
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
            start_time: msg.start_time,
            user_type: userType,
            notification_type: notificationType,
            craeted_date: firestoreTimestamp.now(),
        });
    });

    return batch.commit();
}

export default firestore.document("schools/{schoolId}/papers/{paperId}").onCreate(async (snapshot, context) => {
    const { schoolId, paperId } = context.params;
    const school = firestoreDB.collection("schools").doc(schoolId);
    const paper = snapshot.data();

    try {
        // checking for nagetive mark in pdf quizo paper
        if (paper.question_type === "Pdf" && paper.paper_type == "Quizo") {
            const negative_mark = paper.pdf.negative_mark_per_que;

            if (negative_mark > 0) {
                await snapshot.ref.update({ "pdf.negative_mark_per_que": negative_mark * -1 });
            }
        }

        let studentIdList: string[] = [];

        // Fetch all students for that class and section
        if (paper.student_id.length === 0) {
            const list = await school.collection("students").where("class_id", "==", paper.class_id).get();

            list.forEach((doc) => {
                studentIdList.push(doc.id);
            });
        } else {
            studentIdList = paper.student_list;
        }

        const response = await batchNotificationHistory(
            schoolId,
            studentIdList,
            {
                title: paper.paper_name.toUpperCase(),
                content: `${paper.paper_type.toUpperCase()}(${paper.class_name}) paper has been scheduled at ${format(
                    paper.start_time.toDate(),
                    "dd/MM/yyyy"
                )}`,
                start_time: paper.start_time,
            },
            "STUDENT",
            paper.paper_type.toUpperCase()
        );

        logger.log({ msg: "notification successfully created", paper_id: paperId, response });
    } catch (error) {
        logger.error({ msg: "error to create paper notification", paper_id: paperId, error });
    }
});
