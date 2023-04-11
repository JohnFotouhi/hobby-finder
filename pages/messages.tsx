import FullPageLoader from "@/components/FullPageLoader"
import { withAuthUser, AuthAction, useAuthUser } from "next-firebase-auth"
import { useEffect, useRef, useState } from "react";
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Avatar, Conversation, ConversationHeader, ConversationList, EllipsisButton, MessageSeparator, Search, Sidebar, TypingIndicator, VideoCallButton, VoiceCallButton } from '@chatscope/chat-ui-kit-react';
import pic from "@/public/User_images/bsPersonFill.png";
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
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [sidebarStyle, setSidebarStyle] = useState({});
    const [chatContainerStyle, setChatContainerStyle] = useState({});
    const [conversationContentStyle, setConversationContentStyle] = useState({});
    const [conversationAvatarStyle, setConversationAvatarStyle] = useState({});
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

    async function openChat(chatId, theirName, theirKey){
        if (sidebarVisible) {
            setSidebarVisible(false);
        }
        await router.push({
            pathname: "/messages",
            query: {chatId: chatId, name: theirName, key: theirKey}
        });
        setChatId(chatId);
    }

    const handleBackClick = () => setSidebarVisible(!sidebarVisible);

    useEffect(() => {
        if(chatSearch === ""){
            setFilteredChats(chats);
        }
        else{
            let lowerCaseSearch = chatSearch.toLowerCase();
            let newFilteredChats = chats.filter(chat => chat.users[0].name.toLowerCase().includes(lowerCaseSearch) && chat.users[0].key !== AuthUser.id || chat.users[1].name.toLowerCase().includes(lowerCaseSearch) && chat.users[1].key !== AuthUser.id);
            setFilteredChats(newFilteredChats);
        }
    }, [chatSearch, chats]);
    function onResolve(foundURL){
        return foundURL;
    }
    function onReject(error){
        return pic.src;
    }
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
   
                    
                    const profileRef = ref(storage, `Profile Pictures/${chatData.users[0].key === AuthUser.id ? chatData.users[1].key : chatData.users[0].key}`); 
                    
                    const fetchData = async () => {
                        chatData["profileURL"] = await getDownloadURL(profileRef).then(onResolve, onReject);  
                        newChats.push(chatData);
                        setChats(newChats);
                    }
               
                    fetchData();
                    
                });
                
            });
            return unsubscribe;
    }, []);

    useEffect(() => {
        if (sidebarVisible) {
          setSidebarStyle({
            display: "flex",
            flexBasis: "auto",
            width: "100%",
            maxWidth: "100%"
          });
          setConversationContentStyle({
            display: "flex"
          });
          setConversationAvatarStyle({
            marginRight: "1em"
          });
          setChatContainerStyle({
            display: "none"
          });
        } else {
          setSidebarStyle({});
          setConversationContentStyle({});
          setConversationAvatarStyle({});
          setChatContainerStyle({});
        }
      }, [sidebarVisible, setSidebarVisible, setConversationContentStyle, setConversationAvatarStyle, setSidebarStyle, setChatContainerStyle]);

    useEffect(() => {
        // This is triggered on load and when the user clicks on a chat and changes the messages to be shown in the main window
        console.log("changing windows");
        const params = new URLSearchParams(window.location.search);
        let newChatId = params.get('chatId');
        if(newChatId === null) newChatId = "";
        setChatId(newChatId);
        let newName = params.get('name');
        if(newName === null) newName = "";
        setNameOfRecipient(newName);
        let newUserKey = params.get('key');
        if(newUserKey === null) newUserKey = "";

             
        // Get list of messages for the chat that is currently opened (if any)
        if(typeof(newChatId) !== "undefined"){
            const database = getFirestore(firebaseApp);
            const messagesRef = collectionGroup(database, "messages");
            const messageQuery = query(messagesRef, where("chatId", "==", chatId), orderBy("time"));
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
              <Sidebar position="left" scrollable={true} style={sidebarStyle}>
                <Search placeholder="Search..." value={chatSearch} onChange={setChatSearch} onClearClick={() => {setChatSearch("")}}/>
                <ConversationList >
                    {
                        filteredChats.map((chat, i) => (
                            <Conversation key={"conversation" + i} onClick={() => {openChat(chat.id, chat.users[0].key === AuthUser.id ? chat.users[1].name : chat.users[0].name, chat.users[0].key === AuthUser.id ? chat.users[1].key : chat.users[0].key)}}>
                                <Avatar key={"chatImage" + i} src={chat.profileURL} name="Lilly" style={conversationAvatarStyle}/>
                                <Conversation.Content name={chat.users[0].key === AuthUser.id ? chat.users[1].name : chat.users[0].name} lastSenderName={chat.recentMessageSender} info={chat.recentMessageText} style={conversationContentStyle} />
                            </Conversation>
                        ))
                    }     
                    { filteredChats.length === 0 && chats.length !== 0 && <div className="text-center">No chats matched your search</div>}         
                    { chats.length === 0 && <div className="text-center">You can only message your friends. Head to <Button className=" mb-1 p-0" variant="link" onClick={() => {router.push({pathname: "/search"})}}>search</Button> to make some!</div>}                                                           
                </ConversationList>
              </Sidebar>
              
              <ChatContainer style={chatContainerStyle}>
                <ConversationHeader style={{marginBottom:"15px"}}>
                  <ConversationHeader.Back onClick={handleBackClick}/>
                  {chatId !== "" && <Avatar src={imageRef} name={nameOfRecipient} />}
                  {chatId === "" && <Avatar src={imageRef} name={nameOfRecipient} />}
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
                                {message.senderKey !== AuthUser.id && <Avatar key={"messageImage" + i} src= {imageRef} name="Zoe" />}
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