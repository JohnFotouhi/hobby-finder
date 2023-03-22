import { Button, Col, Container, Row, Form, Stack, Alert, Navbar, Spinner } from "react-bootstrap";
import HobbyCard from "../components/hobbyCard";
import { useAuthUser, AuthAction, withAuthUser } from "next-firebase-auth";
import UploadImage from "../components/uploadImage";
import UserInformation from "../components/userInformation";
import { useEffect, useState } from "react";
import FullPageLoader from "../components/FullPageLoader";



function User() {
    const [capacity, setCapacity] = useState("");
    const [bio, setBio] = useState("");
    const [equipment, setEquipment] = useState("");
    const [schedule, setSchedule] = useState({});
    const [displayName, setDisplayName] = useState("");
    const [cards, setCards] = useState<any[]>([]);
    const [loadingCards, setLoadingCards] = useState(true);
    const [loadingData, setLoadingData] = useState(true);
    const AuthUser = useAuthUser();

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
    }, [])
    

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
