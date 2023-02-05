import { Form } from "react-bootstrap"

export default function FormInput({controlId, label, type, placeholder, text}){
 return(
    <Form.Group className="mb-3" controlId={controlId}>
        <Form.Label>{label}</Form.Label>
        <Form.Control type={type} placeholder={placeholder} />
        <Form.Text className="text-muted">{text}</Form.Text>
    </Form.Group>
 );
}