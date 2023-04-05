import { collection, doc, getDoc, getDocs, getFirestore, query, where, updateDoc, addDoc } from "firebase/firestore"; 
import firebaseApp from "../../config";

const database = getFirestore(firebaseApp);

function updateStatus(myRels, theirRels, myKey, theirKey, myNewStatus, theirNewStatus){
    var myNewRels = myRels.filter(rel => rel.key !== theirKey);
    var theirNewRels = theirRels.filter(rel => rel.key !== myKey);
    if(theirNewStatus !== "none" && myNewStatus !== "none"){
        myNewRels.push({key: theirKey, status: myNewStatus});
        theirNewRels.push({key: myKey, status: theirNewStatus});
    }
    if(typeof(myNewRels) === "undefined"){
        myNewRels = [];
    }
    if(typeof(theirNewRels) === "undefined"){
        theirNewRels = [];
    }
    return([myNewRels, theirNewRels]);
}

export default async (req, res) =>{
    if(req.method === 'POST'){
        console.log(req.body);
        const usersRef = collection(database, "users");
        const them = query(usersRef, where("key", "==", req.body.theirKey))
        const querySnapshot = await getDocs(them);
        let theirId;
        let theirRels : {key: string, status: string}[] = [];
        let theirEmail;
        let themRef;
        let theirName;
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            themRef = doc.ref;
            theirRels = doc.data().relationships;
            theirId = doc.id;
            theirEmail = doc.data().email;
            theirName = doc.data().name;
        });

        //get my "relationship" map
        const user = query(usersRef, where("key", "==", req.body.myKey))
        const querySnapshot2 = await getDocs(user);
        let myRels : {key: string, status: string}[] = [];
        let id;
        let userRef;
        let myName;
        querySnapshot2.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            userRef = doc.ref;
            myRels = doc.data().relationships;
            myName = doc.data().name;
            id = doc.id;
        });
        //search for other users user's key in relationship field
        let myRel : any;
        myRel = myRels.find(e => e.key === req.body.theirKey);
        
        let theirRel : any;
        theirRel = theirRels.find(e => e.key === req.body.myKey);
        let responseCode = 0;
        let myNewStatus : any;
        let theirNewStatus : any;
        //I am sending friend request
        if(req.body.action == "request" && typeof(myRel) == "undefined" && typeof(theirRel) == "undefined"){
            myNewStatus = "pending";
            theirNewStatus = "respond";
        }
        // I am accepting friend request
        else if(req.body.action == "accept" && myRel.status == 'respond' && theirRel.status == "pending"){
            // create a chat for us
            const chatsCollection = collection(database, "chats");
            let newChat = {
                recentMessageSender: "",
                recentMessageText: "",
                recentMessageTime: "",
                userKeys: [
                    req.body.myKey,
                    req.body.theirKey
                ],
                users: [
                    {
                        key: req.body.myKey,
                        name: myName
                    },
                    {
                        key: req.body.theirKey,
                        name: theirName
                    }
                ]
            }
            console.log(newChat);
            addDoc(chatsCollection, newChat);
            myNewStatus = "friends";
            theirNewStatus = "friends";
        }
        // I am ignoring a friend request
        else if(req.body.action == "ignore" && myRel.status == "respond" && theirRel.status == "pending"){
            myNewStatus = "none";
            theirNewStatus = "none";
        }
        // I am blocking another user
        else if(req.body.action == "block" && myRel.status == "respond" && theirRel.status == "pending"){
            myNewStatus = "sentBlock";
            theirNewStatus = "blocked";
        }
        // I am unblocking another user
        else if(req.body.action == "unblock" && myRel.status == "sentBlock" && theirRel.status == "blocked"){
            myNewStatus = "none";
            theirNewStatus = "none";
        }
        // I am unfriending another user
        else if(req.body.action == "unfriend" && myRel.status == "friends" && theirRel.status == "friends"){
            myNewStatus = "none";
            theirNewStatus = "none";
        }
        // None of the other possible actions could be resolved
        else{
            console.log("An error occured: could not match relationship status and action");
            console.log(req.body);
            res.status(400).end();
        }
        let [myNewRels, theirNewRels] = updateStatus(myRels, theirRels, req.body.myKey, req.body.theirKey, myNewStatus, theirNewStatus);
        updateDoc(userRef, {relationships: myNewRels});
        updateDoc(themRef, {relationships: theirNewRels});
        res.status(200).json({email: theirEmail, newStatus: myNewStatus});
    }
    else {
        res.status(405).end()
    }
}