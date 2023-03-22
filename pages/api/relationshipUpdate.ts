import { collection, doc, getDoc, getDocs, getFirestore, query, where, updateDoc } from "firebase/firestore"; 
import firebaseApp from "../../config";

const database = getFirestore(firebaseApp);

export default async (req, res) =>{
    if(req.method === 'POST'){

        //get other users key

        const usersRef = collection(database, "users");
        const them = query(usersRef, where("key", "==", req.body.theirKey))

        const querySnapshot = await getDocs(them);
        let theirId;
        let theirRels : {key: string, status: string}[] = [];
        let theirEmail;
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            theirRels = doc.data().relationships;
            theirId = doc.id;
            theirEmail = doc.data().email;
        });

        //get my "relationship" map
        
        const user = query(usersRef, where("key", "==", req.body.myKey))

        const querySnapshot2 = await getDocs(user);
        let myRels : {key: string, status: string}[] = [];
        let id;
        querySnapshot2.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            myRels = doc.data().relationships;
            id = doc.id;
        });
       
        const userRef = doc(database, "users", id); 
        const themRef = doc(database, "users", theirId)     

        //search for other users user's key in relationship field
        let rel : any;
        rel = myRels.find(e => e.key === req.body.theirKey);
        console.log(rel)

        let responseCode = 0;
        if(rel == undefined){ //if it's me reaching out
            // update my user's "relationship" field to include {theirKey: pending}
            myRels.push({key: req.body.theirKey, status: "pending"})
            updateDoc(userRef, {relationships: myRels})
        
            //update their user's "relationship" field to include {myKey: respond}
            theirRels.push({key: req.body.myKey, status: "respond"})
            updateDoc(themRef, {relationships: theirRels})
            responseCode = 1;
        }
        else if(rel.status == 'respond'){ //if it's me accepting
            //update both user's "relationship" field to have {key: friends}
            var myInd =  myRels.map((e) => { return e.key; }).indexOf(req.body.theirKey);
            myRels.splice(myInd, 1);
            myRels.push( {key: req.body.theirKey, status: "friends"})
            updateDoc(userRef, {relationships: myRels})

            var theirInd =  theirRels.map((e) => { return e.key; }).indexOf(req.body.myKey);
            theirRels.splice(theirInd, 1);
            theirRels.push( {key: req.body.myKey, status: "friends"})
            updateDoc(themRef, {relationships: theirRels})
            responseCode = 2;
        }

        res.status(200).json({code: responseCode, email: theirEmail})
    }
    else {
        res.status(405).end()
    }
}