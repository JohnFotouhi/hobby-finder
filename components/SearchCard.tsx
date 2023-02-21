import { useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs";


export default function SearchCard(props){
    function visitProfile(){
        //visit profile of user
    }
    console.log(props);
    return(
        <Card onClick={visitProfile} style={{ cursor: "pointer" }} className="mt-2">
            <Card.Body className="mx-auto">
                <div className="text-center">
                    <BsPersonCircle size="128" className="mb-2"/>
                    <Card.Title>{props.name}</Card.Title>
                </div>
                <ListGroup variant="flush">
                    <ListGroup.Item>Skills: {props.skills}</ListGroup.Item>
                    <ListGroup.Item>Genres: {props.genre}</ListGroup.Item>
                    <ListGroup.Item>Time Commitment: {props.commitment}</ListGroup.Item>
                    <ListGroup.Item>Experience: {props.experience}</ListGroup.Item>
                    <ListGroup.Item>Distance: {props.distance}</ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    )
}