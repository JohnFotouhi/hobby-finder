import FullPageLoader from "@/components/FullPageLoader";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Row, Col, Button, Container } from "react-bootstrap";
import { BsPencil, BsTrash } from "react-icons/bs";


function Event(){

    const [owner, setOwner] = useState(false);
    const [attending, setAttending] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const eventId = params.get('eventId');
        console.log(eventId)
    }, [])

    const editEvent = () => {

    }

    const deleteEvent = () => {

    }

    return(
        <>
        <Container style={{borderBottom:"1px solid gray", marginTop:"50px", paddingBottom:"5px"}}>
            <Row>
                <Col><h1>Title</h1></Col>
                {owner?<Col><Button onClick={editEvent}><BsPencil/></Button>
                <Button onClick={deleteEvent}><BsTrash/></Button></Col>:null}
            </Row>
            <Row>
                <h5>Event hosted by <Link href={""}>user</Link></h5>
            </Row>
        </Container>
        <Container style={{marginTop:"10px"}}>
            <Row>
                <Col><h4>Date, Time</h4></Col>
                <Col><h4>Location</h4></Col>
            </Row>
        </Container>
        <Container style={{marginTop:"10px"}}>
            <Row>Description</Row>
        </Container>
        <Container style={{marginTop:"10px"}}>
            <Row>
                <Col>Attendees:</Col>
                {owner? null: <Col><Button>{attending? "Count me out": "I'm in!"}</Button></Col>}
            </Row>
            <Row>List of Attendees</Row>
        </Container>
        </>
    );
}

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: FullPageLoader
  })(Event)


