import { useLoaderData } from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";

import { DocumentData, collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";

import root from "app/styles/root_styles.css";
import styles from "app/styles/style.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHashtag } from '@fortawesome/free-solid-svg-icons'

import BoardNavbar from "./navbar";
import { AddPlayer, createPlayer } from "./addPlayer";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: root },
    { rel: "stylesheet", href: styles },
];

export async function loader({
    params,
}: LoaderFunctionArgs) {
    const board = await getBoard(params.id || "");
    return board;
}

export async function action({
    request,
}: ActionFunctionArgs) {
    const body = await request.formData();
    const player = await createPlayer(body);

    return player || null;
}

export default function BoardID() {
    const { entries, boardData } = useLoaderData<typeof loader>();

    return (
        <div className="content">
            <BoardNavbar board={boardData} />
            <AddPlayer boardID={(boardData as { boardID: string }).boardID} />

            <div className="board">
                <div className="entry">
                    <FontAwesomeIcon icon={faHashtag} />
                    <p>username</p>
                    <p></p>
                    <p>points</p>
                </div>
                {entries.map(element => (
                    <div className="entry" key={element.id}>
                        <p>{element.ranking}</p>
                        <p>{element.name}</p>
                        <p>{element.quote}</p>
                        <p>{element.points}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface BoardState {
    readonly boardData: Object,
    readonly entries: DocumentData[],
}

async function getBoard(boardID: string): Promise<BoardState> {
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

    boardData.boardID = boardID;

    return { boardData: boardData, entries: entries };
}