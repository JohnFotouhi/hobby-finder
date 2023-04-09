import { collection, doc, getDoc, getFirestore, updateDoc, query, where, getDocs } from "firebase/firestore"; 
import firebaseApp from "../../config";
import { stringify } from "querystring";

const database = getFirestore(firebaseApp);

//is given:
//event id
//user id (key)
//attending (true if adding, false if removing)

export default async (req, res) => {
    if(req.method === 'POST'){

        const docRef = doc(database, "events", req.body.eventId);
        const docSnap = await getDoc(docRef);

        type Attendee = {
            id: string,
            name: string
        }

        let attendees: Attendee[] = [];
        if (docSnap.exists()) {
            attendees = docSnap.data().Attendees;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }

        if(req.body.attending){ //being added to list
            const usersRef = collection(database, "users");
            const user = query(usersRef, where("key", "==", req.body.uid))

            const querySnapshot = await getDocs(user);
            let userName;
            querySnapshot.forEach((doc) => {               
                userName = (doc.data().name);
            });

            const newAttendee = {id: req.body.uid, name: userName}
            attendees.push(newAttendee);
        }
        else{ //being remove from list
            const i =  attendees.map((e) => { return e.id; }).indexOf(req.body.uid); 
            if(i != undefined){
                attendees.splice(i, 1);
            }
        }

        updateDoc(docRef, {Attendees: attendees});

        res.status(200).json(attendees)

    } else {     
        res.status(405).end()
    }
  }