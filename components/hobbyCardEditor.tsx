import { Button, Col, Container, Row, Form, Card, Modal, Dropdown, InputGroup} from "react-bootstrap";
import MultiselectInput from "./multiselectInput";
import React, { useEffect, useState } from "react";
import SingleselectInput from "./singleselectinput";
import FormInput from "./formInput";
import { optionCSS } from "react-select/dist/declarations/src/components/Option";
import {instrumentList, genreList, experienceList} from "../lists"
import { BsMinecart } from "react-icons/bs";
import { exit } from "process";

export default function HobbyCardEditor({uid, setCards, setShow, show, newCard, oldInstrument, oldGenre, oldGenreStrings, oldExperience, oldCommitMin, oldCommitMax, oldInfo}) {
    
    const [instrumentSelect, setInstrument] = useState({});
    const [experienceSelect, setExperience] = useState({});
    const [commitMinSelect, setCommitMin] = useState(0);
    const [commitMaxSelect, setCommitMax] = useState(0);
    const [genreSelect, setGenre] = useState<any[]>([]);
    const [infoSelect, setInfo] = useState("");

    const [commitError, setCommitError] = useState(false);
    const [emptyInput, setEmptyInput] = useState(false);

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
        
        //Make sure they've selected all inputs
        if( commitMaxSelect < commitMinSelect ){
            console.log("NOT CREATING - invalid commit inputs")
            setCommitError(true);
            exit;
        }
        else if(instrumentSelect && experienceSelect && (genreSelect.length >= 1) && commitMinSelect && commitMaxSelect && infoSelect){

            console.log(instrumentSelect)

            let status;
            setCommitError(false);
            setEmptyInput(false);
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
                        //TODO: error message for user
                    }                
                })
                .catch(error =>{
                    console.error('Error: ', error);
                });     

        }
        else{
            console.log("NOT CREATING - empty inputs")
            setEmptyInput(true);
        } 
    }

    const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredMin = event.target.value;
        setCommitMin(+enteredMin);
    }

    const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredMax = event.target.value;
        setCommitMax(+enteredMax);
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
                </Card.Title>
                <Col>
                    <SingleselectInput controlId={undefined} label={"Genre"} text={""} options={genreList} setValue={setGenre} value={oldGenre} multi={true} />
                </Col>
                <Col> 
                    <SingleselectInput controlId={undefined} label={"Experience"} text={""} options={experienceList} setValue={setExperience} value={newCard? experienceSelect : experienceList.at(oldExperience)} multi={false}/>
                </Col>
                <Row>
                    <Form.Label>Commitment</Form.Label>
                    <Form.Text>Range of hours you are looking to commit weekly</Form.Text>
                    <Form.Group as={Col} md="5">
                    <Form.Control type="number" defaultValue={oldCommitMin} onChange={handleMinChange} min="1" max="50"/>
                    </Form.Group>
                    <Col md="1">to</Col>
                    <Form.Group as={Col} md="5">
                    <Form.Control type="number" defaultValue={oldCommitMax} onChange={handleMaxChange} min={commitMinSelect} max="50"/>
                    </Form.Group>
                    {commitError && (<p style={{color:"red", fontSize:13}}>Increase your upper threshold or lower your minimum commitment.</p>)}
                </Row> <br/>
                <Row>
                    <Form.Group>
                    <Form.Label>Details</Form.Label> <br/>
                    <Form.Text> Any additional info you would like to share with users about this hobby.</Form.Text>
                    <Form.Control type="text" defaultValue={oldInfo} onChange={handleInfoChange} placeholder="I'm looking for..."/>
                    </Form.Group>
                </Row>
                {emptyInput && (<p style={{color:"red", fontSize:14}}>Please fill out all hobby info.</p>)}
                <br/>
                <Button onClick={createCard}> {newCard ? "Create" : "Save"} </Button>
                <Button onClick={() => setShow(false)}>Cancel</Button>
            </Card.Body>
            </Card>
        </Modal>
    );
}

//OLD GENRE SELECT
/* <MultiselectInput
        controlId="skillInput"
        label="Genres"
        text=""
        selected={genreSelect}
        setSelected={setGenre}
        options={genreList}
        />  */