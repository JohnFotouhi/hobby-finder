import { Button, Col, Container, Row, Form, Card, Modal, Dropdown} from "react-bootstrap";
import {useState} from "react"
import UploadImage from "./uploadImage";
import Image from 'next/image';
import { BsPlayBtnFill, BsPencil, BsTrash } from "react-icons/bs";
import UserInfoModal from "./userInfoModal";
import FormInput from "./formInput";
import styles from "styles/schedule.module.css";

export default function UserInformation({owner, name, bio, equipment, availability, capacity, profilePicture}){
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
                
                <Col className="col-md-2">
                    <Image className= "square bg-primary rounded-pill" src={profilePicture} alt="profile_picture" width="200" height = "200"></Image>
                </Col>
                
                <Col className="col-md-5">
                    <Col>
                        <span className="fw-bold fs-2">{name}</span>
                    </Col>
                    
                    <Col style = {{height: "100%", border: "solid"}}>
                        <span>{bio}</span>
                    </Col>
                    {/* <div className="fluid square border border-dark" style={{maxHeight: "100%"}}>
                        <span>{bio}</span>
                    </div> */}
                </Col>
                <Col className="col-md-5" style ={{height: "100%", border: "solid"}}>
                    <Container>
                        <Row>
                            <span>Schedule </span>
                        </Row>
                        <Row>
                            <Col className={styles.cell}>
                                <span>     </span>
                            </Col>
                            <Col className={styles.cell}>
                                <div >Mon</div>
                            </Col>
                            <Col className={styles.cell}>
                                <div>Tues</div>
                            </Col>
                            <Col className={styles.cell}>
                                <div>Wed</div>
                            </Col>
                            <Col className={styles.cell}>
                                <div>Thur</div>
                            </Col>
                            <Col className={styles.cell}>
                                <div>Fri</div>
                            </Col>
                            <Col className={styles.cell}>
                                <div>Sat</div>
                            </Col>
                            <Col className={styles.cell}>
                                <div>Sun</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className={styles.cell} >
                                <span >M </span>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className={styles.cell} >
                                <span >A</span>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className={styles.cell} >
                                <span>E</span>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className={styles.cell} >
                                <span>N</span>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                            <Col className={styles.cell}>
                                <div></div>
                            </Col>
                        </Row>
                        
                    </Container>
                    
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