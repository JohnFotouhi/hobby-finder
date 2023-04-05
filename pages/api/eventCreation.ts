import { collection, doc, getDocs, getFirestore, updateDoc, query, where, addDoc } from "firebase/firestore"; 
import firebaseApp from "../../config";

const database = getFirestore(firebaseApp);

type Event = {
    Attendees: [],
    Title: string,
    Description: string,
    Date: string,
    Time: string,
    Location: string,
    OwnerName: string,
    OwnerId: string
  }

  type EventCard = {
    eventId: string,
    ownerId: string,
    title: string,
    date: string,
    time: string,
    description: string
  }

  export default async (req, res) => {
    if(req.method === 'POST'){

        console.log(req.body)

        const usersRef = collection(database, "users");
        const user = query(usersRef, where("key", "==", req.body.ownerId))

        const querySnapshot = await getDocs(user);
        let userName;
        //get the randomly generated id of the user to use to get hobbies collection
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            userName = doc.data().name;
        });

        const newEvent : Event = {
            Attendees: [],
            Title: req.body.title,
            Description: req.body.description,
            Date: req.body.date,
            Time: req.body.time,
            Location: req.body.location,
            OwnerName: userName,
            OwnerId: req.body.ownerId
        };

        const docRef = await addDoc(collection(database, "events"), newEvent);
        console.log("Document written with ID: ", docRef.id);

        const eventCards = await getDocs(collection(database, "events"));
            let eventArray: EventCard[] = [];
            eventCards.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                let newCard: EventCard = {
                    eventId: doc.id,
                    ownerId: doc.data().OwnerId,
                    title: doc.data().Title,
                    date: doc.data().Date,
                    time: doc.data().Time,
                    description: doc.data().Description
                }
                eventArray.push(newCard);
            });
            res.status(200).json(eventArray);

    } else {     
        res.status(405).end()
    }
  }