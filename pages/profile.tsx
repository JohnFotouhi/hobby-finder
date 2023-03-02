import HobbyCardEditor from "../components/hobbyCardEditor";
import { useEffect, useState } from "react";
import { AuthAction, init, useAuthUser, withAuthUser, withAuthUserTokenSSR } from "next-firebase-auth";
import { Button, Col, Container, Row, Form, Stack, Alert, Navbar } from "react-bootstrap";
import FullPageLoader from "../components/FullPageLoader";
import HobbyCard from "../components/hobbyCard";
import { initializeApp } from "firebase-admin";
import UserInformation from "../components/userInformation";
//import Jon from "@/public/User_images/jon.jpg"; //image won't import, idk why. I imagine we're changing this funcitonality anyway
import UserInformationEditor from '../components/userInformationEditor';
import { updateProfile } from 'firebase/auth';
import {instrumentList, experienceList, genreList} from "../lists"
import { getCipherInfo } from "crypto";
import FormInput from "../components/formInput";


const Profile = () => {

    //user credentials
    const AuthUser = useAuthUser();
    //console.log(AuthUser);

    //Profile states
    const [isEditing, setIsEditing] = useState(false);
    const [capacity, setCapacity] = useState("");
    const [bio, setBio] = useState("");
    const [equipment, setEquipment] = useState("");
    const [schedule, setSchedule] = useState({});
    const [displayName, setDisplayName] = useState("");


    //user's cards
    const [cards, setCards] = useState<any[]>([]);

    //Hobby Card States
    const [show, setShow] = useState(false);
    const [newCard, setNewCard] = useState(true);

    const [oldInstrumentId, setOldInstrumentId] = useState(0);
    const [oldGenres, setOldGenres] = useState<any[]>([]);
    const [oldExperience, setOldExperience] = useState(0);
    const [oldCommitMin, setOldCommitMin] = useState(0);
    const [oldCommitMax, setOldCommitMax] = useState(0);
    const [oldInfo, setOldInfo] = useState("");

    //get user's hobby cards and profile information
    useEffect(() => {
        console.log("IN USE EFFECT");
        getCards();
        getProfile();
    }, [oldInfo]);

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

    const getProfile = () => {
        console.log("getting profile");
        fetch("/api/userProfileRetrieval", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({uid: AuthUser.id})
        })
            .then((res) => res.json())
            .then((data) => {
            console.log("user data")
            console.log(data)
            setDisplayName(data.name);
            setBio(data.bio);
            //setAvailability(data.availability);
            setCapacity(data.host);
            setEquipment(data[4]);
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

        setOldExperience(0);
        setOldCommitMin(0);
        setOldCommitMax(0);
        setOldInfo("");

        setShow(true);
    }

    //in future, will likely take parameters of current settings and ID
    function editCard(instrument, genres, experience, min, max, info){
        console.log("SETTING new card bool in edit")
        setNewCard(false);

        var inst =  instrumentList.map((e) => { return e.value; }).indexOf(instrument);        
        setOldInstrumentId(inst);

        //console.log(oldInstrumentId);
        setOldGenres(genres);

        var exp =  experienceList.map((e) => { return e.value; }).indexOf(experience);        
        setOldExperience(exp);

        setOldCommitMin(min);
        setOldCommitMax(max);
        setOldInfo(info);
        
        setShow(true);
    }

    function handleEditChange(){
        if(!isEditing){
            setIsEditing(true);
        }
        else{ //user has saved new information
            let status;
            console.log(bio)
            console.log(displayName)
            console.log(equipment)
            console.log(capacity)
            fetch("/api/userProfileUpdate", { 
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    uid: AuthUser.id,
                    name: displayName,
                    bio: bio,
                    availability: schedule,
                    host: capacity,
                    equipment: equipment
                    })
              })
                .then((res) => {
                    status = res.status;
                    return res.json();           
                })
                .then((data) => {
                    if(status == 200){
                        console.log("SUCESSFUL PROFILE UPDATE");
                        console.log(data);       
                    }
                    else if(status == 409){
                        console.log("UNSUCESSFUL USER")
                        console.log(data);
                        //TODO: error message for user
                    }        
                });
            setIsEditing(false);
        }
    }


    return(
        <>  
            <Container>
                <Row>
                    <Button onClick={handleEditChange}>{isEditing? "Save" : "Edit"}</Button>
                    <Col>
                        {isEditing?
                        <UserInformationEditor setShowProfileEditor={setShowProfileEditor} showProfileEditor={showProfileEditor} oldCapacity={capacity} oldBio={undefined} oldEquipment={undefined} oldSchedule={undefined} oldName={displayName} setName={setDisplayName} setCapacity={setCapacity} setBio={setBio} setEquipment={setEquipment} setSchedule={undefined}></UserInformationEditor>
                        :  <UserInformation owner={true} name={displayName} bio={bio} equipment={equipment} capacity={capacity} availability={undefined} profilePicture={undefined}></UserInformation> }
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
                { show && (
                <HobbyCardEditor uid={AuthUser.id} setCards={setCards} setShow={setShow} show={show} newCard={newCard} oldInstrument={oldInstrumentId} oldGenre={oldGenres} oldExperience={oldExperience} oldCommitMin={oldCommitMin} oldCommitMax={oldCommitMax} oldInfo={oldInfo}></HobbyCardEditor>
                )}
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