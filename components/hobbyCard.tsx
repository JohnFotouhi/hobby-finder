import { Button, Col, Container, Row, Form, Card} from "react-bootstrap";
import { BsRecordCircleFill } from "react-icons/bs";
import { BsPlayBtnFill, BsPencil, BsTrash } from "react-icons/bs";
import { useAuthUser } from "next-firebase-auth";
import { Auth } from "firebase-admin/lib/auth/auth";

export default function HobbyCard({instrument, genre, experience, commitment, info, owner, editCard}) {

    //user credentials
    const AuthUser = useAuthUser();
    console.log(AuthUser);
    
    /* function playClip(){
        // Play sound clip
    } */

    function deleteCard(){
        fetch("/api/hobbyCardDeletion", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({instrument: instrument, uid: AuthUser.id})
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
          });
    }

    return(
        <Card style={{ width: '18rem' }}>
        <Card.Body>
            <Card.Title> 
                {instrument} 
                { owner? <Button onClick={editCard}><BsPencil/></Button> : null}
                { owner? <Button onClick={deleteCard}><BsTrash/></Button> : null}
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