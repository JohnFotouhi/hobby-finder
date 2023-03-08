import { collection, doc, getDocs, getFirestore, query, where, setDoc, updateDoc, GeoPoint } from "firebase/firestore"; 
import firebaseApp from "../../config";
import { useGeolocated } from "react-geolocated";

//help from https://dev.to/dhruv09d/know-your-users-location-in-react-ts-fd6
const database = getFirestore(firebaseApp);

export default async (req, res) =>{
    if(req.method === 'POST'){


        if (!!req.body.lat) {
            const usersRef = collection(database, "users");
            const user = query(usersRef, where("key", "==", req.body.uid))

            const querySnapshot = await getDocs(user);
            let userId;
            //get the randomly generated id of the user
            querySnapshot.forEach((doc) => {
                userId = doc.id;
            });

            const userRef = doc(database, "users", userId);

            //await setDoc(userRef, {location: coords} )
            await updateDoc(userRef, {location: new GeoPoint(req.body.lat, req.body.long)})
        }

        res.status(200).json();

    } else {
        res.status(405).end()
    }
}