import { firestoreDB } from "../../utils/firestore";
export const fire = firestoreDB;

export async function getLibQuestionsDetails() {
    const result = await firestoreDB.collection("questions").get();
    const map = new Map();

    result.docs.forEach((el) => {
        if (map.has(el.get("board"))) {
            map.set(el.get("board"), [
                ...map.get(el.get("board")),
                {
                    id: el.get("id"),
                    board: el.get("board"),
                    class: el.get("class"),
                    subject: el.get("subject"),
                    chapter: el.get("chapter"),
                    topics: el.get("topics"),
                    level: el.get("level"),
                    marks: el.get("marks"),
                },
            ]);
        } else {
            map.set(el.get("board"), [
                {
                    id: el.get("id"),
                    board: el.get("board"),
                    class: el.get("class"),
                    subject: el.get("subject"),
                    chapter: el.get("chapter"),
                    topics: el.get("topics"),
                    level: el.get("level"),
                    marks: el.get("marks"),
                },
            ]);
        }
    });

    return Object.fromEntries(map);
}

export async function getQuestionsByids(ids: string[]) {
    const result = await Promise.all(
        ids.map(async (el) => {
            const snap = await firestoreDB.collection("questions").doc(el).get();
            return snap.data();
        })
    );
    return result;
}
