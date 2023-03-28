import { Button, Col, Container, Row, Form, Card, Modal, Dropdown} from "react-bootstrap";
import {useState} from "react"
import UploadImage from "./uploadImage";
import Image from 'next/image';
import { BsPencil, BsInfoCircle} from "react-icons/bs";
import UserInfoModal from "./userInfoModal";
import FormInput from "./formInput";
import styles from "styles/schedule.module.css";
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function UserInformation({owner, name, pronouns, bio, equipment, availability, capacity, profilePicture}){
    const [file, setFile] = useState("");

    type Day = {
        morn: boolean,
        aft: boolean,
        eve: boolean,
        night: boolean,
      }

    var emptyDay = {morn: false, aft: false, eve: false, night: false}
    const avail : [Day, Day, Day, Day, Day, Day, Day] = [emptyDay,emptyDay,emptyDay,emptyDay,emptyDay,emptyDay,emptyDay];
    console.log(avail);

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
                    <Row> 
                        <Image className= "square bg-light rounded-pill" src={profilePicture} alt="profile_picture" width="200" height = "200"></Image>
                    </Row>
                    
                    <Row>
                        <span>{pronouns}</span>
                    </Row>
                    
                </Col>
                
                <Col className="col-md-4">
                    <Col>
                        <span className="fw-bold fs-2">{name}</span>
                    </Col>
                    <Col style = {{height: "100%"}}>
                        <span>{bio}</span>
                    </Col>
                    {/* <div className="fluid square border border-dark" style={{maxHeight: "100%"}}>
                        <span>{bio}</span>
                    </div> */}
                </Col>
                <Col className="col-md-5" style ={{height: "100%"}}>
                    <span>Availability</span>
                    <Table style={{backgroundColor: "whitesmoke", borderRadius: 5}}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>S</th>
                                <th>M</th>
                                <th>T</th>
                                <th>W</th>
                                <th>Th</th>
                                <th>F</th>
                                <th>S</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Morning</td>
                                {/* <td className={availability[0].morn? "styles/isAvail" : "" }>{availability[0].morn? "Y" : "N"}</td>
                                <td className={availability[0].morn? "styles/isAvail" : "" }></td>
                                <td className={availability[0].morn? "styles/isAvail" : "" }></td> */}
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Afternoon</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Evening</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Night</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </Table> 

                    <Row style={{padding: 20}}>
                        <Col className="col-md-12" style={{backgroundColor: "wheat", paddingRight: 10}}>
                            <OverlayTrigger placement='top' overlay={<Tooltip> How many people you would feel comfortable gathering at your place.</Tooltip>}>
                                <Button style={{backgroundColor:"transparent", borderColor:"transparent"}}><BsInfoCircle style={{color:"black"}}/></Button>
                            </OverlayTrigger>
                            <span> Host Capacity: {capacity} people</span>
                        </Col>
                    </Row> 
                    <Row style={{padding: 20}}>
                        <Col className="col-md-12" style={{backgroundColor: "wheat"}} >
                            <OverlayTrigger placement='top' overlay={<Tooltip> Any musical equipment you'd feel comfortable sharing, like mics or amps.</Tooltip>}>
                                <Button style={{backgroundColor:"transparent", borderColor:"transparent"}}><BsInfoCircle style={{color:"black"}}/></Button>
                            </OverlayTrigger>
                            <span>Equipment: {equipment}</span>
                        </Col>
                    </Row>
                </Col>      
            </Row>

                
            <hr></hr>
        </Container>
        
    );
}