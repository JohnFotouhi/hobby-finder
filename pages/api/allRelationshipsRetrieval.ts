import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore"; 
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import firebaseApp from "../../config";

const database = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

function getPicUrl(ref){
    getDownloadURL(ref).then((url) => {
        return(
            {url: url}
        )
    }).catch((error) => {
        // Can't find picture
        console.log(error);
        console.log("no profile image");
        return(
            {url: "@/public/User_images/jon.jpg"}
        )
    })
}

export default async (req, res) =>{
    const usersRef = collection(database, "users");
    const user = query(usersRef, where("key", "==", req.body.myKey));
    const querySnapshot = await getDocs(user);
    let relationships : any[] = [];
    querySnapshot.forEach((doc) => {
        relationships = doc.data().relationships;
    });

    let friends : any[] = [];
    await Promise.all(relationships.map(async (relationship) => {
        const friend = query(usersRef, where("key", "==", relationship.key));
        const querySnapshot2 = await getDocs(friend);
        querySnapshot2.forEach((doc) => {
            let data = doc.data();
            const imageRef = ref(storage, `Profile Pictures/${data.key}`); 
            let url = getPicUrl(imageRef);
            let friend = {
                name: data.name,
                key: data.key,
                id: data.id,
                status: relationship.status,
                picUrl: url
            }
            friends.push(friend);
        });
    }));
    res.status(200).json({relationships: friends});
}