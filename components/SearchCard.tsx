import { useEffect, useState } from "react";
import { Card, ListGroup, Table } from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs";
import { useRouter } from "next/router";


export default function SearchCard(props){
    const router = useRouter();
    const [skills, setSkills] = useState([]);
    const [genres, setGenres] = useState([]);
    const [availability, setAvailability] = useState<any[]>([]);
    // const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    function visitProfile(){
        //visit profile of user
        router.push('/user');
    }

    useEffect(() => {
        let skills = props.skills.map(skill => skill.name);
        setSkills(skills);

        let genres = props.skills.map(skill => skill.genre);
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
                    <Card.Title>{props.name} ({props.pronouns})</Card.Title>
                </div>
                <Card.Text className="text-center">
                    {props.bio}
                </Card.Text>
                <ListGroup variant="flush">
                    <ListGroup.Item>Skills: {skills.join(', ')}</ListGroup.Item>
                    <ListGroup.Item>Genres: {genres.join(', ')}</ListGroup.Item>
                    <ListGroup.Item>Availability: {availability.join(', ')}</ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    )
}