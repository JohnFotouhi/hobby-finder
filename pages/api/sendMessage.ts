import firebaseApp from "../../config";
import { collection, doc, getDocs, getFirestore, updateDoc, query, where, orderBy, collectionGroup, addDoc } from "firebase/firestore"; 

const database = getFirestore(firebaseApp);
export default async (req, res) =>{
    if(req.method === 'POST'){
        const messagesCollection = collection(database, "chats", req.body.chatId, "messages");
        const currentDateTime = new Date();

        updateDoc(doc(database, "chats", req.body.chatId), {
            recentMessageSender: req.body.senderName,
            recentMessageText: req.body.text,
            recentMessageTime: currentDateTime
        })

        console.log(currentDateTime);
        const newMessage = {
            text: req.body.text,
            chatId: req.body.chatId,
            senderKey: req.body.senderKey,
            senderName: req.body.senderName,
            time: currentDateTime
        }
        await addDoc(messagesCollection, newMessage);
        res.status(200).json({
            message: newMessage
        })
    }
}