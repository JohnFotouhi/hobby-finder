import { Container, Navbar, Nav, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthUser, withAuthUser } from "next-firebase-auth";
import { BsPersonCircle } from "react-icons/bs";

const Header = () => {
    const router = useRouter();
    const showHeader = router.pathname === "/login" ? false : true;
    const AuthUser = useAuthUser();
    const logout = () => { AuthUser.signOut() }

    return (
        <>
        {showHeader &&
            <Navbar bg="light" expand="lg">
                <Container>
                <Nav className="mr-auto">
                    <Nav.Link href="/search">Home</Nav.Link>
                </Nav>
                <Nav className="ml-auto">
                    <Nav.Link href="/profile" className="ml-auto"><BsPersonCircle size="24"/></Nav.Link>
                    <Nav.Link onClick={logout} className="ml-auto">Logout</Nav.Link>
                </Nav>
                </Container>
            </Navbar>
        }
        </>
    );
}

export default withAuthUser({})(Header)
