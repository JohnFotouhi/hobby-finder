import { Button, Col, Container, Row, Form, Card} from "react-bootstrap";
import { BsRecordCircleFill } from "react-icons/bs";
import { BsPlayBtnFill } from "react-icons/bs";
import { BsCheckSquareFill } from "react-icons/bs";
import MultiselectInput from "./multiselectInput";

export default function HobbyCardEditor({instrument, genre, experience, commitment, info, clip}) {

    function playClip(){
        // Play sound clip
    }

    function saveCard(){
        // replace with a HobbyCard that has current info filled in
    }

    const experienceLevels = [{name: "Low: Less than 3 years", id: "XP1"}, {name: "Medium: 3-6 years", id: "XP2"}, {name: "High: more than 6 years", id: "XP3"}];
    const instruments = [{name: "Voice", id: "skill1"}, {name: "Guitar", id: "skill2"}, {name: "Piano", id: "skill3"}, {name: "Other", id: "skill0"}];
    const genres = [{name: "Rock", id: "genre1"}, {name: "Jazz", id: "genre2"}, {name: "Classical", id: "genre3"}, {name: "Other", id: "genre0"}];
    const commitmentLevels = [{name: "Low: Less than 3 hours per week", id: "commit1"}, {name: "Medium: 3-7 hours per week", id: "commit2"}, {name: "High: more than 7 hours per week", id: "commit3"}];    
    
    return(
        // TO DO: Add inputs already there for if they're editing rather than creating
        <Card style={{ width: '20rem' }}>
        <Card.Body>            
            <Card.Title> Dropdown for Instruments </Card.Title>
            <Col><BsRecordCircleFill/> <MultiselectInput
                        controlId="skillInput"
                        label="Skills"
                        text=""
                        options={genres}
                        /> </Col>
            <Col><BsRecordCircleFill/> Dropdown for Instruments </Col>
            <Col><BsRecordCircleFill/> Dropdown for Commitment Levels </Col>
            <Col><BsRecordCircleFill/> <Form> 
                    <Form.Group>
                        <Form.Control type="text"/>
                        <Form.Text className="text-muted">
                        Any additional info you'd like to share with users about this hobby.
                        </Form.Text>
                    </Form.Group>
                </Form> </Col>
            <Col> <Button onClick={playClip}><BsPlayBtnFill/></Button> Play to hear attached clip. INSERT some sort of thing to change clip here. </Col>
            <Button onClick={saveCard}><BsCheckSquareFill/></Button>
        </Card.Body>
        </Card>
    );
}