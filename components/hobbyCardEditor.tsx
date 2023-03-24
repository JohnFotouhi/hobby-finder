import { Button, Col, Container, Row, Form, Card, Modal, Dropdown, InputGroup} from "react-bootstrap";
import MultiselectInput from "./multiselectInput";
import React, { useEffect, useState } from "react";
import SingleselectInput from "./singleselectinput";
import FormInput from "./formInput";
import { optionCSS } from "react-select/dist/declarations/src/components/Option";
import {instrumentList, genreList, experienceList} from "../lists"
import { BsMinecart } from "react-icons/bs";
import { exit } from "process";
import { info } from "console";
import globals from '../styles/Home.module.css'

export default function HobbyCardEditor({uid, setCards, setShow, show, newCard, oldInstrument, oldGenre, oldGenreStrings, oldExperience, oldCommitMin, oldCommitMax, oldInfo}) {
    
    const [instrumentSelect, setInstrument] = useState({});
    const [experienceSelect, setExperience] = useState({});
    const [commitMinSelect, setCommitMin] = useState(0);
    const [commitMaxSelect, setCommitMax] = useState(0);
    const [genreSelect, setGenre] = useState<any[]>([]);
    const [infoSelect, setInfo] = useState("");

    const [noInst, setNoInst] = useState(false);
    const [noGenre, setNoGenre] = useState(false);
    const [noExp, setNoExp] = useState(false);
    const [noCommit, setNoCommit] = useState(false);
    const [noInfo, setNoInfo] = useState(false);

    const [commitError, setCommitError] = useState(false);
    const [negError, setnegError] = useState(false);
    const [weekError, setWeekError] = useState(false);
    const [duplicate, setDuplicate] = useState(false);

    

    useEffect(() => {
        setDefaults();
    }, [infoSelect]);

    function setDefaults(){
        if(!newCard){
            console.log("IN IF STATEMENT")
            const instrument = instrumentList.at(oldInstrument)
            if(instrument){setInstrument({value: instrument.value, label: instrument.label})};
            console.log(instrumentSelect)
            if(genreSelect.length <= 1){setGenre(oldGenre);}
            console.log(genreSelect)
            const exp = experienceList.at(oldExperience)
            if(exp){setExperience({value: exp.value, label: exp.label})};
            console.log(experienceSelect)
            if(commitMinSelect == 0){setCommitMin(oldCommitMin)};
            console.log(commitMinSelect);
            if(commitMaxSelect == 0){setCommitMax(oldCommitMax)};
            console.log(commitMaxSelect)
            if(infoSelect==""){setInfo(oldInfo)};
            console.log(infoSelect);
        }
    }

    function createCard(){    
        setNoInst(false);
        setNoGenre(false);
        setNoExp(false);
        setNoCommit(false);
        setNoInfo(false);

        //Make sure they've selected all inputs
        if(Object.keys(instrumentSelect).length == 0){     
            setNoInst(true);
        }       
        if(genreSelect.length == 0){
            setNoGenre(true);
        }
        if(Object.keys(experienceSelect).length == 0){     
            setNoExp(true);
        }
        console.log(commitMinSelect)
        console.log(commitMaxSelect)
        if(commitMinSelect == 0 || commitMaxSelect == 0){
            setNoCommit(true);
        }
        if(infoSelect == ""){
            setNoInfo(true);
        }
        if(instrumentSelect && experienceSelect && (genreSelect.length >= 1) && commitMinSelect && commitMaxSelect && infoSelect){

            console.log(instrumentSelect)

            let status;
            setCommitError(false);
            fetch("/api/hobbyCardCreation", { 
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    uid: uid,
                    instrument: instrumentSelect, 
                    experience: experienceSelect,
                    genres: genreSelect,
                    commitMin: commitMinSelect,
                    commitMax: commitMaxSelect,
                    info: infoSelect,
                    newCard: newCard})
              })
                .then((res) => {
                    status = res.status;
                    return res.json();           
                })
                .then((data) => {
                    if(status == 200){
                        console.log("SUCESSFUL CREATION");
                        setCards(data);

                        setGenre([]);
                        setExperience("");
                        setCommitMin(0);
                        setCommitMax(0);
                        setInstrument("");
                        setInfo("");

                        setShow(false);
                    }
                    else if(status == 409){
                        console.log(data);
                        setDuplicate(true);
                    }                
                })
                .catch(error =>{
                    console.error('Error: ', error);
                });     

        }
    }

    const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setnegError(false);
        setCommitError(false);
        setWeekError(false);
        const enteredMin = event.target.value;

        if(+enteredMin <= 0){
            setnegError(true);
        }
        if(+enteredMin > 168){
            setWeekError(true);
        }
        setCommitMin(+enteredMin);    

        if( commitMaxSelect < +enteredMin ){
            console.log("NOT CREATING - invalid commit inputs")
            setCommitError(true);
            exit;
        }
        
    }

    const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredMax = event.target.value;
        setnegError(false);
        setCommitError(false);
        setWeekError(false);

        if(+enteredMax <= 0){
            setnegError(true);
        }
        if(+enteredMax > 168){
            setWeekError(true);
        }
        setCommitMax(+enteredMax);

        if( +enteredMax < commitMinSelect ){
            console.log("NOT CREATING - invalid commit inputs")
            setCommitError(true);
            exit;
        }
        
    }

    const handleInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredInfo = event.target.value;
        setInfo(enteredInfo);
    }
        
    return(
        // TO DO: Add inputs already there for if they're editing rather than creating
        <Modal show={show}>
            <Card>
            <Card.Body>            
                <Card.Title> 
                    {newCard? <SingleselectInput controlId={undefined} label={"Instrument"} text={""} options={instrumentList} setValue={setInstrument} value={instrumentSelect} multi={false}/> : instrumentList.at(oldInstrument)?.label}
                    {noInst && (<p style={{color:"red", fontSize:13}}>Please select an instrument.</p>)}
                </Card.Title>
                <Col>
                    <SingleselectInput controlId={undefined} label={"Genre"} text={""} options={genreList} setValue={setGenre} value={oldGenre} multi={true} />
                    {noGenre && (<p style={{color:"red", fontSize:13}}>Please select at least one genre.</p>)}
                </Col>
                <Col> 
                    <SingleselectInput controlId={undefined} label={"Experience"} text={""} options={experienceList} setValue={setExperience} value={newCard? experienceSelect : experienceList.at(oldExperience)} multi={false}/>
                    {noExp && (<p style={{color:"red", fontSize:13}}>Please select an experience level.</p>)}
                </Col>
                <Row>
                    <Form.Label>Commitment</Form.Label>
                    <Form.Text>Range of hours you are looking to commit weekly</Form.Text>
                    <Form.Group as={Col} md="5">
                    <Form.Control type="number" defaultValue={oldCommitMin} onChange={handleMinChange} min="1" max="168"/>
                    </Form.Group>
                    <Col md="1">to</Col>
                    <Form.Group as={Col} md="5">
                    <Form.Control type="number" defaultValue={oldCommitMax} onChange={handleMaxChange} min={commitMinSelect} max="168"/>
                    </Form.Group>
                    {commitError && (<p style={{color:"red", fontSize:13}}>Increase your maximum or lower your minimum commitment.</p>)}
                    {negError && (<p style={{color:"red", fontSize:13}}>You must be willing to commit at least 1 hour to list this hobby.</p>)}
                    {weekError && (<p style={{color:"red", fontSize:13}}>Lovingly, that is not possible. Please limit yourself to the 168 existing hours in the week.</p>)}
                    {noCommit && (<p style={{color:"red", fontSize:13}}>Please indicate your time commitment.</p>)}
                </Row> <br/>
                <Row>
                    <Form.Group>
                    <Form.Label>Details</Form.Label> <br/>
                    <Form.Text> Additional info you would like to share with users about this hobby.</Form.Text>
                    <Form.Control type="text" maxLength={200} defaultValue={oldInfo} onChange={handleInfoChange} placeholder="I'm looking for..."/>
                    </Form.Group>
                    {noInfo && (<p style={{color:"red", fontSize:13}}>Please include further details.</p>)}
                </Row>
                {duplicate && (<p style={{color:"red", fontSize:14}}>Looks like you've already created a hobby for this instrument. Feel free to update your existing card instead.</p>)}
                <br/>
                <Button className={globals.btn} onClick={createCard}> {newCard ? "Create" : "Save"} </Button>
                <Button className={globals.btn} onClick={() => setShow(false)}>Cancel</Button>
            </Card.Body>
            </Card>
        </Modal>
    );
}