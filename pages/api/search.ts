import { initializeApp } from "firebase/app";
import { collection, collectionGroup, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore"; 

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
        console.log(req.body.filters);
        const hobbyCards = query(collectionGroup(database, "instruments"), where('instrument', '==', `${req.body.search}`));
        const docs = await getDocs(hobbyCards);
        let instruments: any[] = [];
        let userDocuments: any[] = [];
        docs.forEach((doc) => {
            let ref = doc.ref.parent.parent;
            let userId = doc.ref.parent.parent?.id;
            let instrument = doc.data();
            instrument['userId'] = userId;
            instruments.push(instrument);
            if(ref !== null){
                userDocuments.push(getDoc(ref));
            }
            
        });
        const docList = await Promise.all(userDocuments);
        let users: any[] = [];
        docList.forEach((doc) => {
            let userData = doc.data();
            let userId = doc.id;
            let userInstruments = instruments.filter(instrument => instrument.userId === userId);
            let user = doc.data();
            user["instruments"] = userInstruments;
            users.push(user);
        })
        res.status(200).json(users)
    } else {
        res.status(405).end()
    }
}
  