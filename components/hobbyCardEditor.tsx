import { Button, Col, Container, Row, Form, Card, Modal, Dropdown, InputGroup} from "react-bootstrap";
import MultiselectInput from "./multiselectInput";
import { useState } from "react";
import SingleselectInput from "./singleselectinput";
import FormInput from "./formInput";
import { optionCSS } from "react-select/dist/declarations/src/components/Option";
import {instrumentList, genreList, experienceList} from "../lists"

export default function HobbyCardEditor({uid, setCards, setShow, show, newCard, oldInstrument, oldGenre, oldExperience, oldCommitMin, oldCommitMax, oldInfo}) {
    
    const [instrumentSelect, setInstrument] = useState("");
    const [experienceSelect, setExperience] = useState("");
    const [commitMinSelect, setCommitMin] = useState(0);
    const [commitMaxSelect, setCommitMax] = useState(0);
    const [genreSelect, setGenre] = useState<any[]>([]);
    const [infoSelect, setInfo] = useState("");

    const [commitError, setCommitError] = useState(false);
    const [emptyInput, setEmptyInput] = useState(false);

    function createCard(){

        //Make sure they've selected all inputs
        if(instrumentSelect && experienceSelect && (genreSelect.length >= 1) && commitMinSelect && commitMaxSelect && infoSelect){
            if( commitMaxSelect < commitMinSelect ){
                console.log("NOT CREATING - invalid commit inputs")
                setCommitError(true);
            }

            console.log(oldInstrument);
            console.log(oldExperience);
            console.log(oldInfo);

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

        
    return(
        // TO DO: Add inputs already there for if they're editing rather than creating
        <Modal show={show}>
            <p>{oldInstrument}, {oldGenre}, {oldExperience}, {oldCommitMin}, {oldCommitMax}, {oldInfo}</p>
            <Card>
            <Card.Body>            
                <Card.Title> 
                    {<SingleselectInput controlId={undefined} label={"Instrument"} text={""} options={instrumentList} setValue={setInstrument} value={instrumentList.at(oldInstrument)} multi={false}/>}
                </Card.Title>
                <Col>
                    <SingleselectInput controlId={undefined} label={"Genre"} text={""} options={genreList} setValue={setGenre} value={[genreList.at(3)]} multi={true} />
                </Col>
                <Col> 
                    <SingleselectInput controlId={undefined} label={"Experience"} text={""} options={experienceList} setValue={setExperience} value={experienceList.at(oldExperience)} multi={false}/>
                </Col>
                <Col>
                    <Form>                  
                        <Form.Label>Commitment</Form.Label> <br/> 
                        <Form.Text>Range of hours you are looking to commit weekly.</Form.Text>            
                        <InputGroup className="col-sm-2">
                        <FormInput controlId={"commiteLow"} label={undefined} type={"number"} placeholder={undefined} text={undefined} setValue={setCommitMin} value={commitMinSelect} min="1"/> to
                        <FormInput controlId={"commitHigh"} label={undefined} type={"number"} placeholder={undefined} text={undefined} setValue={setCommitMax} value={commitMaxSelect} min={commitMinSelect}/>
                        {commitError && (<p style={{color:"red", fontSize:13}}>Increase your upper threshold or lower your minimum commitment.</p>)}
                        </InputGroup>
                    </Form>       
                </Col>
                <Col><Form>
                        <Form.Label>Details</Form.Label> 
                        <Form.Text className="text-muted"> <br/>
                            Any additional info you would like to share with users about this hobby.
                        </Form.Text>
                        <FormInput controlId="info" label={undefined} type="text" placeholder="Im looking for..." text="" setValue={setInfo} value={infoSelect}/>              
                    </Form> 
                </Col>
                {emptyInput && (<p style={{color:"red", fontSize:14}}>Please fill out all hobby info.</p>)}
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