import { Container, Navbar, Nav, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthUser, withAuthUser } from "next-firebase-auth";

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
                <Nav className="me-auto">
                    <Nav.Link href="/search">Home</Nav.Link>
                    <Nav.Link href="/profile">Profile</Nav.Link>
                    <Nav.Link onClick={logout}>Logout</Nav.Link>
                </Nav>
                </Container>
            </Navbar>
        }
        </>
    );
}

export default withAuthUser({})(Header)
