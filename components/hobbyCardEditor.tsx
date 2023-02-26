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
    const [commitmentSelect, setCommitment] = useState("");
    const [genreSelect, setGenre] = useState<any[]>([]);
    const [infoSelect, setInfo] = useState("");

    function createCard(){

        // console.log(instrumentSelect);
        // console.log(experienceSelect);
        // console.log(genreSelect);
        // console.log(commitmentSelect);
        // console.log(infoSelect);

        //Make sure they've selected all inputs
        if(instrumentSelect && experienceSelect && genreSelect && commitmentSelect && infoSelect){
            let status;
            fetch("/api/hobbyCardCreation", { 
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    uid: uid,
                    instrument: instrumentSelect, 
                    experience: experienceSelect,
                    genres: genreSelect,
                    commitment: commitmentSelect,
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
        
        setShow(false);
    }

    
    const commitmentLevels = [{label: "Low: Less than 3 hours per week", value: "commit1"}, {label: "Medium: 3-7 hours per week", value: "commit2"}, {label: "High: more than 7 hours per week", value: "commit3"}];    
    
    return(
        // TO DO: Add inputs already there for if they're editing rather than creating
        <Modal show={show}>
            <Card style={{ width: "20rem" }}>
            <Card.Body>            
                <Card.Title> 
                    <SingleselectInput controlId={undefined} label={"Instrument"} text={""} options={instrumentList} setValue={setInstrument} value={null} multi={false}/>
                </Card.Title>
                <Col>
                    {/* <MultiselectInput
                            controlId="skillInput"
                            label="Genres"
                            text=""
                            selected={genreSelect}
                            setSelected={setGenre}
                            options={genreList}
                            />  */}
                    <SingleselectInput controlId={undefined} label={"Genre"} text={""} options={instrumentList} setValue={setGenre} value={genreSelect} multi={true} />
                </Col>
                <Col> 
                    <SingleselectInput controlId={undefined} label={"Experience"} text={""} options={experienceList} setValue={setExperience} value={experienceSelect} multi={false}/>
                </Col>
                <Col>
                    {/* <SingleselectInput controlId={undefined} label={"Commitment"} text={""} options={commitmentLevels} setValue={setCommitment} value={commitmentSelect} multi={false}/> */}
                    <Form>                  
                        <Form.Label>Commitment</Form.Label>
                        <Form.Text>Range of hours you are looking to commit weekly.</Form.Text>
                        <InputGroup className="col-sm-2">
                        <FormInput controlId={"commiteLow"} label={undefined} type={"number"} placeholder={undefined} text={undefined} setValue={undefined} value={undefined}/>
                        <FormInput controlId={"commitHigh"} label={undefined} type={"number"} placeholder={undefined} text={undefined} setValue={undefined} value={undefined}/>
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