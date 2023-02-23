import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore"; 

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
        let docs: any[] = [];
        const querySnapshot = await getDocs(collection(database, "users"));
            querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            docs.push(doc.data());
        });
        res.status(200).json(docs)
    } else {
        res.status(405).end()
    }
}
  