import HobbyCardEditor from "@/components/hobbyCardEditor";
import { useState } from "react";
import { Button, Col, Container, Row, Form, Stack, Alert, Navbar } from "react-bootstrap";

export default function Profile() {

    fetch("/api/hobbyCardCreation", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data: "Some Data"})
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
      });

    //Hobby Card Functions
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const handleShow = () => setShow(true);

    function handleCreate(){
        handleShow();

    }
    
    return(
        <>  
            <Button onClick={handleCreate}>Create New Hobby Card</Button>
            <HobbyCardEditor setShow={setShow} show={show} newCard={true} instrument={"Voice"} genre={"Rock"} experience={"Beginner"} commitment={"2 hours weekly"} info={"I dont care"}></HobbyCardEditor>
        </>
    );

}
