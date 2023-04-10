import { Button, Col, Container, Row, Form, Modal } from "react-bootstrap";
import FormInput from "./formInput";
import { useState } from "react";
import { CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH } from "next/dist/shared/lib/constants";

export default function Filters({show, setShow, setFilters, setEvents}){
    
    const [dateMin, setDateMin] = useState("");
    const [dateMax, setDateMax] = useState("");
    const [timeMin, setTimeMin] = useState("");
    const [timeMax, setTimeMax] = useState("");

    const [dateErr, setDateErr] = useState(false);
    const [timeErr, setTimeErr] = useState(false);


    function handleClose(){
        setShow(false);
    }

    function handleClear(){
        setDateErr(false);
        setTimeErr(false);
        setDateMin("")
        setDateMax("")
        setTimeMin("")
        setTimeMax("")
    }

    function handleSave(){
        setDateErr(false);
        setTimeErr(false);
        let filters = {
            dateMin: dateMin,
            dateMax: dateMax,
            timeMin: timeMin,
            timeMax: timeMax
        }
        setFilters(filters);
        console.log(filters)
        if(dateMin > dateMax){
            setDateErr(true);
        }
        if(timeMin > timeMax){
            setTimeErr(true);
        }
        if((dateMin <= dateMax) && (timeMin <= timeMax)){
            //handleFiltering(filters)
            setShow(false);
        }
    }

    const handleFiltering = (filters) => {
        fetch("/api/filterEvents", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({filters: filters})
          })
        .then((res) => res.json())
        .then((data) => {
            setEvents(data);
        });
    }

    return(
        <>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Container>
                    <Row>
                        <Col>
                            <FormInput controlId="dateMin" label="Date Range" type="date" placeholder="" text="" value={dateMin} setValue={setDateMin}/>
                        </Col>
                        <Col>
                            <FormInput controlId="dateMax" label=" " type="date" placeholder="" text="" value={dateMax} setValue={setDateMax} min={dateMin}/>
                        </Col>
                        {dateErr && (<p style={{color:"red", fontSize:13}}>Your start date must be before your end date.</p>)}
                        <Col>
                            <FormInput controlId="timeMin" label="Time Range" type="time" placeholder="" text="" value={timeMin} setValue={setTimeMin}/>
                        </Col>
                        <Col>
                            <FormInput controlId="timeMax" label=" " type="time" placeholder="" text="" value={timeMax} setValue={setTimeMax}/>
                        </Col>
                        {timeErr && (<p style={{color:"red", fontSize:13}}>Your start time must be before your end time.</p>)}
                    </Row>
                </Container>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClear}>Clear</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
        </Modal>
    </>
    );
}