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
        var cards : Array<any> = userData.hobbyCards;

        //console.log(cards); //successfully gets array of hobbyCards from db

        //find index of hobby card with matching instrument
        let deleteIndex;
        cards.forEach(async (card, index) => {
            if(card.instrument == req.body.instrument){
                deleteIndex = index;
            }        
        });

        //delete card from existing array
        cards.splice(deleteIndex, 1);
        const userRef = collection(database, "users")

        //update field with new array
        updateDoc(doc(userRef, req.body.uid), {hobbyCards: cards});
        res.status(200).json(cards);
    } else {
        res.status(405).end()
    }
}
