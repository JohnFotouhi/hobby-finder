import { useState } from "react";
import { Modal, Card, Row, Button, Col } from "react-bootstrap";
import globals from '../styles/Home.module.css'
import Form from 'react-bootstrap/Form';

export default function eventCreator({show, setShow, uid, setEvents}){


    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    const [noTitle, setNoTitle] = useState(false);
    const [noDate, setNoDate] = useState(false);
    const [noTime, setNoTime] = useState(false);
    const [noLocation, setNoLocation] = useState(false);
    const [noDescription, setNoDescription] = useState(false);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    }

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDate(event.target.value);
    }

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTime(event.target.value);
    }

    const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(event.target.value);
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    }

    const createCard = () => {
        setNoTitle(false);
        setNoDate(false);
        setNoTime(false);
        setNoLocation(false);
        setNoDescription(false);

        //Make sure they've selected all inputs
        if(title == ""){
            setNoTitle(true);
        }
        if(date == ""){
            setNoDate(true);
        }
        if(time == ""){
            setNoTime(true);
        }
        if(location == ""){
            setNoLocation(true);
        }
        if(description == ""){
            setNoDescription(true);
        }

        if(title && date && time && location && description){
            console.log("CREATING")
            console.log(uid);
    
            let status;
            fetch("/api/eventCreation", { 
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    ownerId: uid,
                    title: title, 
                    date: date,
                    time: time,
                    location: location,
                    description: description})
              })
                .then((res) => {
                    status = res.status;
                    return res.json();           
                })
                .then((data) => {
                    if(status == 200){
                        console.log("SUCESSFUL CREATION");
                        setEvents(data)
                        setShow(false);
                    }
                    else if(status == 409){
                        console.log(data);
                    }                
                })
                .catch(error =>{
                    console.error('Error: ', error);
                });     
        }
    }

    return(
        <>
            <Modal show={show}>
                <Card>
                <Card.Body>
                    <Card.Title> 
                        <Form.Label>Event Title</Form.Label>
                        <Form.Control type="text" onChange={handleTitleChange} placeholder="Title..."/>
                    </Card.Title>
                    {noTitle && (<p style={{color:"red", fontSize:13}}>Please name your event.</p>)}
                    <Col style={{marginTop:"10px"}}>
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" onChange={handleDateChange}/>
                    </Col>
                    {noDate && (<p style={{color:"red", fontSize:13}}>Please select a date.</p>)}
                    <Col style={{marginTop:"10px"}}> 
                        <Form.Label>Start Time</Form.Label>
                        <Form.Control type="time" onChange={handleTimeChange}/>
                    </Col>
                    {noTime && (<p style={{color:"red", fontSize:13}}>Please select a time.</p>)}
                    <Col style={{marginTop:"10px"}}>
                        <Form.Label>Location</Form.Label>
                        <Form.Control type="text" onChange={handleLocationChange} placeholder="123 Jamming Ave..."/>
                    </Col>
                    {noLocation && (<p style={{color:"red", fontSize:13}}>Please name your location.</p>)}
                    <Col style={{marginTop:"10px"}}>
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" onChange={handleDescriptionChange} as="textarea" rows={3} placeholder="Description..."/>
                    </Col>
                    {noDescription && (<p style={{color:"red", fontSize:13}}>Please describe your event.</p>)}
                    <Col style={{marginTop:"10px"}}>
                        <Button className={globals.btn} style={{marginRight:"5px"}} onClick={createCard}>Create</Button>
                        <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
                    </Col>
                </Card.Body>
                </Card>
            </Modal>
        </>
    )
}