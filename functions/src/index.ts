import * as firestore from "./firestore/firestore";
import * as https from "./http/http";
import sheduleBackup from "./pubsub/sheduleBackup";

export const firestoreDb = firestore;
export const httpstrigger = https;
export const backup = sheduleBackup;
