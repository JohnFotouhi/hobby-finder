import { Button, Form, Stack, Alert, Navbar } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BsSearch } from "react-icons/bs";
import { useState } from "react";
import SearchForm from "@/components/searchForm";
import SearchCard from "@/components/SearchCard";

// style={{display: "flex", alignItems: "center"}}

export default function Search() {
    const [editFilters, setEditFilters] = useState(false);
    function handleEditFilters(){
        setEditFilters(!editFilters);
    }
    function handleSearch(){
        setEditFilters(false);
    }

    const users = [
        {
            name: "John Doe",
            experience: "high",
            id: "1234",
            skills: "guitar, piano",
            distance: "4 miles",
            commitment: "medium",
            genre: "rock, pop"
        },
        {
            name: "John Doe",
            experience: "high",
            id: "1234",
            skills: "guitar, piano",
            distance: "4 miles",
            commitment: "medium",
            genre: "rock, pop"
        },
        {
            name: "John Doe",
            experience: "high",
            id: "1234",
            skills: "guitar, piano",
            distance: "4 miles",
            commitment: "medium",
            genre: "rock, pop"
        },
        {
            name: "John Doe",
            experience: "high",
            id: "1234",
            skills: "guitar, piano",
            distance: "4 miles",
            commitment: "medium",
            genre: "rock, pop"
        },
        {
            name: "John Doe",
            experience: "high",
            id: "1234",
            skills: "guitar, piano",
            distance: "4 miles",
            commitment: "medium",
            genre: "rock, pop"
        },{
            name: "John Doe",
            experience: "high",
            id: "1234",
            skills: "guitar, piano",
            distance: "4 miles",
            commitment: "medium",
            genre: "rock, pop"
        },{
            name: "John Doe",
            experience: "high",
            id: "1234",
            skills: "guitar, piano",
            distance: "4 miles",
            commitment: "medium",
            genre: "rock, pop"
        },{
            name: "John Doe",
            experience: "high",
            id: "1234",
            skills: "guitar, piano",
            distance: "4 miles",
            commitment: "medium",
            genre: "rock, pop"
        },{
            name: "John Doe",
            experience: "high",
            id: "1234",
            skills: "guitar, piano",
            distance: "4 miles",
            commitment: "medium",
            genre: "rock, pop"
        },{
            name: "John Doe",
            experience: "high",
            id: "1234",
            skills: "guitar, piano",
            distance: "4 miles",
            commitment: "medium",
            genre: "rock, pop"
        },
    ]

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
            <Container className="mt-3">
                <Row className='m-auto'>
                    {users.map(user =>(
                        <Col md="4" key={user.id}>
                            <SearchCard {...user} />
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
}