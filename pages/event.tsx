import FullPageLoader from "@/components/FullPageLoader";
import EventCreator from "@/components/eventCreator";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Row, Col, Button, Container, Card, Modal, Spinner } from "react-bootstrap";
import { BsPencil, BsTrash } from "react-icons/bs";
import globals from '../styles/Home.module.css'

function Event(){
    
    const router = useRouter();
    const AuthUser = useAuthUser();

    const [loadingData, setLoadingData] = useState(true);

    const [show, setShow] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const [owner, setOwner] = useState(false);
    const [attending, setAttending] = useState(false);
    const [event, setEvent] = useState<any>();

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [hostName, setHostName] = useState("");
    const [hostId, setHostId] = useState("");
    const [attendees, setAttendees] = useState<any[]>([]);


    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const eventId = params.get('eventId');

        console.log(eventId)
        getEventInfo(eventId);
    }, [event])

    const getEventInfo = (eventId) => {
        console.log("GETTING EVENT INFO")
        fetch("/api/eventRetrieval", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: eventId})
        })
            .then((res) => res.json())
            .then((data) => {
            console.log(data) 
            
            setTitle(data.Title);
            setDate(data.Date);
            setTime(data.Time);
            setLocation(data.Location);
            setDescription(data.Description);
            setHostName(data.OwnerName);
            setHostId(data.OwnerId);

            if(data.OwnerId == AuthUser.id){
                setOwner(true);
            }

            setAttendees(data.Attendees);

            const i = data.Attendees.findIndex( e => e.id==AuthUser.id)
            if(i >= 0){
                setAttending(true);
            } 
            setLoadingData(false);
        });
    }

    function formatDate(date){
        var fields = date.split('-');
        const year = fields[0];
        const month = fields[1];
        const day = fields[2];

        const newDate = month + "/" + day + "/" + year;

        return newDate;
    }

    function formatTime(time){
        //https://stackoverflow.com/questions/29206453/best-way-to-convert-military-time-to-standard-time-in-javascript
        time = time.split(':');

        var hours = Number(time[0]);
        var minutes = Number(time[1]);

        let timeValue;

        if (hours > 0 && hours <= 12) {
        timeValue= "" + hours;
        } else if (hours > 12) {
        timeValue= "" + (hours - 12);
        } else if (hours == 0) {
        timeValue= "12";
        }
        
        timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
        timeValue += (hours >= 12) ? " PM" : " AM";  // get AM/PM

        return timeValue;
    }

    const editEvent = () => {
        setShow(true);
    }

    const deleteEvent = () => {
        const params = new URLSearchParams(window.location.search);
        const eventId = params.get('eventId');

        let status;
        console.log("DELETING EVENT")
        fetch("/api/eventDeletion", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: eventId})
        })
        .then((res) => {
            status = res.status;
            return (res.json());           
        })
        .then((data) => {
            console.log(status)
            if(status == 200){
                console.log("SUCESSFUL DELETION");
                router.push({
                    pathname: "/events",
                });
            }
        });

    }

    const getEventId = () => {
        const params = new URLSearchParams(window.location.search);
        const eventId = params.get('eventId');
        return eventId
    }

    const toggleAttending = () => {
        setAttending(!attending)
        console.log(attending)
        const params = new URLSearchParams(window.location.search);
        const eventId = params.get('eventId');

        console.log("TOGGLING ATTENDANCE")
        fetch("/api/attendEvent", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: eventId, uid: AuthUser.id, attending:attending})
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("attendance toggled")
                setAttendees(data);
        });
    }

    const visitProfile = (id) => {
        router.push({
            pathname: "/user",
            query: {uid: id}
        });
    }

    return(
        <>
        { loadingData ? 
        <Container className="align-items-center mt-5 text-center">
            <Spinner animation="border" role="status"></Spinner>
        </Container> :
        <Container style={{backgroundColor:"white", border:"", marginTop:"40px", borderRadius:"25px", paddingBottom:"20px"}}>
        <Container style={{marginTop:"20px", paddingBottom:"5px"}}>
            <Row>
                <Col><h1 style={{textDecoration:"underline", textDecorationColor:"#8ac853"}}>{title}</h1></Col>
                {owner?<Col align="right"><Button className={globals.btn} onClick={editEvent} style={{marginRight:"5px"}}><BsPencil/></Button>
                <Button className={globals.btn} onClick={() => setConfirmDelete(true)}><BsTrash/></Button></Col>:null}
            </Row>
            <Row>
                <h6>Event hosted by <Link style={{color:"black"}} href="#" onClick={() => visitProfile(hostId)} >{hostName}</Link></h6>
            </Row>
        </Container>

        <Container style={{padding:"10px", backgroundColor:"#f2f9ec", border:"1px solid #8ac853", borderRadius:"15px",}}>
            <Row>
                <Col><h5>{formatDate(date)},  {formatTime(time)}</h5></Col>
                <Col><h5>{location}</h5></Col>
            </Row>
            <Row style={{marginLeft:"4px"}}>{description}</Row>
        </Container>

        <Container style={{marginTop:"10px"}}>
            <Row>
                <Col><h5>Attendees:</h5></Col> 
                <Col align="right"> {owner? <span></span>: <Button style={{color:"white"}} className={!attending? globals.btn : ""} variant={attending? "secondary" : ""} onClick={toggleAttending}>{attending? "Count me out": "I'm in!"}</Button>} </Col>
                <Row className='m-auto' style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                    {attendees.map( (person, index) => (
                        <Col md="2" key={index+"hobbyCard"}>                       
                            <Link style={{color:"black"}} href="#" onClick={() => visitProfile(person.id)} >{person.name}</Link>
                        </Col>
                    ))}
                </Row>
                
            </Row>
        </Container>
        </Container> }

        <Row>
        { show && (
        <EventCreator show={show} setShow={setShow} uid={AuthUser.id} eventId={getEventId()} setEvents={undefined} setEvent={setEvent} newEvent={false} oldTitle={title} oldDate={date} oldTime={time} oldLocation={location} oldDescription={description}></EventCreator>
        )}
        </Row>

        <Modal show={confirmDelete} onHide={() => setConfirmDelete(false)}>
            <Modal.Header> <Modal.Title>Are you sure you want to delete this Event?</Modal.Title></Modal.Header>
            <Modal.Footer>
                <Button variant="danger" onClick={deleteEvent}>
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

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: FullPageLoader
  })(Event)


