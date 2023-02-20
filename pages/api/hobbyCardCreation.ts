import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, setDoc } from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyANQhKbnHwzW2SHI-GTPz3rH0X7InikKDo",
    authDomain: "jamin-9ed6a.firebaseapp.com",
    databaseURL: "https://jamin-9ed6a-default-rtdb.firebaseio.com",
    projectId: "jamin-9ed6a",
    storageBucket: "jamin-9ed6a.appspot.com",
    messagingSenderId: "950884082294",
    appId: "1:950884082294:web:40d61d4452f007c2f07557",
    measurementId: "G-4HTBFDYZ1C"
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

type Card = {
    commitment: string
    experience: string
    genre: string[]
    info: string
    instrument: string
  }

export default async (req, res) =>{
    if(req.method === 'POST'){
        //console.log(req.body); // successfully retrieves data from API call
        //console.log(req.body.data.genres.at(0)); //For some reason, genres comes wrapped in an additional array??
        
        let userData: any;
        //LATER: database should be wherever our collection of users is
        const querySnapshot = await getDocs(collection(database, "test"));
        querySnapshot.forEach((doc) => {
                //if user id is our user's ID
                if(doc.id == "FakeUser"){
                    userData = (doc.data());
                }
        });
        res.status(200).json("userData")
        var cards : Array<any> = userData.hobbyCards;

        //console.log(cards); //successfully gets array of hobbyCards from db
        //console.log(cards.at(0).instrument)
        
        //catch if trying to make new card with duplicate instrument
        const newInstrument = req.body.data.instrument.label;
        let duplicate = false;
        cards.forEach(async (card) => {
            if(card.instrument == newInstrument){
                duplicate = true;
                res.status(409).end()
            }        
        });

        if(!duplicate){
            //make array of genre strings
            let genreStrings : string[] = [];
            req.body.data.genres.at(0).forEach((genre) => {
                genreStrings.push(genre.name);
            });

            //new hobby card for db
            const newCard : Card = {
                commitment: req.body.data.commitment.label,
                experience: req.body.data.experience.label,
                genre: genreStrings,
                info:req.body.data.info,
                instrument: req.body.data.instrument.label
            };

            //add new card to existing array
            cards.push(newCard);
            const testRef = collection(database, "test")
            
            //update field with new array
            setDoc(doc(testRef, "FakeUser"), {hobbyCards: cards});
        }
    } else {
        res.status(405).end()
    }
}

// async function writeData(Instrument, Genre, Commitment, Info, Audio){
//     try{
//         // later change from test to hobby card. Also, are IDs implicit part of the table?
//         const docRef = await addDoc(collection(database, 'test/'), {
//         hobbyCard: [{
//         instrument: Instrument,
//         genre: Genre,
//         commitment: Commitment,
//         info: Info,
//         audio: Audio
//         }]
//         });
//         console.log(docRef.id);
//     }catch(e){
//         console.error("Error adding document: ", e);
//     }
// }