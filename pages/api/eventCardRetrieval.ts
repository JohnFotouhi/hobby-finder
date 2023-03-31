import { collection, doc, getDocs, getFirestore, query, where } from "firebase/firestore"; 
import firebaseApp from "../../config";

const database = getFirestore(firebaseApp);

type EventCard = {
    eventId: string,
    ownerId: string,
    title: string,
    description: string
  }

  export default async (req, res) =>{
    if(req.method === 'POST'){

        const eventsRef = collection(database, "events");

        const querySnapshot = await getDocs(eventsRef);
        let cardArray : EventCard[] = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            let newCard: EventCard = {
                eventId: doc.id,
                ownerId: doc.data().OwnerId,
                title: doc.data().Title,
                description: doc.data().Description
            }
            cardArray.push(newCard);
        });

        res.status(200).json(cardArray);
    }
    else{
        res.status(405).end();
    }
}