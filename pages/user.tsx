import { Button, Col, Container, Row, Form, Stack, Alert, Navbar } from "react-bootstrap";
import HobbyCard from "@/components/hobbyCard";
import { useAuthUser } from "next-firebase-auth";

export default function User() {

    //user credentials
    const AuthUser = useAuthUser();
    console.log(AuthUser);
    
    return(
        <>  
            <Container fluid className ="bg-light">

                <Col><Button>Reach Out</Button></Col>

                {/* TODO: For each hobby card in the database associated with the user, populate a hobby card component */}
                <HobbyCard uid={AuthUser.id} index={0} instrument={"Bass"} genre={"rock"} experience={"2 years - Beginner"} commitment={"Looking to join a band"} 
                info={"Id really love to join a band, but I dont care if we are trash!"} owner={false} editCard={null}></HobbyCard>

            </Container>
        </>
    );

}
