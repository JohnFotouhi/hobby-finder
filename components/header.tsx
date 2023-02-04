import { Container, Navbar, Nav } from "react-bootstrap";
import Link from "next/link";

export default function Header() {
    return(
        <Navbar bg="light" expand="lg">
            <Container>
            <Nav className="me-auto">
                <Nav.Link href="/search">Home</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/registration">Registration</Nav.Link>
            </Nav>
            </Container>
        </Navbar>
    );
}
