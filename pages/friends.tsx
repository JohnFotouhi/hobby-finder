import FullPageLoader from "@/components/FullPageLoader";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import { createRef, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Col, Container, ListGroup, ListGroupItem, Row, Image, Overlay, Form, InputGroup } from "react-bootstrap";
import globals from '../styles/Home.module.css';
import { useRouter } from "next/router";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import firebaseApp from "@/config";
import { BsClockHistory, BsFillChatFill, BsPersonCircle, BsThreeDotsVertical } from "react-icons/bs";
import pic from "@/public/User_images/person-fill.svg";
import { useMediaQuery } from "react-responsive";


const Friends = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    const [chats, setChats] = useState<any[]>([]);
    const [overlayRefs, setOverlayRefs] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [filteredFriends, setFilteredFriends] = useState<any[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
    const AuthUser = useAuthUser();
    const router = useRouter();
    const storage = getStorage(firebaseApp);
    const exampleProfilePic = pic.src;
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

    function redirectToChat(theirKey, theirName, ){
        let chat : any = chats.find(currentChat => currentChat.userKeys.includes(theirKey));
        router.push({pathname: "/messages", query: {chatId: chat.id, name: theirName, key: theirKey}})
    }

    useEffect(() => {
        let newFilteredFriends;
        let newFilteredRequests;
        if(searchValue === ""){
            newFilteredFriends = friends;
            newFilteredRequests = requests;
        }
        else{
            newFilteredFriends = friends.filter(friend => friend.name.toLowerCase().includes(searchValue.toLowerCase()) );
            newFilteredRequests = requests.filter(request => request.name.toLowerCase().includes(searchValue.toLowerCase()));
        }
        setFilteredFriends(newFilteredFriends);
        setFilteredRequests(newFilteredRequests);
    }, [searchValue])

    async function getPicture(key) {
        //get prof pic
        let result;
        const imageRef = ref(storage, `Profile Pictures/${key}`);
        result = await getDownloadURL(imageRef).then(onResolve, onReject);
        console.log(result);
        return (result);      
    }
    function onResolve(foundURL){
        return foundURL;
    }
    function onReject(error){
        return pic.src;
    }

    useEffect(() => {
        fetch("/api/allRelationshipsRetrieval", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({myKey: AuthUser.id})
        })
            .then((res) => res.json())
            .then((data) => {
                const getRelationships = async (data) => {
                    console.log(data.relationships);
                    let newRequests : any[] = [];
                    let newFriends : any[] = [];
                    for (let i = 0; i < data.relationships.length; i++){
                        let newRelationship = data.relationships[i];
                        newRelationship["profileURL"] = await getPicture(newRelationship.key);
                        console.log(newRelationship.profileURL);
                        if(newRelationship.status === "respond"){
                            newRequests.push(newRelationship);
                        }
                        if(newRelationship.status === "friends" || newRelationship.status === "pending"){
                            newFriends.push(newRelationship);
                        }
                    }
                    setRequests(newRequests);
                    setFilteredRequests(newRequests);
                    setFriends(newFriends);
                    setFilteredFriends(newFriends);
                }
                getRelationships(data);
                
        });
        fetch("/api/getChats", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userKey: AuthUser.id})
        })
            .then((res) => res.json())
            .then((data) => {
                setChats(data.chats);
        });
    }, [])

    // useEffect(() => {
    //     const newOverlayRefs = overlayRefs;
    //     for(let i = overlayRefs.length; i < requests.length; i++){
    //         console.log("HIII");
    //         let newRef : any = createRef();
    //         newOverlayRefs.push(newRef);
    //     }
    //     setOverlayRefs(newOverlayRefs);
    // }, [requests]);
 
    function handleChoice(choice, otherId){
        fetch("/api/relationshipUpdate", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({action: choice, myKey: AuthUser.id, theirKey: otherId})
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                let newFriend = requests.find(relationship => relationship.key === otherId);
                let newRequests = requests.filter(relationship => relationship.key !== otherId);
                let newFilteredRequests = filteredRequests.filter(relationship => relationship.key !== otherId);
                setRequests(newRequests);
                setFilteredRequests(newFilteredRequests);
                let newFriends = friends.filter(relationship => relationship.key !== otherId);
                let newFilteredFriends = filteredFriends.filter(relationship => relationship.key !== otherId);
                if(choice === "accept"){
                    newFriend['status'] = "friends";
                    newFriends.push(newFriend);
                }
                setFriends(newFriends);
                setFilteredFriends(newFilteredFriends);
        });
    }
    
    function navigateToProfile(userId){
        router.push({
            pathname: "/user",
            query: {uid: userId}
        });
    }

    return(
        <>
        <Container fluid className='bg-light pb-3 mt-0' >
            <div className="mx-auto" style={{width: isMobile ? "60%" : '400px'}}>
                <Row>
                    <InputGroup className="justify-content-center">
                        <Form.Control
                        placeholder="Search for friends"
                        value={searchValue}
                        onChange={(event) => {setSearchValue(event.target.value)}}
                        />
                        <Button variant="outline-secondary" id="button-addon2" >
                        Search
                        </Button>
                    </InputGroup>
                </Row>
            </div>
        </Container>
        <Container fluid>
            <Row className="">
                <Col md={6}>
                    <ListGroup variant="flush" className="mt-3">
                        <ListGroup.Item as="li" active className="text-center">Friend Requests</ListGroup.Item>
                        {filteredRequests.map( (request, i) => (
                            <ListGroup.Item as="li" className="" key={request.key}>
                                <Card className="">
                                    <Card.Title className=" p-2">
                                        <Container fluid>
                                            <Row >
                                                <Col xs={8} onClick={() => {navigateToProfile(request.key)}}>
                                                    <Image className= "square bg-light rounded-pill mx-2" src={request.profileURL} alt="profile_picture" width="50" height = "50"></Image>
                                                    {request.name}
                                                </Col>
                                                <Col xs={4}>
                                                    <Button className={"p-0 m-1 " + globals.btn} onClick={() => {handleChoice("accept", request.key)}}>Accept</Button>
                                                    <Button className="p-0 m-1"  variant="outline-secondary" onClick={() => {handleChoice("ignore", request.key)}}>Ignore</Button>
                                                    <Button className="p-0 m-1" variant="outline-danger" onClick={() => {handleChoice("block", request.key)}}>Block</Button>
                                                    {/* <Button ref={overlayRefs[i]} className="mb-3">
                                                        <BsThreeDotsVertical className="mt-3"/>
                                                    </Button>
                                                    <Overlay show target={overlayRefs[i]} placement="bottom">
                                                        <div className="bg-light">
                                                        <Button className={"w-100 rounded-0"} variant="light" onClick={() => {handleChoice("accept", request.key)}}>Accept</Button>
                                                        <hr className={"m-0 p-0"}/>
                                                        <Button className="w-100 rounded-0"  variant="light" onClick={() => {handleChoice("ignore", request.key)}}>Ignore</Button>
                                                        <hr className={"m-0 p-0"}/>
                                                        <Button className="w-100 rounded-0" variant="light" onClick={() => {handleChoice("block", request.key)}}>Block</Button>
                                                        </div>
                                                    </Overlay> */}
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Card.Title>
                                    
                                </Card>
                            </ListGroup.Item>
                        ))}
                        {
                            requests.length === 0 &&
                            <div className="text-center mt-2 fs-5 fw-bolder">You don't have any friend requests right now</div>
                        }
                    </ListGroup>
                </Col>
                <Col md={6} className="">
                <ListGroup variant="flush" className="mt-3">
                        <ListGroup.Item as="li" active className="text-center">Friends</ListGroup.Item>
                        {filteredFriends.map( (friend, i) => (
                            <ListGroup.Item as="li" className="" key={friend.key}>
                                <Card className="">
                                    <Card.Title className="p-2">
                                        <Container>
                                            <Row>
                                                <Col xs={8} onClick={() => {navigateToProfile(friend.key)}}>
                                                    <Image className= "square bg-light rounded-pill mx-2" src={friend.profileURL} alt="profile_picture" width="50" height = "50"></Image>
                                                    {friend.name}
                                                </Col>
                                                <Col xs={4} className="pt-2">
                                                    { friend.status === "friends" &&
                                                    <>
                                                    <BsFillChatFill className="mx-1 ml-auto" onClick={() => {redirectToChat(friend.key, friend.name)}} />
                                                    <Button className="p-0 m-1" variant="outline-danger" onClick={() => {handleChoice("unfriend", friend.key)}}>Unfriend</Button>
                                                    </>
                                                    }
                                                    { friend.status === "pending" &&
                                                        <div className="text-center">
                                                            <BsClockHistory />
                                                            <div className="fs-6"> 
                                                                {"pending"}
                                                            </div>
                                                        </div>
                                                    }
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Card.Title>
                                    
                                </Card>
                            </ListGroup.Item>
                        ))}
                        {
                            friends.length === 0 &&
                            <div className="text-center mt-2 fs-5 fw-bolder">You don't have any friends right now. Head to <Button className=" mb-1 p-0" variant="link" onClick={() => {router.push({pathname: "/search"})}}>search</Button> to find some!</div>
                        }
                    </ListGroup>
                </Col>
            </Row>
        </Container>
        </>
    );
}

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: FullPageLoader,
  })(Friends)
