import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore"; 
import firebaseApp from "../../config";

const database = getFirestore(firebaseApp);

export default async (req, res) =>{
    if(req.method === 'POST'){
        
        const usersRef = collection(database, "users");

        //get my "relationship" map
        const user = query(usersRef, where("key", "==", req.body.myKey))

        const querySnapshot2 = await getDocs(user);
        let relationships : {key: string, status: string}[] = [];
        querySnapshot2.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            relationships = doc.data().relationships;
        });

        const them = query(usersRef, where("key", "==", req.body.theirKey))

        const querySnapshot = await getDocs(them);
        let theirEmail;
        querySnapshot.forEach((doc) => {
            theirEmail = doc.data().email;
        });

        //search for other users user's key in relationship field
        let rel : any;
        console.log("ABOUT TO FIND")
        console.log(relationships)
        console.log(req.body.theirKey)
        rel = relationships.find(e => e.key === req.body.theirKey);
        console.log(rel)

        let responseCode = 0;
        //if not there
        if(rel == undefined){
            //display "reach out" button (option 1)
            responseCode = 1;
        }
        //if pending, display "waiting for reply" (option 2)
        else if( rel.status == "pending"){
            responseCode = 2;
        }
        //if respond, display button to accept
        else if( rel.status == "respond"){
            responseCode = 3;
        }
        //if friends, display email (for now)
        else if( rel.status == "friends"){
            responseCode = 4;
        }

        res.status(200).json({code: responseCode, email: theirEmail})

    } else {
        res.status(405).end()
    }
}
