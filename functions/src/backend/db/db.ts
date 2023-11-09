import { config } from "firebase-functions";
import Mongoose from "mongoose";

const { db = { user: "classinpocket", password: "" } } = config();

let database: Mongoose.Connection;
const uri = `mongodb+srv://${db.user}:${db.password}@cluster0.aghsv.mongodb.net/library`;

export function connect() {
    if (database) {
        console.log("Cached database");
        return;
    }

    Mongoose.connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });

    database = Mongoose.connection;

    database.on("error", () => {
        console.log("Error connecting to database");
    });
}

export function disconnect() {
    if (!database) {
        return;
    }
    Mongoose.disconnect();
}
