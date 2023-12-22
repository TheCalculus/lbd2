export default function BoardNavbar() {
    return (
        <div className="box">
            <div className="board_info">
                <p className="important">
                    <i className="fa fa-hashtag" aria-hidden="true"></i>
                    xuvh...
                </p>
                <p>
                    <i className="fa fa-tag" aria-hidden="true"></i>
                    jimmy's jimm
                </p>
                <div className="separator"></div>
                <p>
                    <i className="fa fa-question-circle" aria-hidden="true"></i>
                    by jimmy himself
                </p>
                <p>
                    <i className="fa fa-random" aria-hidden="true"></i>
                    111 participants
                </p>
            </div>
            <div className="self_info">
                <p>
                    <i className="fa fa-user" aria-hidden="true"></i>
                    notjim
                </p>
                <p>1000 points</p>
                <p>
                    <i className="fa fa-cog" aria-hidden="true"></i>
                </p>
            </div>
        </div>
    )
}