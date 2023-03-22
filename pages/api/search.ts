import { collection, collectionGroup, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore"; 
import firebaseApp from "../../config";
import { getAuth } from "firebase/auth";
import { experienceList } from "@/lists";

const auth = getAuth(firebaseApp);
const database = getFirestore(firebaseApp);

export default async (req, res) =>{
    function stringifyObject(array){
        let stringArray = array.map(function(item){
            return item.name
        });
        return stringArray;
    }

    function deg2rad(deg){ // Convert Degrees to Radians
        return deg * (Math.PI/180);
    }
    function calculateDistance(lat1, long1, lat2, long2){ // Calculate distance in kilometers between points
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);
        var dLon = deg2rad(long2-long1); 
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
            ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
    }
    console.log(req.body.filters);
    if(req.method === 'POST'){
        let filters = req.body.filters;
        let myCoords = req.body.coordinates;
        let myKey = req.body.uid;        
        let queryList = [ where('instrument', '==', `${req.body.search}`) ];
        if(filters.genres.length !== 0){
            queryList.push(where("genres", "array-contains-any", stringifyObject(filters.genres)));
        } 
        else if(filters.experienceLevels.length !== 0){
            queryList.push(where("experience", "in", stringifyObject(filters.experienceLevels)));
        }
        const hobbyCards = query(collectionGroup(database, "hobbies"), ...queryList);

        const docs = await getDocs(hobbyCards);
        let instruments: any[] = [];
        let userDocuments: any[] = [];
        docs.forEach((doc) => {
            let instrument = doc.data();
            console.log(instrument);
            let experienceLevelStrings = stringifyObject(filters.experienceLevels);
            if(experienceLevelStrings.indexOf(instrument.experience) > -1 || filters.genres.length === 0 || filters.experienceLevels.length === 0){
                if(instrument.commitMax >= filters.commitMin && (filters.commitMax === 0 || instrument.commitMin <= filters.commitMax)){
                    let ref = doc.ref.parent.parent;
                    let userId = doc.ref.parent.parent?.id;
                    instrument['userId'] = userId;
                    instruments.push(instrument);
                    if(ref !== null){
                        userDocuments.push(getDoc(ref));
                    }
                }
            }
        });
        const docList = await Promise.all(userDocuments);
        let users: any[] = [];
        docList.forEach((doc) => {
            let userData = doc.data();
            let distance = calculateDistance(userData.location.latitude, userData.location.longitude, myCoords.latitude, myCoords.longitude);
            console.log(distance);
            if(distance < filters.distance && userData.key !== myKey){
                let userId = doc.id;
                let userInstruments = instruments.filter(instrument => instrument.userId === userId);
                let user = doc.data();
                user["instruments"] = userInstruments;
                users.push(user);
            }
        })
        res.status(200).json(users)
    } else {
        res.status(405).end()
    }
}
  