import { firestore, logger } from "firebase-functions";

import { largeIcon, oneSignalClient } from "../../../utils/onesignal";

interface AnnouncementData {
    id: string;
    title: string;
    description: string;
    tag_id: string;
    tag_name: string;
    banner_image: string;
    tap_link: string;
    created_by: string;
    created_date: FirebaseFirestore.Timestamp;
    type: string;
}

export default firestore.document("schools/{schoolId}/announcements/{announcementId}").onCreate(async (snapshot) => {
    const announcementData = snapshot.data() as AnnouncementData;

    try {
        await oneSignalClient.createNotification({
            filters: [{ field: "tag", key: announcementData.tag_name, relation: "=", value: announcementData.tag_id }],
            headings: { en: announcementData.title },
            contents: { en: announcementData.description },
            large_icon: largeIcon,
            buttons: [{ id: "notification_action_btn", text: "Tap here" }],
            ...(announcementData.banner_image?.length > 0 && { big_picture: announcementData.banner_image }),
        });
    } catch (error) {
        logger.error({ msg: "unable to create notification", error });
    }
});
