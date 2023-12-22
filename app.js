import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, doc,
    setDoc, getDocs, query, where
} from "firebase/firestore";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { app } from "./server.js";

// formatter removes all alignment
// will (maybe) add it back later
// .

const firebaseConfig = {
    apiKey: "AIzaSyAIzsUMpUC6_zSlZtTHLmiA5UGlYZl3CPY",
    authDomain: "leaderbored-c1ea2.firebaseapp.com",
    projectId: "leaderbored-c1ea2",
    storageBucket: "leaderbored-c1ea2.appspot.com",
    messagingSenderId: "1043865417419",
    appId: "1:1043865417419:web:970c2594274dc4d2798d4e",
    measurementId: "G-18P8KDGWMY"
};

initializeApp(firebaseConfig);

const db = getFirestore();
const upload = multer();

app.get("/", (req, res) => {
    res.render("index");
});

async function getBoard(boardID) {
    const collRef = collection(db, boardID);
    let query; // for non-zero queries

    try {
        query = await getDocs(collRef);

        if (query.length == 0) return { boardData: null, entries: null };
    } catch (e) {
        console.error(e);
        return { boardData: null, entries: null };
    }

    let entries = [];
    let boardData;

    query.forEach(element => {
        let elem = element.data();

        if (element.id == "board") {
            // this is the board data element
            boardData = elem;
        } else {
            entries.push(elem);
        }
    });

    return { boardData: boardData, entries: entries };
}

app.get("/board/:id", async (req, res) => {
    let boardID = req.params["id"];

    if (boardID == null ||
        boardID == undefined) {
        res.status(404);
        return;
    }

    let { boardData, entries } = await getBoard(boardID);

    if (!boardData || !entries) {
        // this should be impossible
        res.status(404);
        return;
    }

    res.marko(require("./views/template.marko").default,
        { boardID: boardID, boardData: boardData, entries: entries });
    // res.render("leaderboard", { boardID: boardID, boardData: boardData, entries: entries });
});

app.post("/board/create", upload.fields([]), (req, res) => {
    const name = req.body["name"];
    const uuid = uuidv4();

    const boardColl = collection(db, uuid);

    setDoc(doc(boardColl, "board"), {
        name: name,
        owner: "",
        participants: 0,
        description: "",
        settings: ""
    }).catch(e => {
        console.error(e);
        res.send({ "success": false, "message": "server error attempting to create board" });
        return;
    });

    res.send({ "success": true, "message": "success" });
});

app.post("/player/new", upload.fields([]), async (req, res) => {
    const boardID = req.body["boardID"];
    const name = req.body["name"];
    const points = req.body["points"];

    if (!(await newPlayer(boardID, name, points))) {
        res.send({ "success": false, "message": "this username already exists in this board" });
        return;
    };

    let { boardData, entries } = getBoard(boardID);

    if (!boardData || !entries) {
        res.status(404);
        return;
    }

    res.send({ "success": true, "message": entries });
});

async function newPlayer(boardID, playerName, initialPoints) {
    const uuid = uuidv4();
    const boardColl = collection(db, boardID);

    const q = query(boardColl, where("name", "==", playerName));

    if ((await getDocs(q)).size !== 0) {
        // duplicate username
        return false;
    }

    setDoc(doc(boardColl, uuid), {
        name: playerName,
        points: initialPoints,
        ranking: 0
    }).catch(e => {
        console.error(e);
        return false;
    });

    return true;
}