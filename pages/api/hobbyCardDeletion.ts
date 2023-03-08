import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, query, where, deleteDoc } from "firebase/firestore"; 
import firebaseApp from "../../config";

const database = getFirestore(firebaseApp);

type Card = {
    commitMin: number,
    commitMax: number,
    experience: string
    genres: string[]
    info: string
    instrument: string
  }

export default async (req, res) =>{
    if(req.method === 'POST'){

        const usersRef = collection(database, "users");
        const user = query(usersRef, where("key", "==", req.body.uid))

        const querySnapshot = await getDocs(user);
        let userId;
        //get the randomly generated id of the user to use to get hobbies collection
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            userId = doc.id;
        });

        const hobbiesRef = collection(database, "users", userId, "hobbies");
        const matchingCard = query(hobbiesRef, where("instrument", "==", req.body.instrument))

        const querySnapshot2 = await getDocs(matchingCard);
        let cardData;
        querySnapshot2.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            cardData = doc.id;
        });

        await deleteDoc(doc(database, "users", userId, "hobbies", cardData));

        const hobbyCards = await getDocs(collection(database, "users", userId, "hobbies"));
        let cardArray: Card[] = [];
        hobbyCards.forEach((doc) => {
            let newCard: Card = {
                commitMin: doc.data().commitMin,
                commitMax: doc.data().commitMax,
                experience: doc.data().experience,
                genres: doc.data().genres,
                info: doc.data().info,
                instrument: doc.data().instrument
            }
            cardArray.push(newCard);
        });
    
        res.status(200).json(cardArray);

    } else {
        res.status(405).end()
    }
}
