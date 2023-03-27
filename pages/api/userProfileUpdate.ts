import firebaseApp from "../../config";
import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, updateDoc, query, where } from "firebase/firestore"; 

const database = getFirestore(firebaseApp);

type Profile = {
    name: string
    pronouns: string
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
        const newPronouns = req.body.pronouns.label;
        const newBio = req.body.bio;
        const newAvailability = req.body.availability;
        const newHost = req.body.host;
        const newEquipment = req.body.equipment;


        let userData: any;

        const usersRef = collection(database, "users");
        const user = query(usersRef, where("key", "==", req.body.uid))

        const querySnapshot = await getDocs(user);
        let id;
        querySnapshot.forEach((doc) => {               
            userData = (doc.data());
            id = doc.id;
        });

        const userRef = doc(database, "users", id);

        if( newName != undefined ) { updateDoc(userRef, {name: newName}); }
        if( newPronouns != undefined ) { updateDoc(userRef, {pronouns: newPronouns}); }
        if( newBio != undefined ) { updateDoc(userRef, {bio: newBio}); }
        if( newEquipment != undefined ) { updateDoc(userRef, {equipment: newEquipment}); }
        if( newAvailability != undefined ) { updateDoc(userRef, {availability: {}}); }
        if( newHost != undefined ) { updateDoc(userRef, {host: newHost}); }


        const freshProfile : Profile = {
            name: newName,
            pronouns: newPronouns,
            bio: newBio,
            availability: newAvailability,
            host: newHost,
            equipment: newEquipment
        }

        console.log("FRESH PROFILE:")
        console.log(freshProfile);

        res.status(200).json(freshProfile);

    } else {
        res.status(405).end()
    }
}