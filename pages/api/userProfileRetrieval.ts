import firebaseApp from "../../config";
import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, updateDoc, query, where } from "firebase/firestore"; 

const database = getFirestore(firebaseApp);

type Avail = {
    sm: boolean, sa: boolean, se: boolean, sn: boolean,
    mm: boolean, ma: boolean, me: boolean, mn: boolean,
    tm: boolean, ta: boolean, te: boolean, tn: boolean,
    wm: boolean, wa: boolean, we: boolean, wn: boolean,
    thm: boolean, tha: boolean, the: boolean, thn: boolean,
    fm: boolean, fa: boolean, fe: boolean, fn: boolean,
    stm: boolean, sta: boolean, ste: boolean, stn: boolean,
}

type Profile = {
    name: string
    pronouns: string
    bio: string
    availability: Avail
    host: number
    equipment: string
  }

export default async (req, res) =>{
    if(req.method === 'POST'){
        console.log("getting info")

        let userData: any;

        const usersRef = collection(database, "users");
        const user = query(usersRef, where("key", "==", req.body.uid))

        const querySnapshot = await getDocs(user);
        querySnapshot.forEach((doc) => {               
            userData = (doc.data());
            console.log(userData)               
        });
        

        const existingProfile : Profile = {
            name: userData.name,
            pronouns: userData.pronouns,
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