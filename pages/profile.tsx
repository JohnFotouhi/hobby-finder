import HobbyCardEditor from "../components/hobbyCardEditor";
import { useEffect, useState } from "react";
import { AuthAction, init, useAuthUser, withAuthUser, withAuthUserTokenSSR } from "next-firebase-auth";
import { Button, Col, Container, Row, Form, Stack, Alert, Navbar, Modal } from "react-bootstrap";
import FullPageLoader from "../components/FullPageLoader";
import HobbyCard from "../components/hobbyCard";
import { initializeApp } from "firebase-admin";
import UserInformation from "../components/userInformation";
//import Jon from "/public/User_images/jon.jpg"; //image won't import, idk why. I imagine we're changing this funcitonality anyway
import UserInformationEditor from '../components/userInformationEditor';
import { updateProfile } from 'firebase/auth';
import {instrumentList, experienceList, genreList} from "../lists"
import { generateKey, getCipherInfo } from "crypto";
import FormInput from "../components/formInput";
import { stringify } from "querystring";
import { Auth } from "firebase-admin/lib/auth/auth";
import globals from '../styles/Home.module.css'


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
    const [pronouns, setPronouns] = useState("")

    //user's cards
    const [cards, setCards] = useState<any[]>([]);

    //Hobby Card States
    const [show, setShow] = useState(false);
    const [newCard, setNewCard] = useState(true);

    const [oldInstrumentId, setOldInstrumentId] = useState(0);
    const [oldGenres, setOldGenres] = useState<any[]>([]);
    const [oldGenreStrings, setOldGenreStrings] = useState<string[]>([]);
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

    const getCards = () => {
        console.log("GETTING CARDS")
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
            //set pronouns to be the object version.
            setPronouns(data.pronouns)
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

        setOldExperience(-1);
        setOldCommitMin(0);
        setOldCommitMax(0);
        setOldInfo("");

        setShow(true);
    }

    //in future, will likely take parameters of current settings and ID
    function editCard(instrument, genres: string[], experience, min, max, info){
        console.log("SETTING states in edit")
        setNewCard(false);

        var inst =  instrumentList.map((e) => { return e.value; }).indexOf(instrument);        
        setOldInstrumentId(inst);

        setOldGenreStrings(genres);
        var genreArr : {value: string, label: string}[] = [];
        genres.forEach(genre => {
            var gen =  genreList.map((e) => { return e.value; }).indexOf(genre); 
            var item = genreList.at(gen);
            if(item != undefined){
                genreArr.push(item);
            }
        });    
        setOldGenres(genreArr);

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
                    pronouns: pronouns,
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

                        setPronouns(data.pronouns)      
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
                    <Button className={globals.btn} onClick={handleEditChange}>{isEditing? "Save" : "Edit"}</Button>
                    <Col>
                        {isEditing?
                        <UserInformationEditor setShowProfileEditor={setShowProfileEditor} showProfileEditor={showProfileEditor} oldCapacity={capacity} oldBio={undefined} 
                        oldEquipment={undefined} oldSchedule={undefined} oldName={displayName} setName={setDisplayName} setCapacity={setCapacity} setBio={setBio} 
                        setEquipment={setEquipment} setSchedule={undefined} oldPronouns={pronouns} setPronouns={setPronouns}></UserInformationEditor>
                        :  <UserInformation owner={true} name={displayName} pronouns={pronouns} bio={bio} equipment={equipment} capacity={capacity} availability={undefined} profilePicture={undefined}></UserInformation> }
                    </Col>
                </Row>

                <Container className="mt-3">
                    <h2>Hobbies</h2>
                    <Button className={globals.btn} onClick={handleCreate}>New Hobby</Button> <br/>
                    <Row className='m-auto'>
                        {cards.map( (card, index) => (
                            <Col md="4" key={index+"hobbyCard"}>
                                <HobbyCard uid={AuthUser.id} setCards={setCards} index={index} instrument={card.instrument} genre={card.genres} 
                                experience={card.experience} commitMin={card.commitMin} commitMax={card.commitMax} info={card.info} owner={true} 
                                editCard={() => editCard(card.instrument, card.genres, card.experience, card.commitMin, card.commitMax, card.info)}
                                 />
                            </Col>
                        ))}
                    </Row>
                </Container>

                <Row>
                { show && (
                <HobbyCardEditor uid={AuthUser.id} setCards={setCards} setShow={setShow} show={show} newCard={newCard} oldInstrument={oldInstrumentId} oldGenre={oldGenres} oldGenreStrings={oldGenreStrings} oldExperience={oldExperience} oldCommitMin={oldCommitMin} oldCommitMax={oldCommitMax} oldInfo={oldInfo}></HobbyCardEditor>
                )}
                </Row> 

            </Container>           
        </>
    );
}

/* <HobbyCard uid={AuthUser.id} setCards={setCards} index={index} instrument={card.instrument} genre={card.genres} 
                                experience={card.experience} commitMin={card.commitMin} commitMax={card.commitMax} info={card.info} owner={true} 
                                editCard={() => editCard(card.instrument, card.genres, card.experience, card.commitMin, card.commitMax, card.info)} /> */

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