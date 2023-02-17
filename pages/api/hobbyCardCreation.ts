import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore"; 

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
        let docs: any;
        const querySnapshot = await getDocs(collection(database, "test"));
            querySnapshot.forEach((doc) => {
                //if user id is our user's ID
                if(doc.id == "FakeUser"){
                    console.log(`${doc.id} => ${doc.data()}`);
                    docs = (doc.data());
                }
        });
        res.status(200).json(docs)
        var cards : Array<any> = docs.hobbyCards;
        console.log(`cards: ${cards}`);
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