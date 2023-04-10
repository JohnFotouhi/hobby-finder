import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, updateDoc, query, where, addDoc } from "firebase/firestore"; 
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

export default async (req, res) => {
    if(req.method === 'POST'){
        
        const newCard = req.body.newCard;

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

        //make array of genre strings
        let genreStrings : string[] = [];
        console.log(req.body)
        req.body.genres.forEach((genre) => {
            genreStrings.push(genre.label);
        });

        //hobby card for db with new inputs
        const freshCard : Card = {
            commitMin: +req.body.commitMin,
            commitMax: +req.body.commitMax,
            experience: req.body.experience.label,
            genres: genreStrings,
            info:req.body.info,
            instrument: req.body.instrument.label
        };

        const existingCard = query(hobbiesRef, where("instrument", "==", req.body.instrument.label))      
        let duplicate = false;
        const querySnapshot2 = await getDocs(existingCard);

        //if its not a new card, update doc where its a matching instrument
        if(!newCard){       
            let cardId;
            querySnapshot2.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                cardId = doc.id;
            });
            updateDoc(doc(hobbiesRef, cardId), freshCard);
        }
        else{//if new card, add Doc
            querySnapshot2.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                duplicate = true;
            });
            if(!duplicate){
                const docRef = await addDoc(collection(database, "users", userId, "hobbies"), freshCard);
                console.log("Document written with ID: ", docRef.id);
            }
        }
    
        if(duplicate){
            res.status(409).json("ERROR: duplicate");
        }
        else{
            const hobbyCards = await getDocs(collection(database, "users", userId, "hobbies"));
            let cardArray: Card[] = [];
            hobbyCards.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
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
        }
    } else {
        res.status(405).end()
    }
}