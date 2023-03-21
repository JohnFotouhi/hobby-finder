import { Button, Col, Container, Row, Form, Stack, Alert, Navbar } from "react-bootstrap";
import HobbyCard from "../components/hobbyCard";
import { useAuthUser, AuthAction, withAuthUser } from "next-firebase-auth";
import UploadImage from "../components/uploadImage";
import UserInformation from "../components/userInformation";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { APP_BUILD_MANIFEST } from "next/dist/shared/lib/constants";
//import perry from "../public/User_images/perry.png";

function User() {

    //user credentials
    const AuthUser = useAuthUser();
    console.log(AuthUser);

    //TO DO: Get proper uid from URL
    let userId = 123;

    //user's cards
    const [cards, setCards] = useState<any[]>([]);
    const [status, setStatus] = useState<any>();
    //let status;
    
    //get user's hobby cards and profile information
    useEffect(() => {
        console.log("IN USE EFFECT");
        getRelationshipStatus();
        //getCards();
        //getProfile();
    }, []);

    const getRelationshipStatus = () => {
        console.log("GETTING REL STATUS")
        fetch("/api/relationshipRetrieval", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({myKey: AuthUser.id, theirId: "j1vCDj5kqxOe7PNN12sQ"})
        })
            .then((res) => res.json())
            .then((data) => {
            console.log(data)
            //setStatus(data)
            if(data == 1){
                setStatus(<Button onClick={updateRelationshipStatus}>Reach Out</Button>);
                console.log(status)
            }
            else if(data == 2){
                setStatus(<div className="btn btn-static">Waiting for Reply</div>);
            }
            else if(data == 3){
                setStatus(<Button onClick={updateRelationshipStatus}>Accept Request</Button>);
            }
            else if(data == 4){
                setStatus(<div className="btn btn-static">email@email.com (todo lol)</div>);
            }
        });
    }

    const updateRelationshipStatus = () => {
        console.log("UPDATING REL STATUS")
    }

    const getCards = () => {

        console.log("GETTING CARDS")
        fetch("/api/hobbyCardRetrieval", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({uid: userId})
        })
            .then((res) => res.json())
            .then((data) => {
            console.log(data)
            setCards(data);
        });
    }

    function editProfile(){
        //need to fill in
    }

    return(
        <>  
            {/*<UserInformation capacity={"2"} equipment={"a condenser mic and an interface"} schedule = {"Any morning before 11am"} displayName={"Perry the Platypus"} bio={"*chatter*"} owner={false} editProfile={editProfile} profilePicture={perry}></UserInformation>*/}
            
            <Container fluid className ="bg-light">

                <Col> {status} </Col>

                <h2>USER PROFILE STUFF HERE</h2>

                <Container className="mt-3">
                    <h2>Hobbies</h2>
                    <Row className='m-auto'>
                        {cards.map( (card, index) => (
                            <Col md="4" key={index+"hobbyCard"}>
                                <HobbyCard uid={undefined} setCards={undefined} index={index} instrument={card.instrument} genre={card.genres} 
                                experience={card.experience} commitMin={card.commitMin} commitMax={card.commitMax} info={card.info} owner={false} 
                                editCard={undefined}  />
                            </Col>
                        ))}
                    </Row>
                </Container>

            </Container>
        </>
    );

}
export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.RENDER,
  })(User)
