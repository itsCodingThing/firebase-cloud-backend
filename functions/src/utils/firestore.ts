import * as admin from "firebase-admin";

admin.initializeApp();

export const firestoreTimestamp = admin.firestore.Timestamp;
export const fieldValue = admin.firestore.FieldValue;
export const firestoreDB = admin.firestore();
