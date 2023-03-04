import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore"; 
import firebaseApp from "@/config";

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
        const uid = req.body.uid;

        let userData: any;
        //LATER: database should be wherever our collection of users is
        const userRef = collection(database, "users")

        const querySnapshot = await getDocs(collection(database, "users"));
        querySnapshot.forEach((doc) => {
                //if user id is our user's ID
                if(doc.id == uid){
                    userData = (doc.data());
                }
        });
        //res.status(200).json("userData")
        var cards : Array<any> = userData.hobbyCards;
        if(cards == undefined){
            cards = [];
        }

        //console.log(cards);

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
        
        //catch if trying to make new card with duplicate instrument
        let duplicate = false;
        let trouble = false;
        if(cards.length >= 1) {
            console.log("HERE 0")
            cards.forEach(async (card, index) => {
                console.log(card.instrument)
                console.log(req.body.instrumemt)
                if(card.instrument == req.body.instrument.label){
                    console.log("HERE 1")
                    if(newCard){
                        duplicate = true;
                        trouble = true;
                    }
                    else { //we are editing an existing card and found the one with the matching instrument
                        //replace array w updated card
                        console.log("HERE 2")
                        cards[index] = freshCard;
                        console.log(freshCard);
                        updateDoc(doc(userRef, uid), {hobbyCards: cards});
                        console.log("SHOULD HAVE JUST UPDATED");
                    }
                }        
            });
        }
       
        //if we're making a new card and have passed duplicate check
        if(newCard && !duplicate){           
            //add new card to existing array
            cards.push(freshCard);
            
            //update field with new array
            updateDoc(doc(userRef, uid), {hobbyCards: cards});
        }
        
        if(trouble){
            res.status(409).json("ERROR: duplicate");
        }
        else{
            res.status(200).json(cards);
        }

    } else {
        res.status(405).end()
    }
}