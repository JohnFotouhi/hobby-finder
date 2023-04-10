import { QueryFieldFilterConstraint, collection, collectionGroup, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore"; 
import firebaseApp from "../../config";
import { getAuth } from "firebase/auth";

const auth = getAuth(firebaseApp);
const database = getFirestore(firebaseApp);

type EventCard = {
    eventId: string,
    ownerId: string,
    title: string,
    date: string,
    time: string,
    description: string
  }

export default async (req, res) =>{
    if(req.method === 'POST'){

        let filters = req.body.filters;

        //assemble queries
        let queryList : QueryFieldFilterConstraint[] = [];
        if(filters.dateMin != ""){
            queryList.push(where("Date", ">=", `${filters.dateMin}`))
        }
        if(filters.dateMax != ""){
            queryList.push(where("Date", "<=", `${filters.dateMax}`))
        }
        if(filters.timeMin != ""){
            queryList.push(where("Time", ">=", `${filters.timeMin}`))
        }
        if(filters.timeMax != ""){
            queryList.push(where("Time", "<=", `${filters.timeMax}`))
        }

        const events = query(collection(database, "events"), ...queryList);
        const docs = await getDocs(events);

        let eventCards : EventCard[] = [];
        docs.forEach((e) => {
            let newCard: EventCard = {
                eventId: e.id,
                ownerId: e.data().OwnerId,
                title: e.data().Title,
                date: e.data().Date,
                time: e.data().Time,
                description: e.data().Description
            }
            eventCards.push(newCard);
        })

        res.status(200).json(eventCards)
        
    } else {
        res.status(405).end()
    }
}

