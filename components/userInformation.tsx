import { Button, Col, Container, Row, Form, Card, Modal, Dropdown} from "react-bootstrap";
import {useState} from "react"
import UploadImage from "./uploadImage";

export default function UserInformation(){
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
                    {/* name
                    bio */}
                </Col>
            </Row>

            <Row>
                <Col>
                    {/* Can host */}
                </Col>
                <Col>
                    {/* Equipment */}
                </Col>
                <Col>
                    {/* Schedule */}
                </Col>
            </Row>
                
            
        </Container>
    );
}