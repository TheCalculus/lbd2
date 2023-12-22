import { useState, useEffect } from "react";
import { useParams } from "@remix-run/react";

import { DocumentData, collection, getDocs } from "firebase/firestore";
import { db } from "firebase/firebase-config.js";

import BoardNavbar from "./navbar";

import type { LinksFunction } from "@remix-run/node";

import root from "app/styles/root_styles.css";
import styles from "app/styles/style.css";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: root },
    { rel: "stylesheet", href: styles },
];

export default function BoardID() {
    const [entries, setEntries] = useState<DocumentData[]>([]);
    const boardID = useParams().id || "";

    useEffect(() => {
        const fetchBoardData = async () => {
            const { entries } = await getBoard(boardID);
            setEntries(entries);
        };

        fetchBoardData();
    }, []);

    return (
        <div className="content">
            <BoardNavbar />
            <div className="board">
                <div className="entry">
                    <i className="fa fa-hashtag" aria-hidden="true"></i>
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
    let boardData: Object = {};

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

    return { boardData: boardData, entries: entries };
}