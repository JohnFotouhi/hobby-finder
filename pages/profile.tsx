import HobbyCardEditor from "@/components/hobbyCardEditor";
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
    
    return(
        <>  
            <HobbyCardEditor instrument={"Voice"} genre={"Rock"} experience={"Beginner"} commitment={"2 hours weekly"} info={"I dont care"}></HobbyCardEditor>
        </>
    );

}
