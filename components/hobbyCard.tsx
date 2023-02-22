import { Button, Col, Container, Row, Form, Card} from "react-bootstrap";
import { BsRecordCircleFill } from "react-icons/bs";
import { BsPlayBtnFill, BsPencil, BsTrash } from "react-icons/bs";
import { useAuthUser } from "next-firebase-auth";

export default function HobbyCard({uid, setCards, index, instrument, genre, experience, commitment, info, owner, editCard}) {

    /* function playClip(){
        // Play sound clip
    } */

    function deleteCard(){
        let status;
        fetch("/api/hobbyCardDeletion", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({instrument: instrument, uid: uid})
          })
            .then((res) => {
                status = res.status;
                return res.json();
            })
            .then((data) => {
                console.log(data)
                if(status == 200){
                    console.log("SUCCESSFUL DELETION")
                    setCards(data);
                }
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