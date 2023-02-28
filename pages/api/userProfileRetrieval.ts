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

type Profile = {
    name: string
    bio: string
    availability: {}
    host: number
    equipment: string
  }

export default async (req, res) =>{
    if(req.method === 'POST'){
        console.log("getting info")

        let userData: any;

        const querySnapshot = await getDocs(collection(database, "users"));
        querySnapshot.forEach((doc) => {
                //if user id is our user's ID
                console.log("id time")
                console.log(doc.id)
                if(doc.id == req.body.uid){
                    userData = (doc.data());
                }
        });
        

        const existingProfile : Profile = {
            name: userData.name,
            bio: userData.bio,
            availability: userData.availability,
            host: userData.host,
            equipment: userData.equipment
        }

        res.status(200).json(existingProfile)
        
    } else {
        res.status(405).end()
    }
}