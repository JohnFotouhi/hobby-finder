import FullPageLoader from "@/components/FullPageLoader";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, ListGroup, ListGroupItem, Row, Image } from "react-bootstrap";
import globals from '../styles/Home.module.css';
import { useRouter } from "next/router";
import { getDownloadURL, getStorage } from "firebase/storage";
import firebaseApp from "@/config";
import { BsPersonCircle } from "react-icons/bs";
import pic from "@/public/User_images/jon.jpg";


const Friends = () => {
    const [requests, setRequests] = useState<any[]>([]);
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
                console.log(newRequests);
        });
    }, [])
    
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
        <Container>
            <Row>
                <Col xs={6}>
                    <ListGroup variant="flush" className="mt-3">
                        <ListGroup.Item as="li" active className="text-center">Friend Requests</ListGroup.Item>
                        {requests.map( (request, i) => (
                            <ListGroup.Item as="li" className="" key={request.key}>
                                <Card className="text-center">
                                    <Card.Title className="text-center p-2" onClick={() => {navigateToProfile(request.key)}}>
                                        <div className="m-auto"> 
                                            <Image className= "square bg-light rounded-pill mx-2" src={exampleProfilePic} alt="profile_picture" width="50" height = "50"></Image>
                                            {request.name}
                                        </div>
                                    </Card.Title>
                                    <Container>
                                        <Row>
                                            <Col><Button className={"p-0 m-1 " + globals.btn} onClick={() => {handleChoice("accept", request.key)}}>Accept</Button></Col>
                                            <Col><Button className="p-0 m-1"  variant="outline-secondary" onClick={() => {handleChoice("ignore", request.key)}}>Ignore</Button></Col>
                                            <Col><Button className="p-0 m-1" variant="outline-danger" onClick={() => {handleChoice("block", request.key)}}>Block</Button></Col>
                                        </Row>
                                    </Container>
                                </Card>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
                <Col xs={6}>
                    Search for friends -- Coming Soon
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
