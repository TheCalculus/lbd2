import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react"
import { json } from "@remix-run/node";
import type { LinksFunction, LoaderFunctionArgs, ActionFunctionArgs, MetaFunction, LoaderFunction } from "@remix-run/node"

import root from "app/styles/root_styles.css";
import styles from "app/styles/style.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHashtag } from '@fortawesome/free-solid-svg-icons'

import BoardNavbar from "./navbar";
import { getBoard, createPlayer } from "./board";
import { useState } from "react";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: root },
    { rel: "stylesheet", href: styles },
];

export async function loader({ params }: LoaderFunctionArgs) {
    const board = await getBoard(params.id || "");

    return board;
}

export async function action({ request }: ActionFunctionArgs) {
    const body = await request.formData();

    const playerName = body.get("playerName");
    const initPoints = body.get("initPoints");
    const boardID = body.get("boardID");

    if (!playerName || !initPoints || !boardID)
        return json({ success: false, error: "received null as an argument" });

    if (String(playerName).length > 25)
        return json({ success: false, error: "player name too long" });

    const player = await
        createPlayer(String(playerName), Number(initPoints), String(boardID));

    return json(player);
}

interface AddPlayerProps {
    boardID: string;
    setModalOpen: (isOpen: boolean) => void;
}

export function AddPlayer({ boardID, setModalOpen }: AddPlayerProps) {
    const fetcher = useFetcher();

    let data = fetcher.data as { success: boolean | null, error: string };
    if (data?.success != null) setModalOpen(false);

    return (
        <>
            <fetcher.Form method="post" action={`/board/${boardID}?index`} /* navigate={false} */ className="form-box" >
                <input type="text" name="playerName" autoComplete="new-password" placeholder="player name" />
                <input type="number" name="initPoints" autoComplete="new-password" placeholder="initial points" />
                <input type="hidden" name="boardID" autoComplete="new-password" value={boardID} />
                <button type="submit">create player</button>
            </fetcher.Form >
            {/* <div className="modal">
                <span className="formError">{!data?.success ? data?.error : null}</span>
            </div> */}
        </>
    )
}

export default function BoardID() {
    const { entries, boardData } = useLoaderData<typeof loader>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [modalOpen, setModalOpen] = useState(searchParams.get("player") != null);

    return (
        <>
            {modalOpen &&
                <div className="modal">
                    <AddPlayer boardID={(boardData as { boardID: string }).boardID} setModalOpen={setModalOpen} />
                </div>
            }
            <div className="container">
                <div className="board-content">
                    <div className="entry">
                        <p><FontAwesomeIcon icon={faHashtag} /></p>
                        <p>username</p>
                        <p>{/* player description / flare */}</p>
                        <p>points</p>
                    </div>
                    {entries.map(element => (
                        <div className="entry" key={element.id}>
                            <p>{element.ranking}</p>
                            <p>{element.name}</p>
                            <p>{element.quote}</p>
                            <p>{element.points.length >= 18 ?
                                Number(element.points).toExponential(2) :
                                Number(element.points).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                <div className="chat-content">
                    {entries.map((element, index) => (
                        <p><span>[{new Date().getTime()}]</span> chat message {index}!!</p>
                    ))}
                </div>
                <div className="board-info">
                    <BoardNavbar board={boardData} />
                </div>
            </div>
        </>
    );
}