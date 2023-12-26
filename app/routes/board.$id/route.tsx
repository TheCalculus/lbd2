import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react"
import { json } from "@remix-run/node";
import type { LinksFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node"

import root from "app/styles/root_styles.css";
import styles from "app/styles/style.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHashtag } from '@fortawesome/free-solid-svg-icons'

import BoardNavbar from "./navbar";
import { getBoard, createPlayer } from "./board";

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

/* start addPlayer */

export async function action({
    request,
}: ActionFunctionArgs) {
    const body = await request.formData();
    const player = await createPlayer(body);

    return json(player);
}

export function AddPlayer({ boardID }: { boardID: string }) {
    const navigation = useNavigation();
    const actionData = useActionData<typeof action>();

    return (
        <Form method="post" action={`/board/${boardID}?index`} navigate={false} className="box" >
            <fieldset
                disabled={navigation.state === "submitting"}
            >
                <input type="text" name="playerName" placeholder="player name" />
                <input type="number" name="initPoints" placeholder="initial points" />
                <input type="hidden" name="boardID" value={boardID} />
                <button type="submit">{navigation.state === "submitting"
                    ? "creating player..."
                    : "create player"}</button>

                { !actionData?.success ? actionData?.error : "success!" }
            </fieldset>
        </Form>
    )
}

/* end addPlayer */

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
                        <p>{element.points.length > 18      ? 
                            Number(element.points).toExponential(2) : 
                            Number(element.points).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}