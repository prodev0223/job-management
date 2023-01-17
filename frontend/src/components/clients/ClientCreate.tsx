import React, { useState } from 'react'
import { Formik, useFormik } from 'formik';
import * as Yup from "yup";
import { Alert, Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { PlusCircle } from 'react-feather';
import { colors } from 'react-select/dist/declarations/src/theme';
import { useGetTeamsListQuery, useCreateClientMutation, useCreateClientTeamInMicrosoftMutation } from '../../redux/slices/clientsSlice';
import Loader from '../Loader';
import ErrorAlert from '../ErrorAlert';
import LoadingAlert from '../LoadingAlert';

const ClientCreate = () => {

    const { data: teamsList, isLoading: isLoadingTeamsList, isSuccess: isSuccessTeamsList, isError: isErrorTeamsList, error: errorTeamsList } = useGetTeamsListQuery('', {
        refetchOnMountOrArgChange: true,
    });

    const [createClient, { data: clientCreated, isLoading: isLoadingClientCreate, isSuccess: isSuccessClientCreate, isError: isErrorClientCreate, error: errorClientCreate }] = useCreateClientMutation()

    const [createClienInTeams, { data: clientTeamCreated, isLoading: isLoadingClientTeamCreate, isSuccess: isSuccessClientTeamCreate, isError: isErrorClientTeamCreate, error: errorClientTeamCreate }] = useCreateClientTeamInMicrosoftMutation()

    const [teamsChannel, setTeamsChannel] = useState<any>({});
    const [newTeamsChannel, setNewTeamsChannel] = useState<any>({});

    const colors = [
        {
            name: "Primary",
            value: "primary",
        }
    ];

    const initOpenModals = () => {
        let modals = {};

        colors.forEach((color, index) => {
            modals = Object.assign({}, modals, { [index]: false })
        })

        return modals;
    }

    const checkTeamsChannel = (nameProvided: string) => {
        if (teamsList) {
            console.log('teamsList', teamsList.value.find((team: { displayName: string; }) => team.displayName.includes(nameProvided)));
            let found = teamsList.value.find((team: { displayName: string; }) => team.displayName.includes(nameProvided))
            if (!found) {
                createClienInTeams(nameProvided)
            } else {
                setTeamsChannel(found)

            }
        }
    }

    const [openModal, setOpenModal] = useState<any>(() => initOpenModals());

    const toggle = (index: any) => {
        // Toggle selected element
        setOpenModal((openModal: { [x: string]: any }) => Object.assign({}, openModal, { [index]: !openModal[index] }))
    }

    const yupSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
    })

    const formik = useFormik({
        initialValues: {
            name: '',
            submit: false,
        },
        validationSchema: yupSchema,
        onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
                console.log('values', values.name);
                console.log('teamsChannel', teamsChannel);
                if (clientTeamCreated && clientTeamCreated.id) {
                    createClient({
                        name: values.name,
                        teamsId: String(clientTeamCreated.id),
                        isActive: true,
                    })
                } else if (teamsChannel && teamsChannel.id) {
                    createClient({
                        name: values.name,
                        teamsId: String(teamsChannel.id),
                        isActive: true,
                    })
                }
            } catch (error: any) {
                console.log('error', error);
                const message = error.response ? error.response.data.message : error.error ? error.error : 'Something went wrong'
                setStatus({ success: false });
                setErrors({ submit: message });
                setSubmitting(false);
            }
        }
    })


    let content;

    if (isLoadingTeamsList) {
        content = (
            <Loader />
        )
    } else if (isErrorTeamsList) {
        content = (
            <ErrorAlert title="Error Loading Teams List!" error={JSON.stringify(errorTeamsList, null, 2)} />
        )
    } else if (isSuccessTeamsList) {
        content = (
            <>
                {colors.map((color, index) => (
                    <React.Fragment key={index}>
                        <Button
                            variant={color.value}
                            onClick={() => toggle(index)}
                            className="me-1 form-control"
                            size="lg"
                        >
                            <PlusCircle size={18} />
                        </Button>
                        <Modal
                            show={openModal[index]}
                            onHide={() => toggle(index)}
                            centered
                            size="lg"
                        >
                            <Modal.Header>
                                Create new Client
                        </Modal.Header>
                            <Form onSubmit={formik.handleSubmit}>
                                {formik.errors.submit && (
                                    <Alert className="my-3" variant="danger">
                                        <div className="alert-message">{formik.errors.submit}</div>
                                    </Alert>
                                )}
                                {isErrorClientCreate && (
                                    <Alert className="my-3" variant="danger">
                                        <div className="alert-message">{JSON.stringify(errorClientCreate, null, 2)}</div>
                                    </Alert>
                                )}
                                <Modal.Body>
                                    <Row className="mb-3">
                                        <Form.Group className="mb-3" as={Col} md={4}>
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                size="lg"
                                                type="name"
                                                name="name"
                                                placeholder="Enter the client name"
                                                value={formik.values.name}
                                                isInvalid={Boolean(formik.touched.name && formik.errors.name)}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                            />
                                            {!!formik.touched.name && (
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.name}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                        <Form.Group className="mb-3" as={Col} md={4}>
                                            <Row>
                                                <Form.Label>Check/Generate Teams Channel</Form.Label>
                                                {isLoadingClientTeamCreate ? (
                                                    <Loader />
                                                ) : (
                                                    <Button
                                                        className="form-control"
                                                        size="lg"
                                                        onClick={() => checkTeamsChannel(formik.values.name)}
                                                        disabled={formik.values.name.length <= 0}
                                                    >
                                                        +
                                                    </Button>
                                                )}
                                            </Row>
                                        </Form.Group>
                                        <Form.Group className="mb-3" as={Col} md={4}>
                                            <Form.Label>Teams Status</Form.Label>
                                            {" "}
                                            {Object.keys(teamsChannel).length > 0 ? (
                                                <Row>
                                                    <p>{JSON.stringify(teamsChannel.displayName)} was found in Teams! Using this...</p>
                                                </Row>
                                            ) : isErrorClientTeamCreate ? (
                                                <Row>
                                                    <p>{JSON.stringify(errorClientTeamCreate, null, 2)}</p>
                                                </Row>
                                            ) : isSuccessClientTeamCreate ? (
                                                <Row>
                                                    <p>{JSON.stringify(clientTeamCreated?.id, null, 2)}</p>
                                                    <p>{JSON.stringify(clientTeamCreated?.displayName, null, 2)}</p>
                                                </Row>
                                            ) : null}
                                        </Form.Group>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="outline-danger" onClick={() => toggle(index)}>
                                        Cancel
                                    </Button>{" "}
                                    {isLoadingClientCreate ? (
                                        <Loader />
                                    ) : (
                                        <Button type="submit" variant="primary" disabled={formik.isSubmitting} onClick={() => toggle(index)}>
                                            Create New Client
                                        </Button>
                                    )}
                                </Modal.Footer>
                            </Form>
                        </Modal>
                    </React.Fragment>
                ))}
            </>
        )
    } else if (isSuccessClientCreate) {
        content = (
            <Card>
                <Card.Body>
                    Success!
                </Card.Body>
            </Card>
        )
    } else {
        content = (
            <Loader />
        )
    }

    return content;
}

export default ClientCreate
