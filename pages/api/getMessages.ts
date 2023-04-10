import firebaseApp from "../../config";
import { collection, doc, getDocs, getFirestore, updateDoc, query, where, orderBy, collectionGroup } from "firebase/firestore"; 

const database = getFirestore(firebaseApp);
export default async (req, res) =>{
    if(req.method === 'POST'){
        const messagesRef = collectionGroup(database, "messages");
        console.log(req.body.chatId);
        const messages = query(messagesRef, where("chatId", "==", req.body.chatId), orderBy("time"));

        const querySnapshot = await getDocs(messages);
        console.log(querySnapshot.size);
        let messageList : any = [];
        querySnapshot.forEach((doc) => {               
            let messageData = (doc.data());
            console.log(messageData);      
            messageList.push(messageData);         
        });
        res.status(200).json({
            messages: messageList,
        })
    }
}