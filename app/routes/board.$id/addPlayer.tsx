import { Form, useActionData, useNavigation } from "@remix-run/react"

import { uuid } from 'uuidv4';

import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";

import { action } from "./route";

export function AddPlayer({ boardID }: { boardID: string }) {
    const navigation = useNavigation();
    const actionData = useActionData<typeof action>();

    return (
        <Form method="post" action={`/board/${boardID}?index`} navigate={false} >
            <fieldset
                disabled={navigation.state === "submitting"}
            >
                <input type="text" name="playerName" placeholder="player name" />
                <input type="number" name="initPoints" placeholder="initial points" />
                <input type="hidden" name="boardID" value={boardID} />
                <button type="submit">{navigation.state === "submitting"
                    ? "creating player..."
                    : "create player"}</button>
            </fieldset>
        </Form>
    )
}

export async function createPlayer(body: FormData) {
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