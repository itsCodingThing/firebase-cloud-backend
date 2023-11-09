import { firestore, logger } from "firebase-functions";
import { subMinutes } from "date-fns";

import { oneSignalClient } from "../../../utils/onesignal";
import { firestoreDB } from "../../../utils/firestore";

interface ContextParams {
    schoolId: string;
    notificationId: string;
}

interface Notification {
    title: string;
    description: string;
    user_id: string;
    user_type: string;
    created_date: string;
    notification_type: string;
    action_type?: string;
    data?: Record<string, unknown>;
    start_time?: FirebaseFirestore.Timestamp;
}

export default firestore
    .document("schools/{schoolId}/notifications/{notificationId}")
    .onCreate(async (snapshot, context) => {
        const { schoolId } = context.params as ContextParams;
        const notificationData = snapshot.data() as Notification;
        let userData;

        try {
            if (notificationData.user_type === "STUDENT") {
                userData = await firestoreDB
                    .collection("schools")
                    .doc(schoolId)
                    .collection("students")
                    .doc(notificationData.user_id)
                    .get();
            }

            if (notificationData.user_type === "TEACHER") {
                userData = await firestoreDB
                    .collection("schools")
                    .doc(schoolId)
                    .collection("teachers")
                    .doc(notificationData.user_id)
                    .get();
            }

            const playerId: string = userData?.get("player_id") ?? "";
            const start_time = userData?.get("start_time");

            const largeIcon =
                "https://firebasestorage.googleapis.com/v0/b/classinpocket-f5907.appspot.com/o/logo%2Flogo%20(2).png?alt=media&token=9c556a46-dab2-47f0-a845-e13c770e2db1";

            if (playerId) {
                if (start_time) {
                    await oneSignalClient.createNotification({
                        include_player_ids: [playerId],
                        headings: { en: notificationData.title },
                        contents: { en: notificationData.description },
                        large_icon: largeIcon,
                        send_after: subMinutes(start_time.toDate(), 15).toUTCString(),
                    });
                }

                await oneSignalClient.createNotification({
                    include_player_ids: [playerId],
                    headings: { en: notificationData.title },
                    contents: { en: notificationData.description },
                    large_icon: largeIcon,
                });
            }
        } catch (error) {
            logger.error({ msg: `Unable to send notification for user ${userData?.get("id")}` });
        }
    });
