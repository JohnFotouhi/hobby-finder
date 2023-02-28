import { Button, Col, Container, Row, Form, Card, Modal, Dropdown, InputGroup} from "react-bootstrap";
import MultiselectInput from "./multiselectInput";
import { useState } from "react";
import SingleselectInput from "./singleselectinput";
import FormInput from "./formInput";
import { optionCSS } from "react-select/dist/declarations/src/components/Option";
import {instrumentList, genreList, experienceList} from "../lists"

export default function HobbyCardEditor({uid, setCards, setShow, show, newCard, oldInstrument, oldGenre, oldExperience, oldCommitment, oldInfo}) {
    
    const [instrumentSelect, setInstrument] = useState("");
    const [experienceSelect, setExperience] = useState("");
    const [commitMinSelect, setCommitMin] = useState(0);
    const [commitMaxSelect, setCommitMax] = useState(0);
    const [genreSelect, setGenre] = useState<any[]>([]);
    const [infoSelect, setInfo] = useState("");

    function createCard(){

        //Make sure they've selected all inputs
        if(instrumentSelect && experienceSelect && genreSelect && commitMinSelect && commitMaxSelect && infoSelect){
            let status;
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
            //some sort of error indicating they need to fill out all info
        }
    }

    function cancelCard(){
        setGenre([]);
        setExperience("");
        setCommitMin(0);
        setCommitMax(0);
        setInstrument("");
        setInfo("");
        setShow(false);
    }

        
    return(
        // TO DO: Add inputs already there for if they're editing rather than creating
        <Modal show={show}>
            <Card style={{ width: "20rem" }}>
            <Card.Body>            
                <Card.Title> 
                    {newCard? <SingleselectInput controlId={undefined} label={"Instrument"} text={""} options={instrumentList} setValue={setInstrument} value={instrumentSelect} multi={false}/> : oldInstrument}
                </Card.Title>
                <Col>
                    <SingleselectInput controlId={undefined} label={"Genre"} text={""} options={genreList} setValue={setGenre} value={genreSelect} multi={true} />
                </Col>
                <Col> 
                    <SingleselectInput controlId={undefined} label={"Experience"} text={""} options={experienceList} setValue={setExperience} value={experienceSelect} multi={false}/>
                </Col>
                <Col>
                    <Form>                  
                        <Form.Label>Commitment</Form.Label>
                        <Form.Text>Range of hours you are looking to commit weekly.</Form.Text>
                        <InputGroup className="col-sm-2">
                        <FormInput controlId={"commiteLow"} label={undefined} type={"number"} placeholder={undefined} text={undefined} setValue={setCommitMin} value={commitMinSelect} min={1} max={50}/> to
                        <FormInput controlId={"commitHigh"} label={undefined} type={"number"} placeholder={undefined} text={undefined} setValue={setCommitMax} value={commitMaxSelect} min={commitMinSelect} max={50}/>
                        </InputGroup>
                    </Form>       
                </Col>
                <Col><Form> 
                        <FormInput controlId="info" label="Details" type="text" placeholder="Im looking for..." text="" setValue={setInfo} value={infoSelect}/>
                        <Form.Text className="text-muted">
                            Any additional info you would like to share with users about this hobby.
                        </Form.Text>
                    </Form> </Col>
                <Button onClick={createCard}> {newCard ? "Create" : "Save"} </Button>
                <Button onClick={cancelCard}>Cancel</Button>
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