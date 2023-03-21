import { collection, doc, getDoc, getDocs, getFirestore, query, where, updateDoc } from "firebase/firestore"; 
import firebaseApp from "../../config";

const database = getFirestore(firebaseApp);

export default async (req, res) =>{
    if(req.method === 'POST'){

        //get other users key
        const themRef = doc(database, "users", req.body.theirId)
        const docSnap = await getDoc(themRef);
        let themKey;
        let theirRels;
        if (docSnap.exists()) {
            themKey = docSnap.data().key;
            theirRels = docSnap.data().relationships;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }

        //get my "relationship" map
        const usersRef = collection(database, "users");
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

        //search for other users user's key in relationship field
        let rel : any;
        console.log("ABOUT TO FIND")
        rel = myRels.find(e => e.key === themKey);

        if(rel == undefined){ //if it's me reaching out
            // update my user's "relationship" field to include {theirKey: pending}
            myRels.push({key: themKey, status: "pending"})
            updateDoc(userRef, {relationships: myRels})
        
            //update their user's "relationship" field to include {myKey: respond}
            theirRels.push({key: req.body.myKey, status: "respond"})
            updateDoc(themRef, {relationships: theirRels})
        }
        else{ //if it's me accepting
            //update both user's "relationship" field to have {key: friends}
            var myInd =  myRels.map((e) => { return e.key; }).indexOf(themKey);
            myRels.splice(myInd, 1);
            myRels.push( {key: themKey, status: "friends"})
            updateDoc(userRef, {relationships: myRels})

            var theirInd =  theirRels.map((e) => { return e.key; }).indexOf(req.body.myKey);
            theirRels.splice(theirInd, 1);
            theirRels.push( {key: req.body.myKey, status: "friends"})
            updateDoc(themRef, {relationships: theirRels})
        }

        res.status(200).json()
    }
    else {
        res.status(405).end()
    }
}