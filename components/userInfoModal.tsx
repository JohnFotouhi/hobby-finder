import { Button, Col, Container, Row, Form, Card, Modal, Dropdown} from "react-bootstrap";
import MultiselectInput from "./multiselectInput";
import { useState } from "react";
import SingleselectInput from "./singleselectinput";
import FormInput from "./formInput";
import { optionCSS } from "react-select/dist/declarations/src/components/Option";
import { updateProfile } from "firebase/auth";

export default function UserInfoModal({showInfo, setShowInfo, infoTitle, info}) {
    
    
    const [experienceSelect, setExperience] = useState("");
    const [commitmentSelect, setCommitment] = useState("");
    const [genreSelect, setGenre] = useState<any[]>([]);

    const [capacitySelect, setCapacity] = useState("");
    const [bioSelect, setBio] = useState("");
    const [equipmentSelect, setEquipment] = useState("");
    const [scheduleSelect, setSchedule] = useState("");
    


    function updateProfile(){
        // replace with a HobbyCard that has current info filled in / update FireBase
        showInfo(false);
    }

    function closeInfo(){
        setShowInfo(false);
    }

    
   

    return(
        // TO DO: Add inputs already there for if they're editing rather than creating
        <Modal show={showInfo}>
            <Card style={{ width: "20rem" }}>
            <Card.Body>            
                <Card.Title> 
                    {infoTitle}
                </Card.Title>
                <Col> 
                    {info}
                </Col>
                <Button onClick={closeInfo}>Close</Button>
            </Card.Body>
            </Card>
        </Modal>
    );
}