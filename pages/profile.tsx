import HobbyCardEditor from "../components/hobbyCardEditor";
import { useEffect, useState } from "react";
import { AuthAction, init, useAuthUser, withAuthUser, withAuthUserTokenSSR } from "next-firebase-auth";
import { Button, Col, Container, Row, Form, Stack, Alert, Navbar } from "react-bootstrap";
import FullPageLoader from "../components/FullPageLoader";
import HobbyCard from "../components/hobbyCard";
import { initializeApp } from "firebase-admin";
import UserInformation from "../components/userInformation";
// import Jon from "../public/User_images/jon.jpg"; //image won't import, idk why. I imagine we're changing this funcitonality anyway
import UserInformationEditor from '../components/userInformationEditor';
import { updateProfile } from 'firebase/auth';
import {instrumentList, experienceList, genreList} from "../lists"


const Profile = () => {

    //user credentials
    const AuthUser = useAuthUser();
    console.log(AuthUser);

    //user's cards
    const [cards, setCards] = useState<any[]>([]);

    //Hobby Card States
    const [show, setShow] = useState(false);
    const [newCard, setNewCard] = useState(true);

    const [oldInstrumentId, setOldInstrumentId] = useState(0);
    const [oldGenres, setOldGenres] = useState<any[]>([]);
    const [oldExperience, setOldExperience] = useState("");
    const [oldCommitment, setOldCommitment] = useState("");
    const [oldInfo, setOldInfo] = useState("");

    //get user's hobby cards
    useEffect(() => {
        console.log("IN USE EFFECT");
        getCards();
    }, []);

    function clearCardFields(){
        
    } 

    const getCards = () => {
        fetch("/api/hobbyCardRetrieval", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({uid: AuthUser.id})
        })
            .then((res) => res.json())
            .then((data) => {
            console.log(data)
            setCards(data);
        });
    }

    //User Info Functions
    const [showProfileEditor, setShowProfileEditor] = useState(false);
    const [oldBio, setNewBio] = useState("");

    function handleCreate(){
        console.log("SETTING card bool in create")
        setNewCard(true);
        console.log(newCard)

        //empty params so the card starts blank
        console.log("SETTING old instrument in create")
        setOldInstrumentId(-1);
        console.log(oldInstrumentId)

        setOldGenres([])

        setOldExperience("");
        setOldCommitment("");
        setOldInfo("");

        setShow(true);
    }

    //in future, will likely take parameters of current settings and ID
    function editCard(instrument, genres, experience, min, max, info){
        console.log("SETTING new card bool in edit")
        setNewCard(false);
        console.log(newCard)

        console.log("SETTING old instrument in edit")
        setOldInstrumentId(2);
        console.log(oldInstrumentId);

        setOldExperience(experience);
        console.log(oldExperience)

        //show editor modal
        setShow(true);
    }

    function editProfile(){

        console.log("edit profile")
        //show editor modal
        setShowProfileEditor(true);
    }
    
    return(
        <>  
            <Container>
                <Row>
                    <Col>
                        <UserInformation capacity={"4"} equipment={"two bass amps"} schedule = {"Tuedays after 8:30pm"} displayName={"Larry McGary"} bio={"I am good at music lmao"} owner={true} editProfile={editProfile} profilePicture={undefined}></UserInformation>
                        <UserInformationEditor setShowProfileEditor={setShowProfileEditor} showProfileEditor={showProfileEditor} oldCapacity={undefined} oldBio={undefined} oldEquipment={undefined} oldSchedule={undefined}></UserInformationEditor>
                    </Col>
                </Row>

                <Container className="mt-3">
                    <h2>Hobbies</h2>
                    <Button onClick={handleCreate}>New Hobby</Button>
                    <Row className='m-auto'>
                        {cards.map( (card, index) => (
                            <Col md="4" key={index+"hobbyCard"}>
                                <HobbyCard uid={AuthUser.id} setCards={setCards} index={index} instrument={card.instrument} genre={card.genres} 
                                experience={card.experience} commitMin={card.commitMin} commitMax={card.commitMax} info={card.info} owner={true} 
                                editCard={() => editCard(card.instrument, card.genres, card.experience, card.commitMin, card.commitMax, card.info)}></HobbyCard>
                            </Col>
                        ))}
                    </Row>
                </Container>

                <Row>
                { show && 
                <HobbyCardEditor uid={AuthUser.id} setCards={setCards} setShow={setShow} show={show} newCard={newCard} oldInstrument={undefined} oldGenre={undefined} oldExperience={undefined} oldCommitment={undefined} oldInfo={undefined}></HobbyCardEditor>
                }
                </Row> 

            </Container>           
        </>
    );
}

//editCard(card.instrument, card.genres, card.experience, card.commitMin, card.commitMax, card.info)

// export const getServerSideProps = withAuthUserTokenSSR({
//     whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
// })(async ({AuthUser, req}) => {
//     console.log(AuthUser);
//     return{
//         props: {
//             test: "hello"
//         }
//     }
// })

// export default withAuthUser({
//     whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
// })(Profile)

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: FullPageLoader,
  })(Profile)