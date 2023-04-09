import FullPageLoader from "@/components/FullPageLoader";
import firebaseApp from "@/config";
import { getEventListeners } from "events";
import { getStorage } from "firebase/storage";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";
import { useEffect, useState } from "react";
import { Row, Col, Button, Container } from "react-bootstrap";
import globals from '../styles/Home.module.css'
import { BsFunnelFill, BsSearch } from "react-icons/bs";
import EventCard from "../components/eventCard";
import { useRouter } from "next/router";
import EventCreator from "../components/eventCreator";


const Events = () => {

    //user credentials
    const AuthUser = useAuthUser();
    const storage = getStorage(firebaseApp);

    //event status
    const [events, setEvents] = useState<any[]>([]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        getEvents();
    }, []);

    const getEvents = () => {
        //get eventId, title, description
        console.log("GETTING EVENtS")
        fetch("/api/eventCardRetrieval", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({})
        })
            .then((res) => res.json())
            .then((data) => {
            console.log(data)
            setEvents(data);
        });
    }

    function handleEditFilters(){
       
    }


    return(
        <>
        <Container>
            <Row style={{marginTop:"25px"}}>
                <Col>
                    <h1>Events</h1>                
                </Col>
                <Col align="right">
                    <Button className={globals.btn} onClick={handleEditFilters} style={{marginRight: "5px"}}><BsFunnelFill/></Button>
                    <Button className={globals.btn} onClick={() => setShow(true)} style={{marginLeft: "5px"}}>Add an Event</Button>
                </Col>
            </Row>

            <Container className="mt-3">
                <Row className='m-auto' style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                    {events.map( (card, index) => (
                        <Col md="4" key={index+"hobbyCard"}>                       
                            <EventCard owner={(AuthUser.id == card.ownerId)} id={card.eventId} title={card.title} date={card.date} time={card.time} description={card.description} />
                        </Col>
                    ))}
                </Row>
            </Container>
        </Container>

        <Row>
        { show && (
        <EventCreator show={show} setShow={setShow} uid={AuthUser.id} setEvents={setEvents} setEvent={undefined} newEvent={true} oldTitle={undefined} oldDate={undefined} oldTime={undefined} oldLocation={undefined} oldDescription={undefined}></EventCreator>
        )}
        </Row> 

        </>
    );
}


export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: FullPageLoader,
  })(Events)

