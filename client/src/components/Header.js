import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Outlet } from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap'

const Header = () => {

    return(
        <>
        <Navbar bg="light" expand="lg">
            <Nav className="me-auto">
                <LinkContainer to="explore">
                    <Nav.Link>Explore</Nav.Link>
                </LinkContainer>
                <LinkContainer to="search">
                    <Nav.Link>Search</Nav.Link>
                </LinkContainer>
            </Nav>
        </Navbar>
        <Outlet />
        </>
    );
}

export default Header;