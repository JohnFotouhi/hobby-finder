import { Card, Row, Col, Button } from "react-bootstrap";
import globals from '../styles/Home.module.css'
import { BsPencil } from "react-icons/bs";
import { useRouter } from "next/router";


export default function EventCard({owner, id, title, date, time, description}){

    const router = useRouter();

    function visitEvent(){
        //visit profile of user
        //console.log(props);
        router.push({
            pathname: "/event",
            query: {eventId: id}
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

    return(
        <>
        <Card style={{marginBottom:"10px", border:"2px solid #8ac853", backgroundColor:"#f2f9ec"}} onClick={visitEvent}>
            <Card.Body>
                <Card.Title>
                    <Row>
                        <Col md={8}>
                            {title}
                        </Col>
                        <Col align="right">
                            {owner ? <Button className={globals.btn} onClick={visitEvent} style={{margin:1, height:"40px"}}><BsPencil /></Button> : null}
                        </Col>
                    </Row>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted" style={{color:"#f0c74c"}}>
                    <Row>
                        <Col>
                            {formatDate(date)}
                        </Col>
                        <Col align="left">
                            {formatTime(time)}
                        </Col>
                    </Row>
                </Card.Subtitle>
                <Col>{description} </Col>
            </Card.Body>
        </Card>
        </>
    )
}