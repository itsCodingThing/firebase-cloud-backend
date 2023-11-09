import { firestore, logger } from "firebase-functions";
import { firestoreDB } from "../../../utils/firestore";
import { oneSignalClient } from "../../../utils/onesignal";

interface EnquiryData {
    id: string;
    user_type: "Student" | "Teacher";
    source: string;
    name: string;
    password: string;
    phone: string;
    priority: string;
    status: boolean;
    mother_name: string;
    image_url: string;
    gender: string;
    father_name: string;
    email: string;
    created_date: string;
    converted: boolean;
    class_id_list: string[];
    address: string;
}

export default firestore.document("schools/{schoolId}/enquiry/{enquiryId}").onCreate(async (snapshot, context) => {
    const enquiryData = snapshot.data() as EnquiryData;
    const { schoolId } = context.params;

    const teachers = await firestoreDB
        .collection("schools")
        .doc(schoolId)
        .collection("teachers")
        .where("is_admin", "==", true)
        .where("player_id", "!=", "")
        .get();

    if (teachers.empty) {
        logger.log("No admin teacher available.");
        return;
    }

    const playerList: string[] = [];
    teachers.forEach((element) => {
        if (element.get("player_id")?.length !== 0) {
            // console.log(element.get("name"));
            playerList.push(element.get("player_id"));
        }
    });

    try {
        await oneSignalClient.createNotification({
            include_player_ids: playerList,
            headings: { en: "Enquiry" },
            contents: { en: `New Enquiry Submitted by ${enquiryData.name}. tap to view details` },
        });
    } catch (error) {
        logger.warn("Unable to send enquiry notification", error);
    }
});
