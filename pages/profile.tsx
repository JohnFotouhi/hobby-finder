import HobbyCardEditor from "@/components/hobbyCardEditor";
import { Button, Col, Container, Row, Form, Stack, Alert, Navbar } from "react-bootstrap";

export default function Profile() {

    fetch("/api/search", {
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
            <HobbyCardEditor instrument={undefined} genre={undefined} experience={undefined} commitment={undefined} info={undefined} clip={undefined}></HobbyCardEditor>
        </>
    );

}
