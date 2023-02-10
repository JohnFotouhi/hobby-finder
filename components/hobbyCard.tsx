import { Button, Col, Container, Row, Form, Card} from "react-bootstrap";
import { BsRecordCircleFill } from "react-icons/bs";
import { BsPlayBtnFill } from "react-icons/bs";
import { BsPencil } from "react-icons/bs";


export default function HobbyCard({instrument, genre, experience, commitment, info, clip, owner}) {

    function playClip(){
        // Play sound clip
    }

    function editCard(){
        // replace with a HobbyCardEditor that already has current info filled
    }

    return(
        <Card style={{ width: '18rem' }}>
        <Card.Body>
            { owner? <Button onClick={editCard}><BsPencil/></Button> : null}
            <Card.Title> {instrument} </Card.Title>
            <Col><BsRecordCircleFill/> {genre} </Col>
            <Col><BsRecordCircleFill/> {experience} </Col>
            <Col><BsRecordCircleFill/> {commitment} </Col>
            <Col><BsRecordCircleFill/> {info} </Col>
            <Col> <Button onClick={playClip}><BsPlayBtnFill/></Button> Play to hear attached clip </Col>
        </Card.Body>
        </Card>
    );
}