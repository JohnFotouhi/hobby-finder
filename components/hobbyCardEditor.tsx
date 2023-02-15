import { Button, Col, Container, Row, Form, Card, Modal, Dropdown} from "react-bootstrap";
import MultiselectInput from "./multiselectInput";
import { useState } from "react";
import SingleselectInput from "./singleselectinput";

export default function HobbyCardEditor({setShow, show, newCard, instrument, genre, experience, commitment, info}) {
    
    
    function saveCard(){
        // replace with a HobbyCard that has current info filled in / update FireBase

        setShow(false);
    }

    function cancelCard(){
        setShow(false);
    }

    const experienceLevels = [{label: "Low: Less than 3 years", value: "XP1"}, {label: "Medium: 3-6 years", value: "XP2"}, {label: "High: more than 6 years", value: "XP3"}];
    const instruments = [{value:'voice', label:'Voice'}, {value:'bass', label:'Bass'}, {value:'drums', label:'Drums'}]
    const genres = [{name: "Rock", id: "genre1"}, {name: "Jazz", id: "genre2"}, {name: "Classical", id: "genre3"}, {name: "Other", id: "genre0"}];
    const commitmentLevels = [{label: "Low: Less than 3 hours per week", value: "commit1"}, {label: "Medium: 3-7 hours per week", value: "commit2"}, {label: "High: more than 7 hours per week", value: "commit3"}];    
    
    return(
        // TO DO: Add inputs already there for if they're editing rather than creating
        <Modal show={show}>
            <Card style={{ width: "20rem" }}>
            <Card.Body>            
                <Card.Title> 
                    <SingleselectInput controlId={undefined} label={"Instrument"} text={""} options={instruments}/>
                </Card.Title>
                <Col><MultiselectInput
                            controlId="skillInput"
                            label="Genres"
                            text=""
                            options={genres}
                            /> </Col>
                <Col> 
                    <SingleselectInput controlId={undefined} label={"Experience"} text={""} options={experienceLevels}/>
                </Col>
                <Col>
                    <SingleselectInput controlId={undefined} label={"Commitment"} text={""} options={commitmentLevels}/>
                </Col>
                <Col><Form> 
                        <Form.Group>
                            <Form.Control type="text"/>
                            <Form.Text className="text-muted">
                            Any additional info you would like to share with users about this hobby.
                            </Form.Text>
                        </Form.Group>
                    </Form> </Col>
                <Button onClick={saveCard}> {newCard ? "Create" : "Save"} </Button>
                <Button onClick={cancelCard}>Cancel</Button>
            </Card.Body>
            </Card>
        </Modal>
    );
}


