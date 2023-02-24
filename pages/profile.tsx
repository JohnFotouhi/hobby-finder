import HobbyCardEditor from "@/components/hobbyCardEditor";
import { useEffect, useState } from "react";
import { AuthAction, init, useAuthUser, withAuthUser, withAuthUserTokenSSR } from "next-firebase-auth";
import { Button, Col, Container, Row, Form, Stack, Alert, Navbar } from "react-bootstrap";
import FullPageLoader from "@/components/FullPageLoader";
import HobbyCard from "@/components/hobbyCard";
import { initializeApp } from "firebase-admin";
import UserInformation from "@/components/userInformation";
import Jon from "@/public/User_images/jon.jpg";
import UserInformationEditor from '../components/userInformationEditor';
import { updateProfile } from 'firebase/auth';

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

    const getGenreList = (genres : [string]) => {
        console.log("GENRES when making hobby card")
        console.log(genres)
        let genreList = "Genres: ";
        genres.forEach((genre, i) => {
            if(i==0){
                genreList = genreList + genre;
            }
            else{
                genreList = genreList + ", " + genre;
            }
        });
        return genreList;
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
        setNewCard(true);

        //empty params so the card starts blank
        setOldInstrumentId(-1);
        console.log("old genres before and after:")
        console.log(oldGenres)
        setOldGenres([])
        console.log(oldGenres)
        setOldExperience("");
        setOldCommitment("");
        setOldInfo("s");

        setShow(true);
    }

    //in future, will likely take parameters of current settings and ID
    function editCard(){
        setNewCard(false);

        //set state of existing parameters
        //setOldInstrumentId(2);

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
                        <UserInformation capacity={"4"} equipment={"two bass amps"} schedule = {"Tuedays after 8:30pm"} displayName={"Larry McGary"} bio={"I am good at music lmao"} owner={true} editProfile={editProfile} profilePicture={Jon}></UserInformation>
                        <UserInformationEditor setShowProfileEditor={setShowProfileEditor} showProfileEditor={showProfileEditor} oldCapacity={undefined} oldBio={undefined} oldEquipment={undefined} oldSchedule={undefined}></UserInformationEditor>
                    </Col>
                </Row>

                <Container className="mt-3">
                    <Button onClick={handleCreate}>New Hobby Card</Button>
                    <Row className='m-auto'>
                        {cards.map( (card, index) => (
                            <Col md="4" key={index+"hobbyCard"}>
                                <HobbyCard uid={AuthUser.id} setCards={setCards} index={index} instrument={card.instrument} genre={getGenreList(card.genres)} experience={card.experience} commitment={card.commitment} info={card.info} owner={true} editCard={editCard}></HobbyCard>
                            </Col>
                        ))}
                    </Row>
                </Container>

                <Row>
                <HobbyCardEditor uid={AuthUser.id} setCards={setCards} setShow={setShow} show={show} newCard={newCard} oldInstrument={undefined} oldGenre={undefined} oldExperience={undefined} oldCommitment={undefined} oldInfo={undefined}></HobbyCardEditor>
                </Row> 

            </Container>           
        </>
    );
}

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