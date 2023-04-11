import { Button, Col, Container, Row, Form, Modal } from "react-bootstrap";
import FormInput from "./formInput";
import { useState } from "react";
import MultiselectInput from "./multiselectInput";
import { genreList, experienceList } from "../lists";
import globals from '@/styles/Home.module.css'


export default function Filters({show, setShow, filters, setFilters, ...props}){
    
    const [distance, setDistance] = useState(10);
    const [experienceLevels, setExperienceLevels] = useState([]);
    const [genre, setGenre] = useState([]);
    const [commitmentLevels, setCommitmentLevels] = useState([]);
    const [commitMin, setCommitMin] = useState(0);
    const [commitMax, setCommitMax] = useState(0);
    
    function objectifyArray(array, name){
        let objectArray = array.map(function(item, index){
            return {name: item.value, id: name + index}
        });
        return objectArray;
    }

    const experienceLevelOptions = objectifyArray(experienceList, "experience");
    const genreOptions = objectifyArray(genreList, "genre");

    function handleClose(){
        setDistance(filters.distance);
        setGenre(filters.genres);
        setCommitmentLevels(filters.commitmentLevels);
        setExperienceLevels(filters.experienceLevels);
        setShow(false);
    }

    function handleSave(){
        let filters = {
            experienceLevels: experienceLevels,
            genres: genre,
            commitmentLevels: commitmentLevels,
            distance: distance,
            commitMax: commitMax,
            commitMin: commitMin
        }
        setFilters(filters);
        setShow(false);
    }

    function handleClear(){
        setCommitMax(0);
        setCommitMin(0);
        setCommitmentLevels([]);
        setGenre([]);
        setExperienceLevels([]);
        setDistance(10);
    }

 return(
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Container>
                    <Row>
                        <Col>
                            <MultiselectInput
                            controlId="genreInput"
                            label="Genre of Music"
                            text=""
                            options={genreOptions}
                            selected={genre} 
                            setSelected={setGenre}
                            />
                        </Col>
                        <Col>
                            <MultiselectInput
                            controlId="experienceInput"
                            label="Experience Level"
                            text=""
                            options={experienceLevelOptions}
                            selected={experienceLevels} 
                            setSelected={setExperienceLevels}
                            />
                        </Col>
                        {/* <Col>
                            <FormInput controlId="distanceInput" label="Distance" type="number" placeholder="" text="Max. distance in miles" value={distance} setValue={setDistance} min={1} />
                        </Col> */}
                        <Col>
                            <FormInput controlId="commitmentMin" label="Min Commitment" type="number" placeholder="" text="Hours Per Week" value={commitMin} setValue={setCommitMin} min={1} />
                        </Col>
                        <Col>
                            <FormInput controlId="commitmentMax" label="Max Commitment" type="number" placeholder="" text="Hours Per Week" value={commitMax} setValue={setCommitMax} min={1} />
                        </Col>
                        <Col>
                            <FormInput controlId="distance" label="Distance" type="number" placeholder="" text="Miles" value={distance} setValue={setDistance} min={1} />
                        </Col>
                    </Row>
                </Container>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClear}>Clear</Button>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button className={globals.btn} variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
    </Modal>
 );
}