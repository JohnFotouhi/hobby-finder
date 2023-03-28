import { Button, Col, Container, Row, Form, Card, Modal, Dropdown} from "react-bootstrap";
import MultiselectInput from "./multiselectInput";
import { useState } from "react";
import SingleselectInput from "./singleselectinput";
import FormInput from "./formInput";
import { optionCSS } from "react-select/dist/declarations/src/components/Option";
import { updateProfile } from "firebase/auth";
import UploadFile from "./uploadFile";
import Table from "react-bootstrap/Table";
import Image from 'next/image';
import Checkbox from "./checkBox";

export default function UserInformationEditor({setShowProfileEditor, showProfileEditor, oldName, setName, oldPronouns, setPronouns, oldCapacity, setCapacity, oldBio, setBio, oldEquipment, setEquipment, oldAvailability, setAvailability, setImage, profilePicture}) {
    

    const capacity = [{label: "1", value: "capacity1"}, {label: "2", value: "capacity2"}, {label: "3", value: "capacity3"}, {label: "4", value: "capacity4"}, {label: "5", value: "capacity5"},
                            {label: "6", value: "capacity6"}, {label: "7", value: "capacity7"}, {label: "8+", value: "capacity8"},]
    const pronounList = [{label: "she/her", value: "she/her"}, {label: "he/him", value: "he/him"}, {label: "they/them", value: "they/them"}]


    type Day = {
        m: boolean,
        a: boolean,
        e: boolean,
        n: boolean
      }

    function changeAvailability(day, time, value)  {
        //each checkbox sends a string on check
        //checked against a switch
        const dayUpdate = oldAvailability[day];
        console.log(dayUpdate);
        // dayUpdate.time = value;

        
    }

    return(
        // TO DO: Add inputs already there for if they're editing rather than creating

    
<Container style={{padding: 10}}>
            <Row style={{padding: 60}}>

                <Col className="col-md-3">
                    <Col>
                        <Row>
                            <Image className= "square bg-light rounded-pill" src={profilePicture} alt="profile_picture" width="200" height = "200"></Image>

                        </Row>
                        <Row style={{padding: 10}}>
                                <Col className="col-md-8" style={{justifyContent: "center", alignContent: "center"}}>
                                    <p style = {{fontSize: "12px"}}>update profile picture</p>
                                </Col>
                                <Col style={{justifyContent: "right"}}>
                                    <UploadFile setImage={setImage}></UploadFile>   
                                </Col>     
                        </Row>
                        
                        {/* <Row style={{padding: 20}}>
                            <SingleselectInput controlId={undefined} label={"Pronouns"} text={""} options={pronounList} setValue={setPronouns} 
                            value={oldPronouns? {label: oldPronouns, value: oldPronouns} : undefined} multi={false}/>
                        </Row> */}
                    </Col>
                    
                    
                </Col>
                <Col className="col-md-4" >
                    <Row style={{padding: 25}}>
                        <Form style = {{height: "100%"}}>
                                <FormInput controlId="name" label="Update profile name" type="text" placeholder={oldName} text="" setValue={setName} value={oldName}/> 
                            </Form> 
                        </Row>
                    <Row style={{padding: 20}}>
                        <Form>
                        {/* <textarea name="bio" rows={4} cols={40} value={oldBio}></textarea> */}
                            <FormInput controlId="bio" label="Share a little about yourself" type="text" placeholder={oldBio} text="" setValue={setBio} value={oldBio}/>
                            
                        </Form> 
                    </Row>
                        
                </Col>
                <Col className="col-md-5" style ={{height: "100%", width: "40%"}}>
                    <div style={{alignContent: "center"}}>Availability</div>
                    <Table style={{backgroundColor: "whitesmoke"}}>
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
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(0, "morn", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(1, "morn", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(2, "morn", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(3, "morn", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(4, "morn", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(5, "morn", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(6, "morn", e)}/></td>
                            </tr>
                            <tr>
                                <td>Afternoon</td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(0, "aft", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(1, "aft", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(2, "aft", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(3, "aft", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(4, "aft", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(5, "aft", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(6, "aft", e)}/></td>
                            </tr>
                            <tr>
                                <td>Evening</td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(0, "eve", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(1, "eve", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(2, "eve", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(3, "eve", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(4, "eve", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(5, "eve", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(6, "eve", e)}/></td>
                            </tr>
                            <tr>
                                <td>Night</td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(0, "night", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(1, "night", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(2, "night", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(3, "night", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(4, "night", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(5, "night", e)}/></td>
                                <td><Checkbox label={undefined} isSelected={undefined} onCheckboxChange={e => changeAvailability(6, "night", e)}/></td>
                            </tr>
                        </tbody>
                    </Table>
                    <Row style={{padding: 20}}>
                        <Col>
                            <Form>
                                <FormInput controlId="host" label="Capacity to host" type="number" text="" setValue={setCapacity} value={oldCapacity} placeholder={undefined}/>
                                <Form.Text className="text-muted">
                                    Would you want to host musician friends? If so, how many?
                                </Form.Text>
                            </Form> 
                        </Col>
                    </Row>
                    <Row style={{padding: 20}}>
                        <Col>
                            <Form> 
                                <FormInput controlId="equipment" label="Equipment" type="text" placeholder={oldEquipment} text="" setValue={setEquipment} value={oldEquipment}/>
                                <Form.Text className="text-muted">
                                    Do you have any audio equipment you are willing to share?
                                </Form.Text>
                            </Form> 
                        </Col>
                    </Row> 
                </Col> 
            </Row>

          
            

            
                
            <hr></hr>
        </Container>

     
    );
}