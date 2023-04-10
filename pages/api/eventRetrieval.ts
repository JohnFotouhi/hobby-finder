import { doc, getDoc, getFirestore} from "firebase/firestore"; 
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

  export default async (req, res) => {
    if(req.method === 'POST'){

        const docRef = doc(database, "events", req.body.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            res.status(200).json(docSnap.data())
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }

    } else {     
        res.status(405).end()
    }
  }