import { Container, Navbar, Nav, Spinner, Image, Modal, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthUser, withAuthUser } from "next-firebase-auth";
import { BsPersonCircle, BsPersonFillAdd, BsFillChatFill } from "react-icons/bs";
import logo from '../public/JAM.png'
import globals from '../styles/Home.module.css'

const Header = () => {
    const [confirmLogout, setConfirmLogout] = useState(false);
    const router = useRouter();
    const showHeader = router.pathname === "/login" ? false : true;
    const AuthUser = useAuthUser();
    const logout = () => {
        setConfirmLogout(false);
        AuthUser.signOut();
    }
    return (
        <>
        {showHeader &&
            <Navbar bg="light" className="mx-0" expand="md">
                <Container fluid>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                <Nav className="me-auto"> 
                    <Navbar.Brand className="p-0"><Nav.Link href="/about" style={{color:"black"}}><Image src={logo.src} height="22" width="22" roundedCircle></Image>Jam</Nav.Link></Navbar.Brand>
                    <Nav.Link href="/about">About</Nav.Link>
                    <Nav.Link href="/search">Search</Nav.Link>
                    <Nav.Link href="/events">Events</Nav.Link>
                </Nav>
                <Nav className="">
                    <Nav.Link href="/messages" className=""><BsFillChatFill size="24"/></Nav.Link>
                    <Nav.Link href="/friends" className=""><BsPersonFillAdd size="24"/></Nav.Link>
                    <Nav.Link href="/profile" className=""><BsPersonCircle size="24"/></Nav.Link>
                    <Nav.Link onClick={() => setConfirmLogout(true)} className="">Logout</Nav.Link>
                </Nav>
                </Navbar.Collapse>
                </Container>
            </Navbar>
        }
        <Modal show={confirmLogout} onHide={() => setConfirmLogout(false)}>
            <Modal.Header> <Modal.Title>Are you sure you want to logout?</Modal.Title></Modal.Header>
            <Modal.Footer>
            <Button className={globals.btn} variant="primary" onClick={logout}>
                Logout
            </Button>
            <Button variant="secondary" onClick={() => setConfirmLogout(false)}>
                Cancel
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

export default withAuthUser({})(Header)
