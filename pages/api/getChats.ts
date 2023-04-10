import firebaseApp from "../../config";
import { collection, doc, getDocs, getFirestore, updateDoc, query, where, orderBy } from "firebase/firestore"; 

const database = getFirestore(firebaseApp);
export default async (req, res) =>{
    if(req.method === 'POST'){
        const chatsRef = collection(database, "chats");
        const chats = query(chatsRef, where("userKeys", "array-contains", req.body.userKey), orderBy("recentMessageTime"));

        const querySnapshot = await getDocs(chats);
        let chatList : any = [];
        querySnapshot.forEach((doc) => {               
            let chatData = (doc.data());
            chatData["id"] = doc.id;
            chatList.push(chatData);         
        });
        res.status(200).json({
            chats: chatList
        })
    }
}