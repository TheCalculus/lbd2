import { DocumentData } from "firebase/firestore";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHashtag, faTag, faQuestionCircle, faRandom, faUser, faCog } from '@fortawesome/free-solid-svg-icons'

export default function BoardNavbar({ board }: DocumentData) {
    return (
        <div className="box">
            <div className="board_info">
                <p className="important">
                    <FontAwesomeIcon icon={faHashtag} />
                    {board?.boardID?.slice(0, 5)}...
                </p>
                <p>
                    <FontAwesomeIcon icon={faTag} />
                    {board?.name}
                </p>
                <div className="separator"></div>
                <p>
                    <FontAwesomeIcon icon={faQuestionCircle} />
                    by {board?.owner}
                </p>
                <p>
                    <FontAwesomeIcon icon={faRandom} />
                    {board?.participants} participants
                </p>
            </div>
            <div className="self_info">
                <p>
                    <FontAwesomeIcon icon={faUser} />
                    notjim
                </p>
                <p>1000 points</p>
                <p>
                    <FontAwesomeIcon icon={faCog} />
                </p>
            </div>
        </div>
    )
}