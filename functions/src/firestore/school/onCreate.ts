import * as functions from "firebase-functions";
import { sendNodeMailer } from "../../utils/mail";

export default functions.firestore.document("schools/{schoolId}").onCreate((snapshot) => {
    const school = snapshot.data();

    return sendNodeMailer(
        {
            to: snapshot.get("email"),
            from: "examkul.developers@gmail.com",
            subject: "ClassInPocket Registration",
        },
        { userLoginId: school.email, userPassword: school.password, type: "school" }
    );
});
