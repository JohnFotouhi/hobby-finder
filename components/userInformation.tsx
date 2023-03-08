import { Button, Col, Container, Row, Form, Card, Modal, Dropdown} from "react-bootstrap";
import {useState} from "react"
import UploadImage from "./uploadImage";
import Image from 'next/image';
import { BsPlayBtnFill, BsPencil, BsTrash } from "react-icons/bs";
import UserInfoModal from "./userInfoModal";
import FormInput from "./formInput";

export default function UserInformation({owner, name, pronouns, bio, equipment, availability, capacity, profilePicture}){
    const [file, setFile] = useState("");

    const [showEquipmentInfo, setShowEquipmentInfo] = useState(false);
    const [showScheduleInfo, setShowScheduleInfo] = useState(false);

    // Handles input change event and updates state
    function handleChange(event) {
        setFile(event.target.files[0]);
    }

    function equipmentInfoDisplay() {
        setShowEquipmentInfo(true);
    }

    function scheduleInfoDisplay() {
        setShowScheduleInfo(true);
    }



    return (
        <Container style={{padding: 10}}>
            <Row style={{padding: 60}}>
                
                <Col className="col-md-3">
                    <Image className= "square bg-primary rounded-pill" src={profilePicture} alt="profile_picture" width="200" height = "200"></Image>
                </Col>
                
                <Col className="col-md-4">
                    <Col>
                        <Row>
                            <span className="fw-bold fs-2">{name}</span>
                        </Row>
                        <Row>
                            <span>{pronouns}</span>
                        </Row>
                    </Col>
                    
                    <Col style = {{height: "100%", border: "solid"}}>
                        <span>{bio}</span>
                    </Col>
                    {/* <div className="fluid square border border-dark" style={{maxHeight: "100%"}}>
                        <span>{bio}</span>
                    </div> */}
                </Col>
                <Col className="col-md-4" style ={{border: "solid"}}>
                    {/* Schedule */}
                    <span>Schedule </span>
                </Col>
                
            </Row>

          
            

            <Row className = "lg-3" style={{padding: 20}}>
                <Col className="col-md-3">
                    {/* Can host */}
                    <div className="square border border-dark"> Jam Session Host Capacity: {capacity} people</div>
                </Col>
                <Col className="col-md-3" style ={{border: "solid"}} >
                    {/* Equipment */}
                    <span>Equipment: {equipment}</span>
                </Col>
            </Row>
                
            <hr></hr>
        </Container>
        
    );
}