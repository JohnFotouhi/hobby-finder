import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore"; 

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

export default async (req, res) =>{
    if(req.method === 'POST'){
        
        let userData: any;

        const querySnapshot = await getDocs(collection(database, "users"));
        querySnapshot.forEach((doc) => {
                //if user id is our user's ID
                if(doc.id == req.body.uid){
                    userData = (doc.data());
                }
        });
        res.status(200).json(userData)
        var cards : Array<any> = userData.hobbyCards;

        //console.log(cards); //successfully gets array of hobbyCards from db

        //find index of hobby card with matching instrument
        let deleteIndex;
        cards.forEach(async (card, index) => {
            if(card.instrument == req.body.instrument){
                deleteIndex = index;
            }        
        });

        //delete card from existing array
        cards.splice(deleteIndex, 1);
        const userRef = collection(database, "users")

        //update field with new array
        updateDoc(doc(userRef, req.body.uid), {hobbyCards: cards});
    } else {
        res.status(405).end()
    }
}