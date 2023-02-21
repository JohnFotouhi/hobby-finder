import { Button, Col, Container, Row, Form, Card, Modal, Dropdown} from "react-bootstrap";
import {useState} from "react"
import UploadImage from "./uploadImage";

export default function UserInformation({canHost, hasEquipment, displayName, bio}){
    const [file, setFile] = useState("");

    // Handles input change event and updates state
    function handleChange(event) {
        setFile(event.target.files[0]);
    }

    return (
        <Container>
            <Row>
                <Col>
                    <UploadImage image = ""></UploadImage>
                </Col>
                <Col>
                    <Col>
                        hi this is my name
                    </Col>
                    <Col>
                        some interesting facts about me
                    </Col>
                </Col>
            </Row>

            <Row>
                <Col>
                    {/* Can host */}
                    host button
                </Col>
                <Col>
                    {/* Equipment */}
                    equipment button
                </Col>
                <Col>
                    {/* Schedule */}
                    schedule button
                </Col>
            </Row>
                
            
        </Container>
    );
}