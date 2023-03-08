import firebaseApp from "@/config";
import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore"; 

const database = getFirestore(firebaseApp);

type Profile = {
    name: string
    bio: string
    availability: {}
    host: number
    equipment: string
  }

export default async (req, res) => {
    if(req.method === 'POST'){
    
        console.log(req);

        const uid = req.body.uid;
        const newName = req.body.name;
        const newBio = req.body.bio;
        const newAvailability = req.body.availability;
        const newHost = req.body.host;
        const newEquipment = req.body.equipment;


        let userData: any;

        const userRef = collection(database, "users")

        const querySnapshot = await getDocs(collection(database, "users"));
        querySnapshot.forEach((doc) => {
                //if user id is our user's ID
                if(doc.id == uid){
                    userData = (doc.data());
                }
        });
        //res.status(200).json("userData")

        updateDoc(doc(userRef, uid), {name: newName});
        updateDoc(doc(userRef, uid), {bio: newBio});
        updateDoc(doc(userRef, uid), {equipment: newEquipment});
        updateDoc(doc(userRef, uid), {availability: {}});
        updateDoc(doc(userRef, uid), {host: newHost});


        const freshProfile : Profile = {
            name: newName,
            bio: newBio,
            availability: newAvailability,
            host: newHost,
            equipment: newEquipment
        }

        console.log(freshProfile);

        res.status(200).json(freshProfile);

    } else {
        res.status(405).end()
    }
}