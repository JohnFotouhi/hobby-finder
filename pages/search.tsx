import { Button, Form, Stack, Alert, Navbar } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BsSearch } from "react-icons/bs";
import { useState } from "react";
import SearchForm from "@/components/searchForm";

// style={{display: "flex", alignItems: "center"}}

export default function Search() {
    const [editFilters, setEditFilters] = useState(false);
    function handleEditFilters(){
        setEditFilters(!editFilters);
    }

    function handleSearch(){
        setEditFilters(false);
    }
    return(
        <>  
            <Container fluid className='bg-light' >
                {!editFilters && <Row className='m-auto' >
                    <Col className="text-center">
                        <Button variant="light outline-primary" size="lg" onClick={handleEditFilters}> <BsSearch/> Instrument | Genre | Experience</Button>
                    </Col>
                </Row>}
                {editFilters && <Row className='m-auto'>
                    <Col className="text-center">
                        <SearchForm search={handleSearch}/>
                    </Col>
                </Row>}
            </Container>
        </>
    );
}