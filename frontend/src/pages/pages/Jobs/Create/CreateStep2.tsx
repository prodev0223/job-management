import React, { useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap';
import validator from 'validator';

const CreateStep2 = ({ nextStep, prevStep, handleFormData, values }: { nextStep: any, prevStep: any, handleFormData: any, values: any; }) => {

    const [error, setError] = useState(false);

    const submitFormData = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (validator.isEmpty(values.contactName) || validator.isEmpty(values.contactEmail) || validator.isEmpty(values.contactPhone)) {
            setError(true);
        } else if (!validator.isEmail(values.contactEmail)) {
            setError(true);
        } else {
            nextStep();
        }
    }

    return (
        <Form onSubmit={submitFormData}>
            <Card>
                <Card.Header>Contact Details</Card.Header>
                <Card.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Contact Name</Form.Label>
                        <Form.Control
                            style={{ border: error ? "2px solid red" : "" }}
                            name="contactName"
                            defaultValue={values.contactName}
                            type="text"
                            placeholder="Contact Name"
                            onChange={handleFormData("contactName")}
                        />
                        {error ? (
                            <Form.Text style={{ color: "red" }}>
                                This is a required field
                            </Form.Text>
                        ) : (
                            ""
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Contact Email</Form.Label>
                        <Form.Control
                            style={{ border: error ? "2px solid red" : "" }}
                            name="contactEmail"
                            defaultValue={values.contactEmail}
                            type="text"
                            placeholder="Contact Email"
                            onChange={handleFormData("contactEmail")}
                        />
                        {error ? (
                            <Form.Text style={{ color: "red" }}>
                                This is a required field
                            </Form.Text>
                        ) : (
                            ""
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Contact Phone</Form.Label>
                        <Form.Control
                            style={{ border: error ? "2px solid red" : "" }}
                            name="contactPhone"
                            defaultValue={values.contactPhone}
                            type="text"
                            placeholder="Contact Phone"
                            onChange={handleFormData("contactPhone")}
                        />
                        {error ? (
                            <Form.Text style={{ color: "red" }}>
                                This is a required field
                            </Form.Text>
                        ) : (
                            ""
                        )}
                    </Form.Group>
                    <div className="mt-3 text-center">
                        {prevStep ? (
                            <Button
                                className="me-1 mb-1"
                                type="submit"
                                variant="outline-danger"
                                size="lg"
                                onClick={() => prevStep()}
                            >
                                Back
                            </Button>
                        ) : null}
                        <Button
                            className="me-1 mb-1"
                            type="submit"
                            variant="primary"
                            size="lg"
                        >
                            Continue
                        </Button>
                    </div>
                </Card.Body>
            </Card>

        </Form >
    )
}

export default CreateStep2
