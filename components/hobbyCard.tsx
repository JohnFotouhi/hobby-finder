import { Button, Col, Container, Row, Form, Card} from "react-bootstrap";
import { BsRecordCircleFill } from "react-icons/bs";
import { BsPlayBtnFill } from "react-icons/bs";
import { BsPencil } from "react-icons/bs";
import HobbyCardEditor from "./hobbyCardEditor";

export default function HobbyCard({instrument, genre, experience, commitment, info, owner}) {

   /* function playClip(){
        // Play sound clip
    } */

    function editCard(){
        // replace with a HobbyCardEditor that already has current info filled
        //var editor = <HobbyCardEditor instrument={undefined} genre={undefined} experience={undefined} commitment={undefined} info={undefined} clip={undefined}></HobbyCardEditor>                
    }

    return(
        <Card style={{ width: '18rem' }}>
        <Card.Body>
            <Card.Title> 
                {instrument} 
                { owner? <Button onClick={editCard}><BsPencil/></Button> : null}
            </Card.Title>
            <Col><BsRecordCircleFill/> {genre} </Col>
            <Col><BsRecordCircleFill/> {experience} </Col>
            <Col><BsRecordCircleFill/> {commitment} </Col>
            <Col><BsRecordCircleFill/> {info} </Col>
            {/*<Col> <Button onClick={playClip}><BsPlayBtnFill/></Button> Play to hear attached clip </Col>*/}
        </Card.Body>
        </Card>
    );
}