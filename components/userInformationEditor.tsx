import { Button, Col, Container, Row, Form, Card, Modal, Dropdown} from "react-bootstrap";
import MultiselectInput from "./multiselectInput";
import { useState } from "react";
import SingleselectInput from "./singleselectinput";
import FormInput from "./formInput";
import { optionCSS } from "react-select/dist/declarations/src/components/Option";
import { updateProfile } from "firebase/auth";
import UploadFile from "./uploadFile";

export default function UserInformationEditor({setShowProfileEditor, showProfileEditor, oldName, setName, oldPronouns, setPronouns, oldCapacity, setCapacity, oldBio, setBio, oldEquipment, setEquipment, oldAvailability, setAvailability, setImage}) {
    

    const capacity = [{label: "1", value: "capacity1"}, {label: "2", value: "capacity2"}, {label: "3", value: "capacity3"}, {label: "4", value: "capacity4"}, {label: "5", value: "capacity5"},
                            {label: "6", value: "capacity6"}, {label: "7", value: "capacity7"}, {label: "8+", value: "capacity8"},]
    const pronounList = [{label: "she/her", value: "she/her"}, {label: "he/him", value: "he/him"}, {label: "they/them", value: "they/them"}]

    return(
        // TO DO: Add inputs already there for if they're editing rather than creating
        <Container >
            <Card style={{ width: "20rem" }}>
            <Card.Body>            
                <Card.Title> 
                    Edit Profile
                </Card.Title>
                {/* <SingleselectInput controlId={undefined} label={"Capacity to Host"} text={""} options={capacity} setValue={setCapacity} value={oldCapacity}/> */}
                <Col>
                    <SingleselectInput controlId={undefined} label={"Pronouns"} text={""} options={pronounList} setValue={setPronouns} value={oldPronouns? {label: oldPronouns, value: oldPronouns} : undefined} multi={false}/>
                </Col>
                <Col><Form>
                        <FormInput controlId="host" label="Capacity to host" type="number" text="" setValue={setCapacity} value={oldCapacity} placeholder={undefined}/>
                        <Form.Text className="text-muted">
                            Would you want to host musician friends? If so, how many?
                        </Form.Text>
                    </Form> </Col>
                    <UploadFile setImage={setImage}></UploadFile>
                <Col><Form>
                        <FormInput controlId="bio" label="Bio" type="text" placeholder={oldBio} text="" setValue={setBio} value={oldBio}/>
                        <Form.Text className="text-muted">
                            Share a little bit about yourself!
                        </Form.Text>
                    </Form> </Col>
                <Col><Form> 
                        <FormInput controlId="equipment" label="Equipment" type="text" placeholder={oldEquipment} text="" setValue={setEquipment} value={oldEquipment}/>
                        <Form.Text className="text-muted">
                            What equipment do you have to use?
                        </Form.Text>
                    </Form> </Col>
                {/* <Col><Form> 
                        <FormInput controlId="schedule" label="Schedule" type="text" placeholder={oldSchedule} text="" setValue={setSchedule} value={scheduleSelect}/>
                        <Form.Text className="text-muted">
                            When are you free?
                        </Form.Text>
                    </Form> </Col> */}
            </Card.Body>
            </Card>
        </Container>
    );
}