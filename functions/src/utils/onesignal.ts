import { config } from "firebase-functions";
import { Client as OneSignalClient } from "onesignal-node";

const {
    onesignal = { id: "onesignal_id", key: "onesignal_key" },
} = config();

export const oneSignalClient = new OneSignalClient(onesignal.id, onesignal.key);

export const largeIcon = "";

export default oneSignalClient;
