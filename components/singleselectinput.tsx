import { useState } from "react";
import { Form } from "react-bootstrap"
import Select from "react-select"


export default function SingleselectInput({controlId, label, text, options, setValue, value}){

    return(
        <Form.Group className="mb-3" controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            <Select
                isSearchable={true} 
                defaultValue={value}
                onChange={setValue}
                options={options}
                />
            <Form.Text className="text-muted">{text}</Form.Text>
        </Form.Group>
    );
}