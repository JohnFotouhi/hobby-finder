import { Button, Col, Container, Row, Form, Stack, Alert, Navbar } from "react-bootstrap";
import HobbyCard from "@/components/hobbyCard";
import UploadImage from "@/components/uploadImage";

export default function User() {
    
    return(
        <>  
            <Container fluid className ="bg-light">

                {/* TODO: Get personal information in the database associated with the user, populate user information */}
                <UploadImage image = "dab"> </UploadImage>

            </Container>
            <Container fluid className ="bg-light">

                {/* TODO: For each hobby card in the database associated with the user, populate a hobby card component */}
                <HobbyCard instrument={"Bass"} genre={"rock"} experience={"2 years - Beginner"} commitment={"Looking to join a band"} 
                info={"Id really love to join a band, but I dont care if we are trash!"} clip={null} owner={true}></HobbyCard>

            </Container>
        </>
    );

}
