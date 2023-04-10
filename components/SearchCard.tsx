import { useEffect, useState } from "react";
import { Card, ListGroup, Table } from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs";
import { useRouter } from "next/router";
import { getDownloadURL, getStorage, ref} from "firebase/storage";
import firebaseApp from "../config";
import user from "@/pages/user";
import { updateProfile } from 'firebase/auth';


export default function SearchCard(props){
    const router = useRouter();
    const [cards, setCards] = useState([]);
    const [genres, setGenres] = useState([]);
    const [availability, setAvailability] = useState<any[]>([]);
    const [imageRef, setImageRef] = useState("");
    const storage = getStorage(firebaseApp);
    

    function visitProfile(){
        //visit profile of user
        console.log(props);
        router.push({
            pathname: "/user",
            query: {uid: props.authId}
        });
    }

    function onResolve(foundURL) {
        console.log('FOUND IMAGE')
        setImageRef(foundURL)
    }
    
    function onReject(error) {
        console.log(error.code);
    }

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

        const imageRef = ref(storage, `Profile Pictures/${props.id}`); 
        if(imageRef != undefined){
            getDownloadURL(imageRef).then(onResolve, onReject);          
        }
    }, []);

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
                    <ListGroup.Item>Instruments: {cards.join(', ')}</ListGroup.Item>
                    <ListGroup.Item>Genres: {genres.join(', ')}</ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    )
}