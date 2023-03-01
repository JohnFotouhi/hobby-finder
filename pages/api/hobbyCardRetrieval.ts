import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore"; 
import firebaseApp from "@/config";

const database = getFirestore(firebaseApp);

export default async (req, res) =>{
    if(req.method === 'POST'){

        let userData: any;

        const querySnapshot = await getDocs(collection(database, "users"));
        querySnapshot.forEach((doc) => {
                //if user id is our user's ID
                if(doc.id == req.body.uid){
                    userData = (doc.data());
                }
        });
        res.status(200).json(userData.hobbyCards)
        
    } else {
        res.status(405).end()
    }
}