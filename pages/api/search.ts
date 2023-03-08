import Filters from "../../components/filters";
import { collection, collectionGroup, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore"; 
import firebaseApp from "../../config";
import { getAuth } from "firebase/auth";

const auth = getAuth(firebaseApp);
console.log(auth);
const database = getFirestore(firebaseApp);

export default async (req, res) =>{
    function stringifyObject(array){
        let stringArray = array.map(function(item){
            return item.name
        });
        return stringArray;
    }

    console.log(req.body.filters);
    if(req.method === 'POST'){
        const hobbyCards = query(collectionGroup(database, "hobbies"), where('instrument', '==', `${req.body.search}`));
        let filters = req.body.filters;        
        let queryList = [ where('instrument', '==', `${req.body.search}`) ];
        if(filters.experienceLevels.length !== 0) queryList.push(where("experience", "in", stringifyObject(filters.experienceLevels)));
        if(filters.genres.length !== 0) queryList.push(where("genres", "array-contains-any", stringifyObject(filters.genres)));
        if(filters.commitMax > 0) queryList.push( where("commitMax", "<=", filters.commitMax));
        if(filters.commitMin > 0) queryList.push( where("commitMin", ">=", filters.commitMin));
        //const hobbyCards = query(collectionGroup(database, "instruments"), ...queryList);

        const docs = await getDocs(hobbyCards);
        let instruments: any[] = [];
        let userDocuments: any[] = [];
        docs.forEach((doc) => {
            console.log("HI");
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
        console.log(users);
        res.status(200).json(users)
    } else {
        res.status(405).end()
    }
}
  