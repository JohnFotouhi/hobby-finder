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
            <Navbar bg="light" className="mx-0">
                <Navbar.Brand className="p-0 mx-3"><Image src={logo.src} height="22" width="22" className="mb-1" roundedCircle></Image>Jam</Navbar.Brand>
                <Container className="mx-0 px-0" fluid>   
                <Nav className="mr-auto"> 
                    <Nav.Link href="/about">About</Nav.Link>
                    <Nav.Link href="/search">Search</Nav.Link>
                </Nav>
                <Nav className="ml-auto mx-2">
                    <Nav.Link href="/messages" className="ml-auto"><BsFillChatFill size="24"/></Nav.Link>
                    <Nav.Link href="/friends" className="ml-auto"><BsPersonFillAdd size="24"/></Nav.Link>
                    <Nav.Link href="/profile" className="ml-auto"><BsPersonCircle size="24"/></Nav.Link>
                    <Nav.Link onClick={() => setConfirmLogout(true)} className="ml-auto">Logout</Nav.Link>
                </Nav>
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
