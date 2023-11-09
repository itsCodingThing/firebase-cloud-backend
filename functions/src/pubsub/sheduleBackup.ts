import { pubsub, logger } from "firebase-functions";
import firestore from "@google-cloud/firestore";
import { format } from "date-fns";

const client = new firestore.v1.FirestoreAdminClient({});

export default pubsub.schedule("every 24 hours").onRun(async () => {
    const dateOfBackup = format(new Date(), "dd-MM-yyyy");
    const bucket = "prod-backup";
    const prefix = `gs://${bucket}/backup/backup-${dateOfBackup}`;
    const databaseName = client.databasePath("f5907", "(default)");

    try {
        const response = await client.exportDocuments({
            name: databaseName,
            outputUriPrefix: prefix,
            collectionIds: [],
        });

        logger.log(`Successfully exported all the documents: ${response[0].name}`);
    } catch (e) {
        logger.error(e);
        // logger.log(`Unable to exported all the documents: ${dateOfBackup}`);
    }
});
