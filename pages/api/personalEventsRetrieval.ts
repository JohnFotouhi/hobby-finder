import { collection, collectionGroup, doc, getDocs, getFirestore, query, where } from "firebase/firestore"; 
import firebaseApp from "../../config";

const database = getFirestore(firebaseApp);

type EventCard = {
    eventId: string,
    ownerId: string,
    title: string,
    date: string,
    time: string,
    description: string
  }

type Attendee = {
    id: string,
    name: string
}

  export default async (req, res) =>{
    if(req.method === 'POST'){

        const usersRef = collection(database, "users");
        const user = query(usersRef, where("key", "==", req.body.uid))

        const querySnapshot = await getDocs(user);
        let userName;
        querySnapshot.forEach((doc) => {
            userName = doc.data().name;
        });

        const attendee = {id: req.body.uid, name: userName}

        const collRef = collection(database, "events");
        //let q1 = where("Attendees", "array-contains", `${attendee}`);
        let q2 = where("Date", ">=", `${req.body.today}`)
        // let queryList = [q1, q2];

        //const eventsRef = query(collRef, ...queryList);
        const eventsRef = query(collRef, q2);

        const querySnapshot2 = await getDocs(eventsRef);
        let cardArray : EventCard[] = [];

        querySnapshot2.forEach((doc) => {
            let included = doc.data().Attendees.some(el => el.id === req.body.uid);
            if(included){
                let newCard: EventCard = {
                    eventId: doc.id,
                    ownerId: doc.data().OwnerId,
                    title: doc.data().Title,
                    date: doc.data().Date,
                    time: doc.data().Time,
                    description: doc.data().Description
                }
                cardArray.push(newCard);
            }
        });

        console.log(cardArray)
        res.status(200).json(cardArray);
    }
    else{
        res.status(405).end();
    }
}