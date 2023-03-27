import { Button, Col, Container, Row, Form, Card, Modal} from "react-bootstrap";
import { BsRecordCircleFill } from "react-icons/bs";
import { BsPlayBtnFill, BsPencil, BsTrash } from "react-icons/bs";
import globals from '../styles/Home.module.css'
import { useState } from "react";

export default function HobbyCard({uid, setCards, index, instrument, genre, experience, commitMin, commitMax, info, owner, editCard}) {

    /* function playClip(){
        // Play sound clip
    } */

    const [confirmDelete, setConfirmDelete] = useState(false);

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
                    setConfirmDelete(false)
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
        <><Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>
                    {instrument + '   '}
                    {owner ? <Button className={globals.btn} onClick={editCard}><BsPencil /></Button> : null}
                    {owner ? <Button className={globals.btn} onClick={() => setConfirmDelete(true)}><BsTrash /></Button> : null}
                </Card.Title>
                <Col> <span style={{ fontWeight: 'bold' }}>Genres: </span>{getGenreList(genre)} </Col>
                <Col> <span style={{ fontWeight: 'bold' }}>Experience:</span> {experience} </Col>
                <Col> <span style={{ fontWeight: 'bold' }}>Commitment:</span> {commitMin != commitMax ? `${commitMin} to ${commitMax} hours weekly` : `${commitMin} hours weekly`}</Col>
                <Col> <span style={{ fontWeight: 'bold' }}>Details:</span> {info} </Col>
                {/* <Col> <Button onClick={playClip}><BsPlayBtnFill/></Button> Play to hear attached clip </Col> */}
            </Card.Body>
        </Card>

        <Modal show={confirmDelete} onHide={() => setConfirmDelete(false)}>
            <Modal.Header> <Modal.Title>Are you sure you want to delete this hobby?</Modal.Title></Modal.Header>
            <Modal.Footer>
                <Button variant="danger" onClick={deleteCard}>
                    Delete
                </Button>
                <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}