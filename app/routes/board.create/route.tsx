import React, { useState, useEffect } from "react";
import { useParams } from "@remix-run/react";

import { DocumentData, collection, getDocs } from "firebase/firestore";
import { db } from "firebase/firebase-config.js";

import type { LinksFunction } from "@remix-run/node";

import root from "app/styles/root_styles.css";
import styles from "app/styles/style.css";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: root },
    { rel: "stylesheet", href: styles },
];

export default function BoardCreate() {
    return (
        <div className="modal">
            <form method="post" action="/board/create?index" className="form-box">
                <p>new board</p>
                <input type="text" name="boardName" id="" placeholder="board name" />
                <input type="text" name="ownerName" id="" placeholder="owner uname" />
                <button>create</button>
            </form>
        </div>
    );
}