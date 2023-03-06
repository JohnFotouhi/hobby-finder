import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, query, where } from "firebase/firestore"; 

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
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            userId = doc.id;
        });

        console.log(userId);

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


        console.log(cardArray);

        res.status(200).json(cardArray)
        
    } else {
        res.status(405).end()
    }
}