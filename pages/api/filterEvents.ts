import { collection, collectionGroup, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore"; 
import firebaseApp from "../../config";
import { getAuth } from "firebase/auth";

const auth = getAuth(firebaseApp);
const database = getFirestore(firebaseApp);

export default async (req, res) =>{
    if(req.method === 'POST'){

        let filters = req.body.filters;

        

        res.status(200).json()
    } else {
        res.status(405).end()
    }
}

