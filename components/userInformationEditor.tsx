import { Button, Col, Container, Row, Form, Card, Modal, Dropdown} from "react-bootstrap";
import MultiselectInput from "./multiselectInput";
import { useState } from "react";
import SingleselectInput from "./singleselectinput";
import FormInput from "./formInput";
import { optionCSS } from "react-select/dist/declarations/src/components/Option";
import { updateProfile } from "firebase/auth";

export default function UserInformationEditor({setShowProfileEditor, showProfileEditor, updateProfile, oldCapacity, oldBio, oldEquipment, oldSchedule}) {
    
    
    const [experienceSelect, setExperience] = useState("");
    const [commitmentSelect, setCommitment] = useState("");
    const [genreSelect, setGenre] = useState<any[]>([]);

    const [capacitySelect, setCapacity] = useState("");
    const [bioSelect, setBio] = useState("");
    const [equipmentSelect, setEquipment] = useState("");
    const [scheduleSelect, setSchedule] = useState("");
    

    // function createCard(){

    //     // console.log(instrumentSelect);
    //     // console.log(experienceSelect);
    //     // console.log(genreSelect);
    //     // console.log(commitmentSelect);
    //     // console.log(infoSelect);

    //     //Make sure they've selected all inputs
    //     if(instrumentSelect && experienceSelect && genreSelect && commitmentSelect && infoSelect){
    //         fetch("/api/hobbyCardCreation", { 
    //             method: "POST",
    //             headers: {'Content-Type': 'application/json'},
    //             body: JSON.stringify({data: {
    //                 instrument: instrumentSelect, 
    //                 experience: experienceSelect,
    //                 genres: genreSelect,
    //                 commitment: commitmentSelect,
    //                 info: infoSelect,
    //                 updateProfile: updateProfile}})
    //           })
    //             .then((res) => {
    //                 //console.log(res.json());
    //                 if(res.status == 409 ){
    //                     console.log("ERROR: Tried to make card w duplicate instrument");
    //                     //TO DO: error message for user
    //                 }
    //                 else if(res.status == 200){
    //                     console.log("SUCESSFUL CREATION");
    //                     setShowInfo(false);
    //                 }
    //             })
    //             .then((data) => {
    //               console.log(data);
    //             })
    //             .catch(error =>{
    //                 console.error('Error:', error);
    //             });     
    //     }
    //     else{
    //         console.log("NOT CREATING - empty inputs")
    //         //some sort of error indicating they need to fill out all info
    //     }
    // }

    function Update(){
        // replace with a HobbyCard that has current info filled in / update FireBase
        setShowProfileEditor(false);
    }

    function cancelUpdate(){
        setShowProfileEditor(false);
    }
   
    const capacity = [{label: "1", value: "capacity1"}, {label: "2", value: "capacity2"}, {label: "3", value: "capacity3"}, {label: "4", value: "capacity4"}, {label: "5", value: "capacity5"},
                            {label: "6", value: "capacity6"}, {label: "7", value: "capacity7"}, {label: "8+", value: "capacity8"},]

    return(
        // TO DO: Add inputs already there for if they're editing rather than creating
        <Modal showProfileEditor={showProfileEditor}>
            <Card style={{ width: "20rem" }}>
            <Card.Body>            
                <Card.Title> 
                    Edit Profile
                </Card.Title>
                <SingleselectInput controlId={undefined} label={"Instrument"} text={""} options={capacity} setValue={setCapacity} value={oldCapacity? capacity.at(oldCapacity) : null}/>
                <Col><Form> 
                        <FormInput controlId="bio" label="Bio" type="text" placeholder="About me..." text="" setValue={setBio} value={bioSelect}/>
                        <Form.Text className="text-muted">
                            Share a little bit about yourself!
                        </Form.Text>
                    </Form> </Col>
                <Col><Form> 
                        <FormInput controlId="equipment" label="Equipment" type="text" placeholder="Do you have any avilable equipment?" text="" setValue={setEquipment} value={equipmentSelect}/>
                        <Form.Text className="text-muted">
                            What equipment do you have to use?
                        </Form.Text>
                    </Form> </Col>
                <Col><Form> 
                        <FormInput controlId="schedule" label="Schedule" type="text" placeholder="When are you free?" text="" setValue={setSchedule} value={scheduleSelect}/>
                        <Form.Text className="text-muted">
                            When are you free?
                        </Form.Text>
                    </Form> </Col>
                <Button onClick={updateProfile? updateProfile : updateProfile}> {updateProfile ? "Create" : "Save"} </Button>
                <Button onClick={cancelUpdate}>Cancel</Button>
            </Card.Body>
            </Card>
        </Modal>
    );
}