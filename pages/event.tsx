import FullPageLoader from "@/components/FullPageLoader";
import EventCreator from "@/components/eventCreator";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { Row, Col, Button, Container, Card } from "react-bootstrap";
import { BsPencil, BsTrash } from "react-icons/bs";


function Event(){
    
    const AuthUser = useAuthUser();

    const [show, setShow] = useState(false);
    const [owner, setOwner] = useState(false);
    const [attending, setAttending] = useState(false);

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [hostName, setHostName] = useState("");
    const [hostId, setHostId] = useState("");
    const [attendees, setAttendees] = useState([]);


    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const eventId = params.get('eventId');

        console.log(eventId)
        getEventInfo(eventId);
    }, [])

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

    }

    const visitProfile = () => {
        router.push({
            pathname: "/user",
            query: {uid: hostId}
        });
    }

    return(
        <>

        <Container style={{borderBottom:"1px solid gray", marginTop:"50px", paddingBottom:"5px"}}>
            <Row>
                <Col><h1>{title}</h1></Col>
                {owner?<Col><Button onClick={editEvent}><BsPencil/></Button>
                <Button onClick={deleteEvent}><BsTrash/></Button></Col>:null}
            </Row>
            <Row>
                <h5>Event hosted by <Link href="#" onClick={visitProfile} >{hostName}</Link></h5>
            </Row>
        </Container>
        <Container style={{marginTop:"10px"}}>
            <Row>
                <Col><h4>{formatDate(date)},  {formatTime(time)}</h4></Col>
                <Col><h4>{location}</h4></Col>
            </Row>
        </Container>
        <Container style={{marginTop:"10px"}}>
            <Row>{description}</Row>
        </Container>
        <Container style={{marginTop:"10px"}}>
            <Row>
                <Col>Attendees:</Col>
                {owner? undefined: <Col><Button>{attending? "Count me out": "I'm in!"}</Button></Col>}
            </Row>
            <Row>{attendees}</Row>
        </Container>

        <Row>
        { show && (
        <EventCreator show={show} setShow={setShow} uid={AuthUser.id} setEvents={undefined} getInfo={getEventInfo} newEvent={false} oldTitle={title} oldDate={date} oldTime={time} oldLocation={location} oldDescription={description}></EventCreator>
        )}
        </Row> 
        </>
    );
}

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: FullPageLoader
  })(Event)


