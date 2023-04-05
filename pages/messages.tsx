import FullPageLoader from "@/components/FullPageLoader"
import { withAuthUser, AuthAction, useAuthUser } from "next-firebase-auth"
import { useEffect, useRef, useState } from "react";
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Avatar, Conversation, ConversationHeader, ConversationList, EllipsisButton, MessageSeparator, Search, Sidebar, TypingIndicator, VideoCallButton, VoiceCallButton } from '@chatscope/chat-ui-kit-react';
import pic from "@/public/User_images/jon.jpg";
import { useRouter } from "next/router";

const Messages = () => {
    const AuthUser = useAuthUser();
    const exampleIcon = pic.src;
    const router = useRouter();
    const [messages, setMessages] = useState<any>([]);
    const [chats, setChats] = useState<any>([]);
    const [messageInputValue, setMessageInputValue] = useState("");
    const [chatId, setChatId] = useState("");
    const [nameOfRecipient, setNameOfRecipient] = useState("");
    const target = useRef(null);

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
                let newMessages = messages;
                newMessages.push(data.message);
                setMessages(newMessages);
        });
    }

    async function openChat(chatId, theirName){
        await router.push({
            pathname: "/messages",
            query: {chatId: chatId, name: theirName}
        });
        setChatId(chatId);
    }

    useEffect(() => {
        // Get list of user's chats
        fetch("/api/getChats", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userKey: AuthUser.id})
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.chats);
                setChats(data.chats);
        });
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
            fetch("/api/getMessages", { 
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({chatId: newChatId})
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    setMessages(data.messages);
            });
        }
    }, [chatId]);

    return(
        <div style={{ position:"relative", height: "500px" }} >
        <MainContainer responsive>                
              <Sidebar position="left" scrollable={true}>
                {/* <Search placeholder="Search..." /> */}
                <ConversationList>
                    {
                        chats.map((chat, i) => (
                            <Conversation key={"conversation" + i} name={chat.users[0].key === AuthUser.id ? chat.users[1].name : chat.users[0].name} lastSenderName={chat.recentMessageSender} info={chat.recentMessageText} onClick={() => {openChat(chat.id, chat.users[0].key === AuthUser.id ? chat.users[1].name : chat.users[0].name)}}>
                                <Avatar src={exampleIcon} name="Lilly" />
                            </Conversation>
                        ))
                    }                                                                         
                </ConversationList>
              </Sidebar>
              
              <ChatContainer>
                <ConversationHeader>
                  <ConversationHeader.Back />
                  <Avatar src={exampleIcon} name={nameOfRecipient} />
                  <ConversationHeader.Content userName={nameOfRecipient} info="" />
                  <ConversationHeader.Actions>
                    <EllipsisButton orientation="vertical" />
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
                                {message.senderKey !== AuthUser.id && <Avatar src={exampleIcon} name="Zoe" />}
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