import React, { useEffect, useState } from 'react'
import { Button, Form, Row, Col, Card } from 'react-bootstrap';
import { CheckCircle, ExternalLink, Loader, PlusCircle } from 'react-feather';
import { Link } from 'react-router-dom';
import validator from 'validator';
import ClientCreate from '../../../../components/clients/ClientCreate';
import CustomSelect from '../../../../components/CustomSelect';
import ErrorAlert from '../../../../components/ErrorAlert';
import { useCreateClientTeamInMicrosoftMutation, useGetClientsQuery, useGetClientTeamsByIdQuery, useUpdateClientMutation } from '../../../../redux/slices/clientsSlice';

const CreateStep1 = ({ nextStep, prevStep, handleFormData, values }: { nextStep: any, prevStep?: any, handleFormData: any, values: any; }) => {


    const { data: clients, isLoading: isLoadingClients, isError: isErrorClients, isSuccess: isSuccessClients, error: errorClients } = useGetClientsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    })

    const [createClientInTeams, { data: clientTeamCreated, isLoading: isLoadingClientTeamCreate, isSuccess: isSuccessClientTeamCreate, isError: isErrorClientTeamCreate, error: errorClientTeamCreate }] = useCreateClientTeamInMicrosoftMutation()

    const [updateClient, { isLoading: isLoadingUpdateClient, isError: isErrorUpdateClient, isSuccess: isSuccessUpdateClient, error: errorUpdateClient }] = useUpdateClientMutation();


    const [error, setError] = useState(false);
    const [teamsError, setTeamsError] = useState(false);
    const [newClient, setNewClient] = useState(false);
    const [updated, setUpdated] = useState(false);



    // if (isSuccessUpdateClient) {
    //     setUpdated(true);
    //     nextStep()
    // }

    // if (isSuccessClientTeamCreate) {
    //     console.log('TEAM CREATED', clientTeamCreated);
    //     if (values.client && clientTeamCreated) {
    //         updateClient({
    //             clientId: values.client._id,
    //             client: {
    //                 name: values.client.name,
    //                 isActive: true,
    //                 teamsId: clientTeamCreated.id
    //             }
    //         })
    //     }
    // }

    const handleSaveClient = () => {
        if (values.client && clientTeamCreated) {
            updateClient({
                clientId: values.client._id,
                client: {
                    name: values.client.name,
                    isActive: true,
                    teamsId: clientTeamCreated.id
                }
            })
        }
    }

    const handleCreateClientInTeams = (input: any) => {
        console.log('input', input);

        createClientInTeams(input);
    }

    let content;

    const submitFormData = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        //console.log('values.client', values.client);
        //console.log('isEmpty', validator.isEmpty(values.client._id))
        if (validator.isEmpty(values.client._id)) {
            setError(true);
        } else if (validator.equals(values.client.teamsId, "UNKNOWN")) {
            setTeamsError(true);
        } else {
            nextStep();
        }
    }

    if (isLoadingClients || isLoadingUpdateClient) {
        content = (
            <React.Fragment>
                <Loader />
            </React.Fragment>
        )
    } else if (isSuccessClients) {

        let clientOptions: { label: string; value: string; }[] = []

        clients && clients.map(client => {
            clientOptions.push({ label: client.name, value: client._id })
        })

        content = (
            <Form onSubmit={submitFormData}>
                <Card>
                    <Card.Header>Client Details</Card.Header>
                    <Card.Body>

                        <Row>
                            <Form.Group className="mb-3" as={Col} md={8}>
                                <Form.Label>Select Client</Form.Label>
                                <CustomSelect
                                    className='react-select-container'
                                    //@ts-ignore
                                    onChange={handleFormData("client")}
                                    value={values.client}
                                    options={clientOptions.sort((a, b) => a.label.localeCompare(b.label))}
                                />
                                {/* {
                        !!values.client?._id && (
                            <div style={{
                                display: 'block',
                                width: '100%',
                                marginTop: '0.25rem',
                                fontSize: '80%',
                                color: '#d9534f'
                            }}>
                            No client selected!
                            </div>
                            )
                        } */}
                                {error ? (
                                    <Form.Text style={{ color: "red" }}>
                                        This is a required field
                                    </Form.Text>
                                ) : (
                                    ""
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3" as={Col} md={2}>
                                <Form.Label>Link</Form.Label>
                                <Link style={{ textDecoration: 'none' }} to={`/clients/${values.client?._id}`} target="_blank" rel="noopener noreferrer">
                                    <Button className="form-control" size="lg" variant="success">
                                        <ExternalLink size={18} />
                                    </Button>
                                </Link>
                            </Form.Group>
                            <Form.Group className="mb-3 text-center" as={Col} md={2}>
                                <Form.Label>New Client</Form.Label>
                                <ClientCreate />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group>
                                <React.Fragment>
                                    <Form.Label><strong>Teams:</strong></Form.Label>{" "}
                                    {console.log('values.client', values.client)}
                                    {values.client.teamsId !== "UNKNOWN" ? (
                                        <CheckCircle color="green" />
                                    ) : isLoadingClientTeamCreate ? (
                                        <Loader />
                                    ) : isSuccessClientTeamCreate ? (
                                        <React.Fragment>
                                            Team created! {JSON.stringify(clientTeamCreated?.id, null, 2)}
                                            <Button variant="primary" className="form-control" onClick={() => handleSaveClient()}>
                                                Save to Client
                                            </Button>
                                        </React.Fragment>
                                    ) : isErrorClientTeamCreate ? (
                                        <React.Fragment>
                                            <ErrorAlert error={JSON.stringify(errorClientTeamCreate, null, 2)} title="Error creating client teams" />
                                        </React.Fragment>
                                    ) : (
                                        <Button variant="primary" className="form-control" onClick={() => handleCreateClientInTeams(values.client.name)}>
                                            <PlusCircle size={14} />
                                        </Button>
                                    )}
                                </React.Fragment>
                            </Form.Group>
                            {teamsError ? (
                                <Form.Text style={{ color: "red" }}>
                                    Teams needs to be created first!
                                </Form.Text>
                            ) : (
                                ""
                            )}
                        </Row>
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
    } else if (isErrorClients) {
        content = (
            <React.Fragment>
                <ErrorAlert title="Error loading clients!" error={JSON.stringify(errorClients, null, 2)} />
            </React.Fragment>
        )
    } else if (isErrorClientTeamCreate) {
        content = (
            <React.Fragment>
                <ErrorAlert title="Error Creating Teams!" error={JSON.stringify(errorClientTeamCreate, null, 2)} />
            </React.Fragment>
        )
    } else if (isErrorUpdateClient) {
        content = (
            <React.Fragment>
                <ErrorAlert title="Error Updating Client!" error={JSON.stringify(errorUpdateClient, null, 2)} />
            </React.Fragment>
        )
    } else {
        content = (
            <React.Fragment>
                <Loader />
            </React.Fragment>
        )
    }

    return content;
}

export default CreateStep1
