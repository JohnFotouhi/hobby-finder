import { useEffect, useState } from "react";
import { Button, Card, ListGroup, Table } from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs";
import { useRouter } from "next/router";
import { getDownloadURL, getStorage, ref} from "firebase/storage";
import firebaseApp from "../config";
import user from "@/pages/user";
import { updateProfile } from 'firebase/auth';
import { useAuthUser } from "next-firebase-auth";


export default function SearchCard(props){
    const router = useRouter();
    const [cards, setCards] = useState([]);
    const [genres, setGenres] = useState([]);
    const [availability, setAvailability] = useState<any[]>([]);
    const [relationshipStatus, setRelationshipStatus] = useState("");
    const [relButtonVariant, setRelButtonVariant] = useState("");
    const [relButtonDisabled, setRelButtonDisabled] = useState(false);
    const [relButtonText, setRelButtonText] = useState("");
    const [relButtonAction, setRelButtonAction] = useState("none");
    const [imageRef, setImageRef] = useState("");
    const [distance, setDistance] = useState("");
    const storage = getStorage(firebaseApp);
    const AuthUser = useAuthUser();
    

    function visitProfile(){
        //visit profile of user
        console.log(props);
        router.push({
            pathname: "/user",
            query: {uid: props.authId}
        });
    }

    function deg2rad(deg){ // Convert Degrees to Radians
        return deg * (Math.PI/180);
    }
    function calculateDistance(lat1, long1, lat2, long2){ // Calculate distance in kilometers between points
        var R = 3958.756; // Radius of the earth in miles
        var dLat = deg2rad(lat2-lat1);
        var dLon = deg2rad(long2-long1); 
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
            ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
    }

    function onResolve(foundURL) {
        console.log('FOUND IMAGE')
        setImageRef(foundURL)
    }
    
    function onReject(error) {
        console.log(error.code);
    }

    useEffect(() => {
        switch (relationshipStatus) {
            case 'none':
            setRelButtonVariant("primary");
            setRelButtonDisabled(false);
            setRelButtonText("Request");
            setRelButtonAction("request");
            break;
            case 'pending':
            setRelButtonVariant("primary");
            setRelButtonDisabled(false);
            setRelButtonText("Accept");
            setRelButtonAction("accept");
            break;
            case 'respond':
            setRelButtonVariant("primary");
            setRelButtonDisabled(true);
            setRelButtonText("Pending");
            setRelButtonAction("none");
            break;
            case 'blocked':
            setRelButtonVariant("danger");
            setRelButtonDisabled(false);
            setRelButtonText("Unblock");
            setRelButtonAction("unblock");
            break;
            case 'sentBlock':
            setRelButtonVariant("danger");
            setRelButtonDisabled(true);
            setRelButtonText("Blocked");
            setRelButtonAction("none");
            break;
            case 'friends':
            setRelButtonVariant("secondary");
            setRelButtonDisabled(false);
            setRelButtonText("Unfriend");
            setRelButtonAction("unfriend");
            break;
            default:
            console.log('Could not parse relationship, status is: ' + relationshipStatus);
        }
    }, [relationshipStatus])

    useEffect(() => {

        console.log(props);
        let instruments = props.instruments.map(card => card.instrument);
        setCards(instruments);

        let genres = props.instruments.map(card => card.genres);
        setGenres(genres);

        var days: any[] = [];
        for(var day in props.availability) {
            days.push(day);
        }
        setAvailability(days);

        const imageRef = ref(storage, `Profile Pictures/${props.authId}`); 
        if(imageRef != undefined){
            getDownloadURL(imageRef).then(onResolve, onReject);          
        }

        const relationship = props.relationships?.find(relationship => relationship.key === AuthUser.id);
        console.log(relationship);
        if(typeof(relationship?.status) === "undefined"){
            setRelationshipStatus("none");
        }
        else{
            setRelationshipStatus(relationship.status);
        }

        let theirLocation = props.location;
        let myLocation = props.myLocation;
        if(typeof(theirLocation.latitude) !== "undefined" && typeof(theirLocation.longitude) !== "undefined" && typeof(myLocation.latitude) !== "undefined" && typeof(myLocation.longitude) !== "undefined"){
            let newDist = calculateDistance(theirLocation.latitude, theirLocation.longitude, myLocation.latitude, myLocation.longitude);
            let roundDist = newDist.toFixed(2);
            setDistance(roundDist);
        }
    }, []);

    function updateRelationshipStatus(action) {
        fetch("/api/relationshipUpdate", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},     
            body: JSON.stringify({myKey: AuthUser.id, theirKey: props.authId, action: action})
        })
            .then((res) => res.json())
            .then((data) => {  
                setRelationshipStatus(data.newStatus);
        });     
    }

    return(
        <Card onClick={visitProfile} style={{ cursor: "pointer" }} className="mt-2">
            <Card.Body className="mx-auto">
                <div className="text-center">
                    {/* <BsPersonCircle size="128" className="mb-2"/> */}
                    {imageRef ? (
                            <img src={imageRef} width={128} height={128} alt="Profile Picture" className="rounded-circle border border-secondary" />
                        ) : (
                            <BsPersonCircle size={128} />
                    )}
                    <Card.Title>{props.name} {props.pronouns !== "" && "(" + props.pronouns + ")"}</Card.Title>
                </div>
                <Card.Text className="text-center">
                    {props.bio}
                </Card.Text>
                <ListGroup variant="flush">
                    <ListGroup.Item className="text-center">{distance !== "" && distance + " miles away"}<br/><Button variant={relButtonVariant} disabled={relButtonDisabled} onClick={() => {updateRelationshipStatus(relButtonAction)}}>{relButtonText}</Button></ListGroup.Item>
                    <ListGroup.Item>Instruments: {cards.join(', ')}</ListGroup.Item>
                    <ListGroup.Item>Genres: {genres.join(', ')}</ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    )
}