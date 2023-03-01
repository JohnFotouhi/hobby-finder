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