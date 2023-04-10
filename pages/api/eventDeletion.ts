import { collection, doc, getDocs, getFirestore, query, where, deleteDoc } from "firebase/firestore"; 
import firebaseApp from "../../config";

const database = getFirestore(firebaseApp);

export default async (req, res) =>{
    if(req.method === 'POST'){

        await deleteDoc(doc(database, "events", req.body.id));
        
        res.status(200).json("");

    } else {
        res.status(405).end()
    }
}
