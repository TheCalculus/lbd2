import type { ActionFunctionArgs } from "@remix-run/node";
import { uuid } from 'uuidv4';

import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";

export async function action({
    request,
}: ActionFunctionArgs) {
    const body = await request.formData();
    const player = await createPlayer(body);

    return null;
}

async function createPlayer(body: FormData) {
    const playerName = body.get("playerName");
    const initalPoints = body.get("initPoints");
    const boardID = body.get("boardID");

    const board = collection(db, String(boardID));
    const q = query(board, where("name", "==", playerName));

    if ((await getDocs(q)).size !== 0) {
        // duplicate username
        return false;
    }

    setDoc(doc(board, uuid()), {
        name: playerName,
        points: initalPoints,
        ranking: 0
    }).catch(e => {
        console.error(e);
        return false;
    });
}