import { Button, Col, Container, Row, Form, Card, Modal, Dropdown} from "react-bootstrap";
import { BsRecordCircleFill } from "react-icons/bs";
import { BsPlayBtnFill } from "react-icons/bs";
import { BsCheckSquareFill } from "react-icons/bs";
import MultiselectInput from "./multiselectInput";
import { useState } from "react";
import SingleselectInput from "./singleselectinput";

export default function HobbyCardEditor({instrument, genre, experience, commitment, info}) {

    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);

    const handleShow = () => setShow(true);

    function saveCard(){
        handleClose();
        // replace with a HobbyCard that has current info filled in / update FireBase
    }

    const experienceLevels = [{name: "Low: Less than 3 years", id: "XP1"}, {name: "Medium: 3-6 years", id: "XP2"}, {name: "High: more than 6 years", id: "XP3"}];
    const instruments = [{name: "Voice", id: "skill1"}, {name: "Guitar", id: "skill2"}, {name: "Piano", id: "skill3"}, {name: "Other", id: "skill0"}];
    const genres = [{name: "Rock", id: "genre1"}, {name: "Jazz", id: "genre2"}, {name: "Classical", id: "genre3"}, {name: "Other", id: "genre0"}];
    const commitmentLevels = [{name: "Low: Less than 3 hours per week", id: "commit1"}, {name: "Medium: 3-7 hours per week", id: "commit2"}, {name: "High: more than 7 hours per week", id: "commit3"}];    
    
    return(
        // TO DO: Add inputs already there for if they're editing rather than creating
        <Modal onHide={handleClose}>
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
                <Button onClick={saveCard}><BsCheckSquareFill/></Button>
            </Card.Body>
            </Card>
        </Modal>
    );
}