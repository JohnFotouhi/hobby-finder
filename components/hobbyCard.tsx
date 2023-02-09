import { Button, Col, Container, Row, Form, Card} from "react-bootstrap";
import { BsRecordCircleFill } from "react-icons/bs";
import { BsPlayBtnFill } from "react-icons/bs";

export default function HobbyCard({instrument, genre, experience, commitment, info, clip}) {

    function playClip(){
        // Play sound clip
    }

    return(
        <Card.Body>
            <Card.Title> {instrument} </Card.Title>
            <Col><BsRecordCircleFill/> {genre} </Col>
            <Col><BsRecordCircleFill/> {experience} </Col>
            <Col><BsRecordCircleFill/> {commitment} </Col>
            <Col><BsRecordCircleFill/> {info} </Col>
            <Col> <Button onClick={playClip}><BsPlayBtnFill/></Button> Play to hear attached clip </Col>
        </Card.Body>
    );
}