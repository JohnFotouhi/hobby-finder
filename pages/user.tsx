import { Button, Col, Container, Row, Form, Stack, Alert, Navbar } from "react-bootstrap";
import HobbyCard from "@/components/hobbyCard";
import UploadImage from "@/components/uploadImage";
import UserInformation from "@/components/userInformation";

export default function User() {
    
    return(
        <>  
            <UserInformation canHost={true} hasEquipment={true} displayName={"Larry"} bio={"I am good at music lmao"}></UserInformation>
            <Container fluid className ="bg-light">

                <Col><Button>Reach Out</Button></Col>

                {/* TODO: For each hobby card in the database associated with the user, populate a hobby card component */}
                <HobbyCard instrument={"Bass"} genre={"rock"} experience={"2 years - Beginner"} commitment={"Looking to join a band"} 
                info={"Id really love to join a band, but I dont care if we are trash!"} owner={false} editCard={null}></HobbyCard>

            </Container>
        </>
    );

}
