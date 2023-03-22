import { Button, Col, Container, Row, Form, Stack, Alert, Navbar, Spinner } from "react-bootstrap";
import HobbyCard from "../components/hobbyCard";
import { useAuthUser, AuthAction, withAuthUser } from "next-firebase-auth";
import UploadImage from "../components/uploadImage";
import UserInformation from "../components/userInformation";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { APP_BUILD_MANIFEST } from "next/dist/shared/lib/constants";
import { DatabaseService } from "firebase-admin/lib/database/database";
//import perry from "../public/User_images/perry.png";
import FullPageLoader from "../components/FullPageLoader";



function User() {
    const [capacity, setCapacity] = useState("");
    const [bio, setBio] = useState("");
    const [equipment, setEquipment] = useState("");
    const [schedule, setSchedule] = useState({});
    const [displayName, setDisplayName] = useState("");
    //const [userKey, setUserKey] = useState("");

    const [loadingCards, setLoadingCards] = useState(true);
    const [loadingData, setLoadingData] = useState(true);
    const AuthUser = useAuthUser();
    console.log(AuthUser);

    //TO DO: Get proper uid from URL
    let userId = 123;

    //user's cards
    const [cards, setCards] = useState<any[]>([]);
    const [status, setStatus] = useState<any>();
    //let status;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const uid = params.get('uid');

        fetch("/api/hobbyCardRetrieval", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({uid: uid})
        })
            .then((res) => res.json())
            .then((data) => {
            setCards(data);
            setLoadingCards(false);
        });

        fetch("/api/userProfileRetrieval", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({uid: uid})
        })
            .then((res) => res.json())
            .then((data) => {
            setDisplayName(data.name);
            setBio(data.bio);
            //setAvailability(data.availability);
            setCapacity(data.host);
            setEquipment(data[4]);
            setLoadingData(false);
        });

        getRelationshipStatus(uid);
    }, [])

    const getRelationshipStatus = (theirId) => {

        console.log("GETTING REL STATUS")
        fetch("/api/relationshipRetrieval", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({myKey: AuthUser.id, theirKey: theirId})
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                //setStatus(data)
                if(data.code <= 1){
                    setStatus(<Button onClick={updateRelationshipStatus}>Reach Out</Button>);
                    console.log(status)
                }
                else if(data.code == 2){
                    setStatus(<h3 className="">Waiting for Reply</h3>);
                }
                else if(data.code == 3){
                    setStatus(<Button onClick={updateRelationshipStatus}>Accept Request</Button>);
                }
                else if(data.code == 4){
                    setStatus(<h3 className="">{data.email}</h3>);
                }
        });
    }
    
    const updateRelationshipStatus = () => {
        const params = new URLSearchParams(window.location.search);
        const uid = params.get('uid');

        console.log("UPDATING REL STATUS")

        fetch("/api/relationshipUpdate", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},     
            body: JSON.stringify({myKey: AuthUser.id, theirKey: uid}, replacerFunc())
        })
            .then((res) => res.json())
            .then((data) => {  
                if(data.code == 1){
                    setStatus(<h3 className="">Waiting for Reply</h3>);
                    console.log(status)
                }
                else if(data.code == 2){
                    setStatus(<h3 className="">{data.email}</h3>);
                }
        });     
    }

    //https://careerkarma.com/blog/converting-circular-structure-to-json/
    const replacerFunc = () => {
        const visited = new WeakSet();
        return (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (visited.has(value)) {
              return;
            }
            visited.add(value);
          }
          return value;
        };
      };

    return(
       
        <>
        { loadingCards || loadingData ? 
        <Container className="align-items-center mt-5 text-center">
            <Spinner animation="border" role="status"></Spinner>
        </Container> :
        <Container>
            <Row>
                <Col>
                    <UserInformation owner={true} name={displayName} pronouns={""} bio={bio} equipment={equipment} capacity={capacity} availability={undefined} profilePicture={undefined}></UserInformation>
                </Col>
            </Row>
            <Container className="mt-3">
            <Col> {status} </Col>
                <h2>Hobbies</h2>
                <Row className='m-auto'>
                    {cards.map( (card, index) => (
                        <Col md="4" key={index+"hobbyCard"}>
                            <HobbyCard uid={AuthUser.id} setCards={setCards} index={index} instrument={card.instrument} genre={card.genres} 
                            experience={card.experience} commitMin={card.commitMin} commitMax={card.commitMax} info={card.info} owner={false}
                            editCard={() => {}} />
                        </Col>
                    ))}
                </Row>
            </Container>
        </Container> }      
        </>
    );

}
export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: FullPageLoader
  })(User)
