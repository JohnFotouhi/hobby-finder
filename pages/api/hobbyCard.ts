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

type Data = {
    instrument: string
    genre: string[]
    commitment: string
    info: string
    audio: any
  }

async function writeData(Instrument, Genre, Commitment, Info, Audio){
    try{
        // later change from test to hobby card. Also, are IDs implicit part of the table?
        const docRef = await addDoc(collection(database, 'test'), {
        instrument: Instrument,
        genre: Genre,
        commitment: Commitment,
        info: Info,
        audio: Audio
        });
        console.log(docRef.id);
    }catch(e){
        console.error("Error adding document: ", e);
    }
}