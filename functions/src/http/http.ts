import { https } from "firebase-functions";
import app from "../backend/app";
import { connect } from "../backend/db/db";

connect();
export const backend = https.onRequest(app);
