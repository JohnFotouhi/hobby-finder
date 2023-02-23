import { Button, Col, Container, Row, Form, Card, Modal, Dropdown} from "react-bootstrap";
import {useState} from "react"
import UploadImage from "./uploadImage";
import Image from 'next/image';
import { BsPlayBtnFill, BsPencil, BsTrash } from "react-icons/bs";
import UserInfoModal from "./userInfoModal";

export default function UserInformation({capacity, equipment, schedule, displayName, bio, owner, editProfile, profilePicture}){
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
                <Col className="col-md-4">
                    <Image className= "square bg-primary rounded-pill" src={profilePicture} alt="profile_picture" width="256" height = "256"></Image>
                </Col>
                <Col className="col-md-5">
                    <Col>
                        <span className="fw-bold fs-2">{displayName}</span>
                    </Col>
                    <Card>
                        <span>{bio}</span>
                    </Card>
                    {/* <div className="fluid square border border-dark" style={{maxHeight: "100%"}}>
                        <span>{bio}</span>
                    </div> */}
                </Col>
                <Col className="col-md-2">
                    { owner? <Button onClick={editProfile}><BsPencil/></Button> : null}
                </Col>
                
            </Row>

          
            

            <Row className = "lg-3" style={{padding: 20}}>
                <Col>
                    {/* Can host */}
                    <Button className="square border border-dark">Host Capacity {capacity}</Button>
                </Col>
                <Col>
                    {/* Equipment */}
                    <Button className="square border border-dark" onClick={equipmentInfoDisplay}>Equipment</Button>
                    <UserInfoModal showInfo={showEquipmentInfo} setShowInfo = {setShowEquipmentInfo} infoTitle={"Equipment"} info={equipment}></UserInfoModal>
                </Col>
                <Col>
                    {/* Schedule */}
                    <Button className="square border border-dark" onClick={scheduleInfoDisplay}>Schedule</Button>
                    <UserInfoModal showInfo={showScheduleInfo} setShowInfo = {setShowScheduleInfo} infoTitle={"Availabilty"} info={schedule}></UserInfoModal>
                </Col>
            </Row>
                
            <hr></hr>
        </Container>
        
    );
}