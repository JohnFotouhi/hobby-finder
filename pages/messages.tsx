import FullPageLoader from "@/components/FullPageLoader"
import { withAuthUser, AuthAction, useAuthUser } from "next-firebase-auth"
import { useEffect, useRef, useState } from "react";
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Avatar, Conversation, ConversationHeader, ConversationList, EllipsisButton, MessageSeparator, Search, Sidebar, TypingIndicator, VideoCallButton, VoiceCallButton } from '@chatscope/chat-ui-kit-react';
import pic from "@/public/User_images/jon.jpg";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import { collection, collectionGroup, getDocs, getFirestore, onSnapshot, orderBy, query, where } from "firebase/firestore";
import firebaseApp from "@/config";
import { getDownloadURL, getStorage, ref} from "firebase/storage";
import { BsPersonCircle } from "react-icons/bs";

const Messages = () => {
    const AuthUser = useAuthUser();
    const exampleIcon = pic.src;
    const router = useRouter();
    const [messages, setMessages] = useState<any>([]);
    const [chats, setChats] = useState<any>([]);
    const [filteredChats, setFilteredChats] = useState<any>([]);
    const [messageInputValue, setMessageInputValue] = useState("");
    const [chatId, setChatId] = useState("");
    const [nameOfRecipient, setNameOfRecipient] = useState("");
    const [chatSearch, setChatSearch] = useState("");
    const [imageRef, setImageRef] = useState("");
    const target = useRef(null);
    const storage = getStorage(firebaseApp);

    function sendMessage(){
        fetch("/api/sendMessage", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                text: messageInputValue,
                chatId: chatId,
                senderKey: AuthUser.id,
                senderName: AuthUser.displayName,
            })
        })
            .then((res) => res.json())
            .then((data) => {
                setMessageInputValue("");
            });
    }

    function onResolve(foundURL) {
        console.log('FOUND IMAGE')
        setImageRef(foundURL)
    }
    
    function onReject(error) {
        console.log(error.code);
    }

    async function openChat(chatId, theirName){
        await router.push({
            pathname: "/messages",
            query: {chatId: chatId, name: theirName}
        });
        setChatId(chatId);
    }

    useEffect(() => {
        if(chatSearch === ""){
            setFilteredChats(chats);
        }
        else{
            let lowerCaseSearch = chatSearch.toLowerCase();
            let newFilteredChats = chats.filter(chat => chat.users[0].name.toLowerCase().includes(lowerCaseSearch) && chat.users[0].key !== AuthUser.id || chat.users[1].name.toLowerCase().includes(lowerCaseSearch) && chat.users[1].key !== AuthUser.id);
            setFilteredChats(newFilteredChats);
        }
    }, [chatSearch, chats])

    useEffect(() => {
        // Get list of user's chats
            const database = getFirestore(firebaseApp);
            const chatsRef = collection(database, "chats");
            const chats = query(chatsRef, where("userKeys", "array-contains", AuthUser.id), orderBy("recentMessageTime"));
            const unsubscribe = onSnapshot(chats, (snapshot) => {
                let newChats : any[] = [];
                snapshot.forEach(doc => {
                    let chatData = (doc.data());
                    chatData["id"] = doc.id;
                    newChats.push(chatData);
                });
                setChats(newChats);
            })

            const imageRef = ref(storage, `Profile Pictures/${AuthUser.id}`); 
            if(imageRef != undefined){
                getDownloadURL(imageRef).then(onResolve, onReject);          
            }
            return unsubscribe;
    }, []);

    useEffect(() => {
        // This is triggered on load and when the user clicks on a chat and changes the messages to be shown in the main window
        const params = new URLSearchParams(window.location.search);
        let newChatId = params.get('chatId');
        if(newChatId === null) newChatId = "";
        setChatId(newChatId);
        let newName = params.get('name');
        if(newName === null) newName = "";
        setNameOfRecipient(newName);
        // Get list of messages for the chat that is currently opened (if any)
        if(typeof(newChatId) !== "undefined"){
            const database = getFirestore(firebaseApp);
            const messagesRef = collectionGroup(database, "messages");
            const messageQuery = query(messagesRef, where("chatId", "==", chatId), orderBy("time"));
            setMessages(messages);
            let unsubscribe = onSnapshot(messageQuery, (snapshot) => {
                let newMessages : any[] = [];
                snapshot.forEach(doc => {
                    let messageData = doc.data();
                    newMessages.push(messageData);
                });
                setMessages(newMessages);
            });
            return unsubscribe;
        }

    }, [chatId]);

    return(
        <div style={{ position:"relative", height: "500px" }} >
        <MainContainer responsive>                
              <Sidebar position="left" scrollable={true}>
                <Search placeholder="Search..." value={chatSearch} onChange={setChatSearch}/>
                <ConversationList>
                    {
                        filteredChats.map((chat, i) => (
                            <Conversation key={"conversation" + i} name={chat.users[0].key === AuthUser.id ? chat.users[1].name : chat.users[0].name} lastSenderName={chat.recentMessageSender} info={chat.recentMessageText} onClick={() => {openChat(chat.id, chat.users[0].key === AuthUser.id ? chat.users[1].name : chat.users[0].name)}}>
                                <Avatar key={"chatImage" + i} src={exampleIcon} name="Lilly" />
                            </Conversation>
                        ))
                    }                                                                         
                </ConversationList>
              </Sidebar>
              
              <ChatContainer>
                <ConversationHeader>
                  <ConversationHeader.Back />
                  {chatId !== "" && <Avatar src={exampleIcon} name={nameOfRecipient} />}
                  {chatId === "" && <Avatar src={exampleIcon} name={nameOfRecipient} />}
                  <ConversationHeader.Content userName={nameOfRecipient} info="" />
                  <ConversationHeader.Actions>
                    {/* <EllipsisButton orientation="vertical" /> */}
                    {chatId !== "" && <Button onClick={() => {router.push({pathname: "/user", query: {uid: AuthUser.id}})}}>Visit Profile</Button> }
                  </ConversationHeader.Actions>          
                </ConversationHeader>
                <MessageList>
                    {
                        messages.map((message, i) => (
                            <>
                            <Message key={"message" + i} model={{
                                message: message.text,
                                sentTime: "2 mins ago",
                                sender: message.senderName,
                                direction: message.senderKey === AuthUser.id ? "outgoing" : "incoming",
                                position: "single"
                            }} avatarSpacer>
                                {message.senderKey !== AuthUser.id && <Avatar key={"messageImage" + i} src={exampleIcon} name="Zoe" />}
                            </Message> 
                            </>
                        ))
                    }
                </MessageList>
                <MessageInput autoFocus onSend={sendMessage} attachDisabled placeholder="Type message here" value={messageInputValue} onChange={val => setMessageInputValue(val)} />
              </ChatContainer>                         
            </MainContainer>
        </div>
    )
}

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: FullPageLoader,
  })(Messages)