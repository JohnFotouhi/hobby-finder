import HobbyCardEditor from "../components/hobbyCardEditor";
import { useEffect, useState } from "react";
import { AuthAction, init, useAuthUser, withAuthUser, withAuthUserTokenSSR } from "next-firebase-auth";
import { Button, Col, Container, Row, Spinner, Form, Stack, Alert, Navbar, Modal } from "react-bootstrap";
import FullPageLoader from "../components/FullPageLoader";
import HobbyCard from "../components/hobbyCard";
import UserInformation from "../components/userInformation";
import UserInformationEditor from '../components/userInformationEditor';
import {instrumentList, experienceList, genreList} from "../lists"
import globals from '../styles/Home.module.css'
import firebaseApp from "../config";
import { getDownloadURL, getStorage, listAll, ref, uploadBytes} from "firebase/storage";
import { BsChatRight, BsPlusLg} from "react-icons/bs";
import EventCard from "../components/eventCard";
import Link from "next/link";


const Profile = () => {

    //user credentials
    const AuthUser = useAuthUser();
    const storage = getStorage(firebaseApp);

    //loading states
    const [loadingCards, setLoadingCards] = useState(true);

    //Profile states
    const [isEditing, setIsEditing] = useState(false);
    const [capacity, setCapacity] = useState(0);
    const [bio, setBio] = useState("");
    const [availability, setAvailability] = useState([])
    const [equipment, setEquipment] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [pronouns, setPronouns] = useState("")
    const [imageRef, setImageRef] = useState("");

    //user's cards
    const [cards, setCards] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);

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

    const [capacityError, setCapacityError] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    //get user's hobby cards and profile information
    useEffect(() => {
        console.log("IN USE EFFECT");     
        getCards();
        getProfile();
        getPicture();
        getEvents();
        //console.log(imageRef)
        //setLoadingData(false);
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
            setCards(data);
            setLoadingCards(false);
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
            console.log(data.availability)
            setAvailability(data.availability);
            setCapacity(data.host);
            setEquipment(data[4]);
            setLoadingData(false);
        });               
    }

    const getEvents = () => {
        let dateTime = new Date();
        const today = dateTime.toISOString().slice(0,10);
        console.log("getting events")
        fetch("/api/personalEventsRetrieval", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({uid: AuthUser.id, today: today})
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setEvents(data);
            setLoadingData(false);
        });      
    }

    const getPicture = () => {
        //get prof pic
        const imageRef = ref(storage, `Profile Pictures/${AuthUser.id}`); 

        console.log(imageRef)
        if(imageRef != undefined){
            getDownloadURL(imageRef).then(onResolve, onReject);          
        }
    }

    function onResolve(foundURL) {
        console.log('FOUND IMAGE')
        setImageRef(foundURL)
    }
    
    function onReject(error) {
        console.log(error.code);
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
        else if(+capacity < 0){
            console.log("Set Capacity is less than 0")
            console.log("state of capacity error", capacityError);
            setCapacityError(true);
            setCapacity(0);
        }
        else{ //user has saved new information
            let status;
            getPicture();
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
                    availability: availability,
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
        { loadingData ? 
            <Container className="align-items-center mt-5 text-center">
                <Spinner animation="border" role="status"></Spinner>
            </Container> :
            <Container>
                <Row style = {{padding: 20, justifyContent: "right"}}>
                    <Col className = "col-md-1">
                        <Button className={globals.btn} onClick={handleEditChange}>{isEditing? "Save" : "Edit"}</Button>
                    </Col>
                    
                </Row>
                <Row>
                    <Col>
                        {isEditing?
                        <UserInformationEditor setShowProfileEditor={setShowProfileEditor} showProfileEditor={showProfileEditor} oldCapacity={capacity} oldBio={bio} 
                        oldEquipment={equipment} oldAvailability={availability} oldName={displayName} setName={setDisplayName} setCapacity={setCapacity} setAvailability={setAvailability} setBio={setBio} 
                        setEquipment={setEquipment} oldPronouns={pronouns} setPronouns={setPronouns} setImage={setImageRef} profilePicture={imageRef} capacityError={capacityError} setCapacityError={setCapacityError}></UserInformationEditor>
                        :  <UserInformation owner={true} name={displayName} pronouns={pronouns} bio={bio} equipment={equipment} capacity={capacity} availability={availability} profilePicture={imageRef}></UserInformation> }
                    </Col>
                </Row>

                <Container className="mt-3">
                    <Row>
                        <Col md={4}>
                        <h2>Hobbies</h2>
                        </Col>
                        <Col md={{ span: 1, offset: 7 }}>
                        <Button className={globals.btn} onClick={handleCreate}><BsPlusLg/></Button> 
                        </Col>
                        <p style={{fontSize:"14px", color:"gray"}}>Create a hobby card for any instrument you play! Users will be able to find you when
                            searching for someone with skills like yours.
                        </p>
                    </Row>
                    <Row className='m-auto' style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
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

                <Container className="mt-3" style={{marginBottom:"30px"}}>
                    <Row>
                        <h2>My Events</h2>
                        <p style={{fontSize:"14px", color:"gray"}}>Upcoming events for which you have marked yourself attending. You can find new events on the <Link href="/events">Events</Link> page.</p>
                    </Row>
                    <Row className='m-auto' style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                        {events.map( (card, index) => (
                            <Col md="4" key={index+"hobbyCard"}>                       
                                <EventCard owner={(AuthUser.id == card.ownerId)} id={card.eventId} title={card.title} date={card.date} time={card.time} description={card.description} />
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
            }           
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


