import FullPageLoader from "@/components/FullPageLoader";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import { createRef, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Col, Container, ListGroup, ListGroupItem, Row, Image, Overlay } from "react-bootstrap";
import globals from '../styles/Home.module.css';
import { useRouter } from "next/router";
import { getDownloadURL, getStorage } from "firebase/storage";
import firebaseApp from "@/config";
import { BsFillChatFill, BsPersonCircle, BsThreeDotsVertical } from "react-icons/bs";
import pic from "@/public/User_images/jon.jpg";


const Friends = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    const [overlayRefs, setOverlayRefs] = useState<any[]>([]);
    const AuthUser = useAuthUser();
    const router = useRouter();
    const storage = getStorage(firebaseApp);
    const exampleProfilePic = pic.src;

    useEffect(() => {
        fetch("/api/allRelationshipsRetrieval", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({myKey: AuthUser.id})
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.relationships);
                let newRequests = data.relationships.filter(relationship => relationship.status == "respond");
                setRequests(newRequests);
                let newFriends = data.relationships.filter(relationship => relationship.status == "friends" || relationship.status == "pending");
                setFriends(newFriends);
        });
    }, [])

    useEffect(() => {
        const newOverlayRefs = overlayRefs;
        for(let i = overlayRefs.length; i < requests.length; i++){
            console.log("HIII");
            let newRef : any = createRef();
            newOverlayRefs.push(newRef);
        }
        setOverlayRefs(newOverlayRefs);
    }, [requests]);
 
    function handleChoice(choice, otherId){
        fetch("/api/relationshipUpdate", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({action: choice, myKey: AuthUser.id, theirKey: otherId})
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                let newRequests = requests.filter(relationship => relationship.key !== otherId);
                setRequests(newRequests);
                let newFriends = friends.filter(relationship => relationship.key !== otherId);
                setFriends(newFriends);
        });
    }
    
    function navigateToProfile(userId){
        router.push({
            pathname: "/user",
            query: {uid: userId}
        });
    }

    function getProfilePic(ref){
        console.log(ref);
        getDownloadURL(ref).then((url) => {
            return(
                {url: url}
            )
        })
    }

    return(
        <Container fluid>
            <Row className="">
                <Col xs={6}>
                    <ListGroup variant="flush" className="mt-3">
                        <ListGroup.Item as="li" active className="text-center">Friend Requests</ListGroup.Item>
                        {requests.map( (request, i) => (
                            <ListGroup.Item as="li" className="" key={request.key}>
                                <Card className="">
                                    <Card.Title className=" p-2">
                                        <Container fluid>
                                            <Row >
                                                <Col xs={8} onClick={() => {navigateToProfile(request.key)}}>
                                                    <Image className= "square bg-light rounded-pill mx-2" src={exampleProfilePic} alt="profile_picture" width="50" height = "50"></Image>
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
                <Col xs={6} className="">
                <ListGroup variant="flush" className="mt-3">
                        <ListGroup.Item as="li" active className="text-center">Friends</ListGroup.Item>
                        {friends.map( (friend, i) => (
                            <ListGroup.Item as="li" className="" key={friend.key}>
                                <Card className="">
                                    <Card.Title className="p-2">
                                        <Container>
                                            <Row>
                                                <Col xs={8} onClick={() => {navigateToProfile(friend.key)}}>
                                                    <Image className= "square bg-light rounded-pill mx-2" src={exampleProfilePic} alt="profile_picture" width="50" height = "50"></Image>
                                                    {friend.name}
                                                </Col>
                                                <Col xs={4} className="pt-2">
                                                    <BsFillChatFill className="mx-1 ml-auto" onClick={() => {router.push({pathname: "/messages", query: {uid: friend.key, name: friend.name}})}} />
                                                    <Button className="p-0 m-1" variant="outline-danger" onClick={() => {handleChoice("unfriend", friend.key)}}>Unfriend</Button>
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
    );
}

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: FullPageLoader,
  })(Friends)
