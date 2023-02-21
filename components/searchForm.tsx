import { Button, Col, Container, Row, Form } from "react-bootstrap";
import FormInput from "./formInput";
import { BsSearch } from "react-icons/bs";
import { useState } from "react";
import MultiselectInput from "./multiselectInput";

export default function SearchForm(search){
    const [distance, setDistance] = useState();
    const [skills, setSkills] = useState([]);
    const [experienceLevels, setExperienceLevels] = useState([]);
    const [genres, setGenres] = useState([]);
    const [commitmentLevels, setCommitmentLevels] = useState([]);
    const experienceLevelOptions = [{name: "Low: Less than 3 years", id: "XP1"}, {name: "Medium: 3-6 years", id: "XP2"}, {name: "High: more than 6 years", id: "XP3"}];
    const skillOptions = [{name: "Acapella", id: "skill1"}, {name: "Guitar", id: "skill2"}, {name: "Piano", id: "skill3"}, {name: "Other", id: "skill0"}];
    const genreOptions = [{name: "Rock", id: "genre1"}, {name: "Jazz", id: "genre2"}, {name: "Classical", id: "genre3"}, {name: "Other", id: "genre0"}];
    const commitmentLevelOptions = [{name: "Low: Less than 3 hours per week", id: "commit1"}, {name: "Medium: 3-7 hours per week", id: "commit2"}, {name: "High: more than 7 hours per week", id: "commit3"}];    
    return(
        <Form>
            <Container>
                <Row>
                    <Col>
                        <MultiselectInput
                            controlId="skillInput"
                            label="Skills"
                            text=""
                            options={skillOptions} 
                            selected={skills} 
                            setSelected={setSkills}                        
                        />
                    </Col>
                    <Col>
                        <MultiselectInput
                        controlId="genreInput"
                        label="Genre of Music"
                        text=""
                        options={genreOptions}
                        selected={genres} 
                        setSelected={setGenres}
                        />
                    </Col>
                    <Col>
                        <MultiselectInput
                        controlId="commitmentInput"
                        label="Time Commitment"
                        text=""
                        options={commitmentLevelOptions}
                        selected={commitmentLevels} 
                        setSelected={setCommitmentLevels}
                        />
                    </Col>
                    <Col>
                        <MultiselectInput
                        controlId="experienceInput"
                        label="Experience Level"
                        text=""
                        options={experienceLevelOptions}
                        selected={experienceLevels} 
                        setSelected={setExperienceLevels}
                        />
                    </Col>
                    <Col>
                        <FormInput controlId="distanceInput" label="Distance" type="number" placeholder="" text="Max. distance in miles" value={distance} setValue={setDistance} min={1} />
                    </Col>
                    <Col>
                        <Button onClick={search.search} className="mt-4"><BsSearch/></Button>
                    </Col>
                </Row>
            </Container>
        </Form>
    );
}