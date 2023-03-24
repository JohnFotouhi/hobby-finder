import { AuthAction, withAuthUser } from "next-firebase-auth";
import FullPageLoader from "../components/FullPageLoader";
import { Button, Col, Row, Container } from "react-bootstrap";
import logo from '../public/JAM.png'
import React from 'react';
import globals from '../styles/Home.module.css'

const About = () => {

    return(
        <>  
            <Container className={globals.main}>
                <Row className="justify-content-md-center" >
                    <Col lg={2} md={3} sm={4}>
                    <img src="JAM.png" alt="site logo. Jam jar." height={200}/>
                    </Col>
                    <Col lg={2} md={3} sm={4}>
                    <h1 className={globals.logo} style={{paddingLeft:"10px", paddingTop: "55px"}}>Jam</h1>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <p style={{textAlign: "center", fontFamily: "sans-serif", fontSize: "20px", fontWeight: "500"}}>We believe most hobbies are best when shared - especially musical ones. <br></br>
                        Whether you're learning a new instrument or starting the next big band, we want to connect you with nearby musicians 
                        looking to make music just like you. 
                    </p>
                </Row>
                <Row lg={3} md={3} className="justify-content-md-center">
                    <Button className={globals.bigButton}>Start Jammin</Button>
                </Row>
            </Container>
        </>
    );
}

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: FullPageLoader,
  })(About)