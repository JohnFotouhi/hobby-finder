import { Button, Col, Container, Row, Form, Card, Modal, Dropdown} from "react-bootstrap";
import MultiselectInput from "./multiselectInput";
import { useState } from "react";
import SingleselectInput from "./singleselectinput";
import FormInput from "./formInput";

export default function HobbyCardEditor({setShow, show, newCard, oldInstrument, oldGenre, oldExperience, oldCommitment, oldInfo}) {
    
    const [instrumentSelect, setInstrument] = useState("");
    const [experienceSelect, setExperience] = useState("");
    const [commitmentSelect, setCommitment] = useState("");
    const [genreSelect, setGenre] = useState<any[]>([]);
    const [infoSelect, setInfo] = useState("");

    type Data = {
        commitment: string
        experience: string
        genre: string[]
        info: string
        instrument: string
      }

    function createCard(){
        //FIRST: make sure they've chosen something for everything but info
        //var newCard = {}

        fetch("/api/hobbyCardCreation", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({data:""})
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
          });

        /*console.log(`instrument: ${instrumentSelect}`);
        console.log(`genres: ${genreSelect}`);
        console.log(`experience: ${experienceSelect}`);
        console.log(`commitment: ${commitmentSelect}`);
        console.log(`info: ${infoSelect}`);*/
    }

    function saveCard(){
        // replace with a HobbyCard that has current info filled in / update FireBase
        setShow(false);
    }

    function cancelCard(){
        setShow(false);
    }

    const experienceLevels = [{label: "Low: Less than 3 years", value: "XP1"}, {label: "Medium: 3-6 years", value: "XP2"}, {label: "High: more than 6 years", value: "XP3"}];
    const instruments = [{value:'voice', label:'Voice'}, {value:'bass', label:'Bass'}, {value:'drums', label:'Drums'}]
    const genres = [{name: "Rock", id: "genre1"}, {name: "Jazz", id: "genre2"}, {name: "Classical", id: "genre3"}, {name: "Other", id: "genre0"}];
    const commitmentLevels = [{label: "Low: Less than 3 hours per week", value: "commit1"}, {label: "Medium: 3-7 hours per week", value: "commit2"}, {label: "High: more than 7 hours per week", value: "commit3"}];    
    
    return(
        // TO DO: Add inputs already there for if they're editing rather than creating
        <Modal show={show}>
            <Card style={{ width: "20rem" }}>
            <Card.Body>            
                <Card.Title> 
                    <SingleselectInput controlId={undefined} label={"Instrument"} text={""} options={instruments} setValue={setInstrument} value={instrumentSelect}/>
                </Card.Title>
                <Col><MultiselectInput
                            controlId="skillInput"
                            label="Genres"
                            text=""
                            selected={genreSelect}
                            setSelected={setGenre}
                            options={genres}
                            /> </Col>
                <Col> 
                    <SingleselectInput controlId={undefined} label={"Experience"} text={""} options={experienceLevels} setValue={setExperience} value={experienceSelect}/>
                </Col>
                <Col>
                    <SingleselectInput controlId={undefined} label={"Commitment"} text={""} options={commitmentLevels} setValue={setCommitment} value={commitmentSelect}/>
                </Col>
                <Col><Form> 
                        <FormInput controlId="info" label="Details" type="text" placeholder="Im looking for..." text="" setValue={setInfo} value={infoSelect}/>
                        <Form.Text className="text-muted">
                            Any additional info you would like to share with users about this hobby.
                        </Form.Text>
                    </Form> </Col>
                <Button onClick={newCard? createCard : saveCard}> {newCard ? "Create" : "Save"} </Button>
                <Button onClick={cancelCard}>Cancel</Button>
            </Card.Body>
            </Card>
        </Modal>
    );
}