import { Button, Col, Container, Row, Form, Stack, Alert, Navbar } from "react-bootstrap";
import HobbyCard from "@/components/hobbyCard";

export default function User() {
    
    return(
        <>  
            <Container fluid className ="bg-light">

                {/* TODO: For each hobby card in the database associated with the user, populate a hobby card component */}
                <HobbyCard instrument={"Bass"} genre={"rock"} experience={"2 years - Beginner"} commitment={"Looking to join a band"} 
                info={"I'd really love to join a band, but I don't care if we're trash!"} clip={null} owner={false}></HobbyCard>

            </Container>
        </>
    );

}
