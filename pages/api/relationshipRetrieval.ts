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

        let status = "";
        if(typeof(rel) == "undefined"){
            status = "none";
        }
        else{
            status = rel.status;
        }

        res.status(200).json({status: status, email: theirEmail})

    } else {
        res.status(405).end()
    }
}
