import { useEffect, useState } from "react";
import { Card, ListGroup, Table } from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs";
import { useRouter } from "next/router";
import user from "@/pages/user";


export default function SearchCard(props){
    const router = useRouter();
    const [cards, setCards] = useState([]);
    const [genres, setGenres] = useState([]);
    const [availability, setAvailability] = useState<any[]>([]);
    function visitProfile(){
        //visit profile of user
        console.log(props);
        router.push({
            pathname: "/user",
            query: {uid: props.authId}
        });
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
    }, []);

    return(
        <Card onClick={visitProfile} style={{ cursor: "pointer" }} className="mt-2">
            <Card.Body className="mx-auto">
                <div className="text-center">
                    <BsPersonCircle size="128" className="mb-2"/>
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