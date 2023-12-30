import { DocumentData, collection, getDocs, setDoc, doc, query, where } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";

import { uuid } from "uuidv4";

interface BoardState {
    readonly boardData: Object,
    readonly entries: DocumentData[],
}

export async function getBoard(boardID: string): Promise<BoardState> {
    const collectionRef = collection(db, boardID);

    let query, entries: DocumentData[] = [];
    let boardData: { [key: string]: any } = {};

    try {
        query = await getDocs(collectionRef);
        if (query.size === 0) return { boardData: {}, entries: [] };
    } catch (e) {
        console.error(e);
        return { boardData: {}, entries: [] };
    }

    query.forEach(element => {
        let elem = element.data();

        if (element.id === "board") {
            // found the data board element
            boardData = elem;
        } else {
            // append to the list of entries
            entries.push(elem);
        }
    });

    entries = entries.sort((a, b) => {
        return b.points - a.points;
    });
    
    entries.forEach((e, index) => {
        e.ranking = index + 1;
    });

    boardData.boardID = boardID;

    return { boardData: boardData, entries: entries };
}

export async function createPlayer(playerName: string, initalPoints: number, boardID: string) {
    const board = collection(db, String(boardID));
    const q = query(board, where("name", "==", playerName.toString()));

    if ((await getDocs(q)).size !== 0) {
        // duplicate username
        return { success: false, error: "be original nerd... come up with a unique username" };
    }

    setDoc(doc(board, uuid()), {
        name: playerName,
        points: initalPoints,
        ranking: 0
    }).catch(e => {
        console.error(e);
        return { success: false, error: "i think i messed up the server code" };
    });

    return { success: true, error: "none" };
}