import { useState } from "react";
import { Form } from "react-bootstrap"
import Multiselect from "multiselect-react-dropdown";

export default function MultiselectInput({controlId, label, text, options, selected, setSelected}){
 return(
    <Form.Group className="mb-3" controlId={controlId}>
        <Form.Label>{label}</Form.Label>
        <Multiselect 
            options={options}
            selectedValues={selected}
            onSelect={setSelected}
            onRemove={setSelected}
            displayValue="name"/>
        <Form.Text className="text-muted">{text}</Form.Text>
    </Form.Group>
 );
}