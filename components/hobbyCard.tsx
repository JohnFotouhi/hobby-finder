import { Button, Col, Container, Row, Form, Card} from "react-bootstrap";
import { BsRecordCircleFill } from "react-icons/bs";
import { BsPlayBtnFill, BsPencil, BsTrash } from "react-icons/bs";
import { useAuthUser } from "next-firebase-auth";

export default function HobbyCard({uid, setCards, index, instrument, genre, experience, commitMin, commitMax, info, owner, editCard}) {

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

    const getGenreList = (genres : [string]) => {
        let genreList = "";
        genres.forEach((genre, i) => {
            if(i==0){
                genreList = genreList + genre;
            }
            else{
                genreList = genreList + ", " + genre;
            }
        });
        return genreList;
    }

    return(
        <Card style={{ width: '18rem' }}>
        <Card.Body>
            <Card.Title> 
                {instrument} 
                { owner? <Button onClick={editCard}><BsPencil/></Button> : null}
                { owner? <Button onClick={deleteCard}><BsTrash/></Button> : null}
            </Card.Title>
            <Col> <span style={{fontWeight: 'bold'}}>Genres: </span>{getGenreList(genre)} </Col>
            <Col> <span style={{fontWeight: 'bold'}}>Experience:</span> {experience} </Col>
            <Col> <span style={{fontWeight: 'bold'}}>Commitment:</span> {commitMin!=commitMax? `${commitMin} to ${commitMax} hours weekly` : `${commitMin} hours weekly`}</Col>
            <Col> <span style={{fontWeight: 'bold'}}>Details:</span> {info} </Col> 
            {/* <Col> <Button onClick={playClip}><BsPlayBtnFill/></Button> Play to hear attached clip </Col> */}
        </Card.Body>
        </Card>
    );
}