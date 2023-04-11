import { Button, Col, Container, Row, Form, Stack, Alert, Navbar, Spinner } from "react-bootstrap";
import HobbyCard from "../components/hobbyCard";
import { useAuthUser, AuthAction, withAuthUser } from "next-firebase-auth";
import UploadImage from "../components/uploadImage";
import UserInformation from "../components/userInformation";
import { useEffect, useState } from "react";
import firebaseApp from "../config";
import { getAuth } from "firebase/auth";
import { APP_BUILD_MANIFEST } from "next/dist/shared/lib/constants";
import { DatabaseService } from "firebase-admin/lib/database/database";
//import perry from "../public/User_images/perry.png";
import { getDownloadURL, getStorage, listAll, ref, uploadBytes} from "firebase/storage";
import FullPageLoader from "../components/FullPageLoader";



function User() {

    const storage = getStorage(firebaseApp);

    const [capacity, setCapacity] = useState("");
    const [bio, setBio] = useState("");
    const [equipment, setEquipment] = useState("");
    const [availability, setAvailability] = useState([]);
    const [displayName, setDisplayName] = useState("");
    const [imageRef, setImageRef] = useState("");
    const [userKey, setUserKey] = useState("");

    const [loadingCards, setLoadingCards] = useState(true);
    const [loadingData, setLoadingData] = useState(true);
    const [relationshipStatus, setRelationshipStatus] = useState("");
    const [relButtonVariant, setRelButtonVariant] = useState("");
    const [relButtonDisabled, setRelButtonDisabled] = useState(false);
    const [relButtonText, setRelButtonText] = useState("");
    const [relButtonAction, setRelButtonAction] = useState("none");
    const AuthUser = useAuthUser();
    console.log(AuthUser);

    //user's cards
    const [cards, setCards] = useState<any[]>([]);
    const [status, setStatus] = useState<any>();
    const params = new URLSearchParams(window.location.search);
    const uid = params.get('uid');
    console.log("uid", uid);

    useEffect(() => {

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
            setAvailability(data.availability);
            setCapacity(data.host);
            setEquipment(data[4]);
            setUserKey(data.key)
            setLoadingData(false);
        });

        getRelationshipStatus(uid);
        getPicture();
    }, [])

    useEffect(() => {
        switch (relationshipStatus) {
            case 'none':
            setRelButtonVariant("primary");
            setRelButtonDisabled(false);
            setRelButtonText("Send Friend Request");
            setRelButtonAction("request");
            break;
            case 'pending':
            setRelButtonVariant("primary");
            setRelButtonDisabled(true);
            setRelButtonText("Already Reached Out");
            setRelButtonAction("none");
            break;
            case 'respond':
            setRelButtonVariant("primary");
            setRelButtonDisabled(false);
            setRelButtonText("Accept Friend Request");
            setRelButtonAction("accept");
            break;
            case 'blocked':
            setRelButtonVariant("danger");
            setRelButtonDisabled(true);
            setRelButtonText("You have been blocked");
            setRelButtonAction("none");
            break;
            case 'sentBlock':
            setRelButtonVariant("danger");
            setRelButtonDisabled(false);
            setRelButtonText("Unblock");
            setRelButtonAction("unblock");
            break;
            case 'friends':
            setRelButtonVariant("secondary");
            setRelButtonDisabled(false);
            setRelButtonText("Remove friend");
            setRelButtonAction("unfriend");
            break;
            default:
            console.log('Could not parse relationship, status is: ' + relationshipStatus);
        }
    }, [relationshipStatus])

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
                setRelationshipStatus(data.status)
        });
    }
    
    function updateRelationshipStatus(action) {
        console.log("UPDATING REL STATUS")

        fetch("/api/relationshipUpdate", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},     
            body: JSON.stringify({myKey: AuthUser.id, theirKey: uid, action: action})
        })
            .then((res) => res.json())
            .then((data) => {  
                setRelationshipStatus(data.newStatus);
        });     
    }

    function onResolve(foundURL) {
        console.log('FOUND IMAGE')
        setImageRef(foundURL)
    }
    
    function onReject(error) {
        console.log(error.code);
    }

    const getPicture = () => {
        //get prof pic
        const imageRef = ref(storage, `Profile Pictures/${uid}`); 

        if(imageRef != undefined){
            getDownloadURL(imageRef).then(onResolve, onReject);          
        }
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
                    <UserInformation owner={true} name={displayName} pronouns={""} bio={bio} equipment={equipment} capacity={capacity} availability={availability} profilePicture={imageRef}></UserInformation>
                </Col>
            </Row>
            <Container className="mt-3">
            <Col> <Button variant={relButtonVariant} disabled={relButtonDisabled} onClick={() => {updateRelationshipStatus(relButtonAction)}}>{relButtonText}</Button> </Col>
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
