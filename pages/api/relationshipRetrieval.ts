import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore"; 
import firebaseApp from "../../config";

const database = getFirestore(firebaseApp);

export default async (req, res) =>{
    if(req.method === 'POST'){
        
        const usersRef = collection(database, "users");

        //get other users key
        const themRef = doc(database, "users", req.body.theirId)
        const docSnap = await getDoc(themRef);
        let themKey;
        if (docSnap.exists()) {
            themKey = docSnap.data().key;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }

        //get my "relationship" map
        const user = query(usersRef, where("key", "==", req.body.myId))

        const querySnapshot2 = await getDocs(user);
        let relationships : {key: string, status: string}[] = [];
        querySnapshot2.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            relationships = doc.data().relationships;
        });

        //search for other users user's key in relationship field
        let rel : any;
        console.log("ABOUT TO FIND")
        rel = relationships.find(e => e.key === themKey);

        let responseCode = 0;
        //if not there
        if(rel == undefined){
            //display "reach out" button (option 1)
            responseCode = 1;
        }
        //if pending, display "waiting for reply" (option 2)
        else if( rel.status = "pending"){
            responseCode = 2;
        }
        //if respond, display button to accept
        else if( rel.status = "respond"){
            responseCode = 3;
        }
        //if friends, display email (for now)
        else if( rel.status = "friends"){
            responseCode = 4;
            //TO DO: get users email
        }

        res.status(200).json(responseCode)

    } else {
        res.status(405).end()
    }
}
