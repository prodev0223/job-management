import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Formik, useFormik } from 'formik';
import * as Yup from "yup";
import { Alert, Badge, Button, Card, Col, Container, Row, Form, Table, ButtonGroup } from "react-bootstrap";
import { useParams } from "react-router";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import DatePicker from 'react-date-picker';
import { ArrowLeft, Calendar, CheckCircle, ExternalLink, Home, Mail, Phone, PlusCircle, Target, User } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import { useCreateJobMutation, useGetStatusesQuery } from "../../../../redux/slices/jobsSlice";
import Loader from "../../../../components/Loader";
import ErrorAlert from "../../../../components/ErrorAlert";
import CustomSelect from "../../../../components/CustomSelect";
import InputMask from "react-input-mask";
import { useGetClientsQuery, useCreateClientTeamInMicrosoftMutation, useUpdateClientMutation } from "../../../../redux/slices/clientsSlice";
import { Client } from "../../../../types/clients";
import { useGetUsersQuery } from "../../../../redux/slices/userApiSlice";
import Datetime from "react-datetime";
import ClientCreate from "../../../../components/clients/ClientCreate";
import validator from 'validator';

const CreateStep3 = ({ nextStep, prevStep, handleFormData, handleSelectData, handleDateData, values }: { nextStep: any, prevStep?: any, handleFormData: any, handleSelectData: any, handleDateData: any, values: any; }) => {

    const navigate = useNavigate();

    const [clientName, setClientName] = useState('');
    const [error, setError] = useState(false);

    const { data: statuses, isLoading: isLoadingStatuses, isError: isErrorStatuses, isSuccess: isSuccessStatuses, error: errorStatuses } = useGetStatusesQuery(undefined, {
        refetchOnMountOrArgChange: true,
    })


    const { data: users, isLoading: isLoadingUsers, isError: isErrorUsers, isSuccess: isSuccessUsers, error: errorUsers } = useGetUsersQuery(undefined, {
        refetchOnMountOrArgChange: true,
    })

    const [createJob, { isLoading: isLoadingJobCreate, isError: isErrorJobCreate, isSuccess: isSuccessJobCreate, error: errorJobCreate }] = useCreateJobMutation();

    let content;

    const submitFormData = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (validator.isEmpty(values.contactName) || validator.isEmpty(values.contactEmail) || validator.isEmpty(values.contactPhone)) {
            setError(true);
        } else if (!validator.isEmail(values.contactEmail)) {
            setError(true);
        } else {
            console.log('values', values);

            console.log('dateSubmitted', values.dateSubmitted);

            dayjs.extend(timezone);
            dayjs.tz.setDefault('Australia/Brisbane');

            let year = dayjs(values.dateSubmitted).format('DD/MM/YYYY').split('/')[2]
            let month = dayjs(values.dateSubmitted).format('DD/MM/YYYY').split('/')[1]
            let day = dayjs(values.dateSubmitted).format('DD/MM/YYYY').split('/')[0]

            console.log('dateSbmtted', `${year}-${month}-${day}`);

            console.log('reqDateOfQuote', dayjs(values.reqDateOfQuote).format('YYYY-MM-DD'))
            console.log('followUpDate', dayjs(values.followUpDate).format('YYYY-MM-DD'))

            console.log({
                dateSubmitted: `${year}-${month}-${day}`,
                client: values.client._id,
                contact: {
                    name: values.contactName,
                    email: values.contactEmail,
                    phone: values.contactPhone
                },
                address: {
                    streetAddress1: values.streetAddress1,
                    streetAddress2: values.streetAddress2,
                    city: values.city,
                    postcode: values.postcode,
                    state: values.state,
                    country: values.country,
                },
                description: values.description,
                doAndCharge: values.doAndCharge,
                jobStatus: values.jobStatus,
                quoteStatus: values.quoteStatus,
                reqDateOfQuote: dayjs(values.reqDateOfQuote).format('YYYY-MM-DD'),
                followUpDate: dayjs(values.followUpDate).format('YYYY-MM-DD'),
                estimator: values.estimator,
                fileReference: 'UNKNOWN',
                xeroReference: 'UNKNOWN'
            })

            createJob({
                dateSubmitted: `${year}-${month}-${day}`,
                client: values.client._id,
                contact: {
                    name: values.contactName,
                    email: values.contactEmail,
                    phone: values.contactPhone
                },
                address: {
                    streetAddress1: values.streetAddress1,
                    streetAddress2: values.streetAddress2,
                    city: values.city,
                    postcode: values.postcode,
                    state: values.state,
                    country: values.country,
                },
                description: values.description,
                doAndCharge: values.doAndCharge,
                jobStatus: values.jobStatus,
                quoteStatus: values.quoteStatus,
                reqDateOfQuote: dayjs(values.reqDateOfQuote).format('YYYY-MM-DD'),
                followUpDate: dayjs(values.followUpDate).format('YYYY-MM-DD'),
                estimator: values.estimator,
                fileReference: 'UNKNOWN',
                xeroReference: 'UNKNOWN'
            })
        }
    }


    let todayDate = new Date();

    if (isSuccessJobCreate) {
        navigate(`/jobs/list`)
    }

    if (isLoadingStatuses || isLoadingUsers) {
        content = (
            <React.Fragment>
                <Helmet title="Job loading" />
                <Container fluid className="p-0">
                    <Row>
                        <Col>
                            <Card>
                                <Row className="mb-2 mb-xl-3">
                                    <Col xs="auto" className="d-none d-sm-block">
                                        <Card.Header>
                                            <Card.Title>New Enquiry</Card.Title>

                                        </Card.Header>
                                    </Col>
                                    <Col xs="auto" className="ms-auto text-end">
                                        <Card.Header>
                                            <Button variant="secondary" className="shadow-sm" onClick={() => navigate(`/jobs`)}><ArrowLeft size={18} /></Button>
                                        </Card.Header>
                                    </Col>
                                </Row>
                                <Card.Body>
                                    <Loader />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    } else if (isSuccessStatuses && isSuccessUsers) {

        let jobStatusOptions: { label: string; value: string; }[] = []
        let quoteStatusOptions: { label: string; value: string; }[] = []

        statuses && statuses.filter(status => status.type === 'Job' && status.status === 'Pending').map(stat => {
            jobStatusOptions.push({ label: stat.status, value: stat._id })
        });

        statuses && statuses.filter(status => status.type === 'Quote' && status.status === 'Pending' || status.status === 'Not required').map(stat => {
            quoteStatusOptions.push({ label: stat.status, value: stat._id })
        });

        let userOptions: { label: string; value: string; }[] = []
        let estimatorOptions: { label: string; value: string; }[] = [
            { value: 'Contractor', label: 'Contractor' },
        ]

        // @ts-ignore
        users && users.map(user => {
            userOptions.push({ label: user.firstName + ' ' + user.lastName, value: user._id })
            estimatorOptions.push({ label: user.firstName + ' ' + user.lastName, value: user.firstName + ' ' + user.lastName })
        })

        let stateOptions: { label: string; value: string; }[] = [
            { value: 'Queensland', label: 'Queensland' },
            { value: 'New South Wales', label: 'New South Wales' },
            { value: 'Victoria', label: 'Victoria' },
            { value: 'Australian Capital Territory', label: 'Australian Capital Territory' },
            { value: 'Northern Territory', label: 'Northern Territory' },
            { value: 'Tasmania', label: 'Tasmania' },
            { value: 'Western Australia', label: 'Western Australia' },
            { value: 'Other', label: 'Other' },
        ]

        let countryOptions: { label: string; value: string; }[] = [
            { value: 'Australia', label: 'Australia' },
            { value: 'Other', label: 'Other' },

        ]




        content = (
            <React.Fragment>
                <Helmet title={`New Enquiry Form`} />
                <Container fluid className="p-0">
                    <Card>
                        <Row className="mb-2 mb-xl-3">
                            <Col xs="auto" className="d-none d-sm-block">
                                <Card.Header>
                                    <Card.Title>New Enquiry Form</Card.Title>
                                </Card.Header>
                            </Col>
                            <Col xs="auto" className="ms-auto text-end">
                                <Card.Header>
                                    <Button variant="secondary" className="shadow-sm" onClick={() => navigate(`/jobs`)}><ArrowLeft size={18} /></Button>
                                </Card.Header>
                            </Col>
                        </Row>
                        <Card.Body>
                            <Form onSubmit={submitFormData}>

                                {isErrorJobCreate ? (
                                    <ErrorAlert title="Error Updating" error={JSON.stringify(errorJobCreate, null, 2)} />
                                ) : null}
                                <>
                                    <Row>
                                        <Col md={12}>
                                            <Card>
                                                <Row className="mb-3">
                                                    <Card.Header>
                                                        <Card.Title>Job Details</Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Col>
                                                            <Row>
                                                                <Form.Group className="mb-3" as={Col} md={4}>
                                                                    <Form.Label>Estimator</Form.Label>
                                                                    <CustomSelect
                                                                        className='react-select-container'
                                                                        //@ts-ignore
                                                                        onChange={handleSelectData("estimator")}
                                                                        value={values.estimator}
                                                                        options={estimatorOptions}
                                                                    />
                                                                    {error ? (
                                                                        <Form.Text style={{ color: "red" }}>
                                                                            This is a required field
                                                                        </Form.Text>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </Form.Group>
                                                                <Form.Group className="mb-3" as={Col} md={4}>
                                                                    <Form.Label>Do & Charge?</Form.Label>
                                                                    <Form.Check
                                                                        type="switch"
                                                                        id="doAndChargeSwitch"
                                                                        name="doAndCharge"
                                                                        label={String(values.doAndCharge)}
                                                                        // value={String(values.doAndCharge)}
                                                                        checked={values.doAndCharge}
                                                                        onChange={handleFormData("doAndCharge")}

                                                                    />
                                                                    {error ? (
                                                                        <Form.Text style={{ color: "red" }}>
                                                                            This is a required field
                                                                        </Form.Text>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </Form.Group>
                                                            </Row>
                                                        </Col>
                                                        <Col>
                                                            <Row>
                                                                <Form.Group className="mb-3" as={Col} md={6}>
                                                                    <Form.Label>Job Status</Form.Label>
                                                                    <CustomSelect
                                                                        className='react-select-container'
                                                                        //@ts-ignore
                                                                        onChange={handleSelectData("jobStatus")}
                                                                        value={values.jobStatus}
                                                                        options={jobStatusOptions}
                                                                    />
                                                                    {error ? (
                                                                        <Form.Text style={{ color: "red" }}>
                                                                            This is a required field
                                                                        </Form.Text>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </Form.Group>
                                                                <Form.Group className="mb-3" as={Col} md={6}>
                                                                    <Form.Label>Quote Status</Form.Label>
                                                                    <CustomSelect
                                                                        className='react-select-container'
                                                                        //@ts-ignore
                                                                        onChange={handleSelectData("quoteStatus")}
                                                                        value={values.quoteStatus}
                                                                        options={quoteStatusOptions}
                                                                    />
                                                                    {error ? (
                                                                        <Form.Text style={{ color: "red" }}>
                                                                            This is a required field
                                                                        </Form.Text>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </Form.Group>
                                                            </Row>
                                                        </Col>
                                                        <Row>
                                                            <Form.Group className="mb-3" as={Col} md={4}>
                                                                <Form.Label>Date Submitted</Form.Label>
                                                                {/* {console.log('dateSubmitted', values.dateSubmitted)}
                                  {console.log('dateSubmitted Date', new Date(values.dateSubmitted))} */}
                                                                <Datetime dateFormat="DD/MM/YYYY" timeFormat={false} onChange={handleDateData("dateSubmitted")} value={values.dateSubmitted} />
                                                                { /* @ts-ignore */}
                                                                {/* <DatePicker format='d/M/yyyy' className="form-control" name="dateSubmitted" onChange={value => setFieldValue('dateSubmitted', value)} value={values.dateSubmitted} /> */}
                                                                {/* @ts-ignore */}
                                                                {/* <InputMask mask="99/99/9999" value={values.dateSubmitted} size="lg" name="dateSubmitted" disabled readOnly>
                                    {(inputProps: any) => (
                                      <Form.Control {...inputProps} type="text" />
                                    )}
                                  </InputMask> */}
                                                            </Form.Group>
                                                            <Form.Group className="mb-3" as={Col} md={4}>
                                                                <Form.Label>Req Date of Quote</Form.Label>
                                                                { /* @ts-ignore */}
                                                                <Datetime dateFormat="DD/MM/YYYY" timeFormat={false} onChange={handleDateData("reqDateOfQuote")} value={values.reqDateOfQuote} />
                                                                {/* <DatePicker format='d/M/yyyy' className="form-control" name="reqDateOfQuote" onChange={value => setFieldValue('reqDateOfQuote', value)} value={values.reqDateOfQuote} /> */}
                                                                {/* @ts-ignore */}
                                                                {/* <InputMask mask="99/99/9999" size="lg" name="reqDateOfQuote" value={values.reqDateOfQuote} onChange={value => setFieldValue('reqDateOfQuote', value.value)}  >
                                    {(inputProps: any) => (
                                      <Form.Control {...inputProps} type="text" />
                                    )}
                                  </InputMask> */}
                                                            </Form.Group>
                                                            <Form.Group className="mb-3" as={Col} md={4}>
                                                                <Form.Label>Follow Up Date</Form.Label>
                                                                <Datetime dateFormat="DD/MM/YYYY" timeFormat={false} onChange={handleDateData("followUpDate")} value={values.followUpDate} />
                                                                {/* @ts-ignore */}
                                                                {/* <InputMask mask="99/99/9999" size="lg" name="followUpDate" value={values.followUpDate} onChange={value => setFieldValue('followUpDate', value.value)}  >
                                    {(inputProps: any) => (
                                      <Form.Control {...inputProps} type="text" />
                                    )}
                                  </InputMask> */}
                                                            </Form.Group>
                                                        </Row>
                                                        <hr />
                                                        <Row>
                                                            <Form.Group className="mb-3" as={Col} md={6}>
                                                                <Form.Label>Street Address 1</Form.Label>
                                                                <Form.Control
                                                                    size="lg"
                                                                    type="text"
                                                                    name="streetAddress1"
                                                                    placeholder="123 Main Street"
                                                                    value={values.streetAddress1}
                                                                    onChange={handleFormData("streetAddress1")}
                                                                />
                                                                {error ? (
                                                                    <Form.Text style={{ color: "red" }}>
                                                                        This is a required field
                                                                    </Form.Text>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </Form.Group>
                                                            <Form.Group className="mb-3" as={Col} md={6}>
                                                                <Form.Label>Street Address 2</Form.Label>
                                                                <Form.Control
                                                                    size="lg"
                                                                    type="text"
                                                                    name="streetAddress2"
                                                                    placeholder=""
                                                                    value={values.streetAddress2}
                                                                    onChange={handleFormData("streetAddress2")}
                                                                />
                                                                {error ? (
                                                                    <Form.Text style={{ color: "red" }}>
                                                                        This is a required field
                                                                    </Form.Text>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </Form.Group>
                                                        </Row>
                                                        <Row>
                                                            <Form.Group className="mb-3" as={Col} md={4}>
                                                                <Form.Label>City</Form.Label>
                                                                <Form.Control
                                                                    size="lg"
                                                                    type="text"
                                                                    name="city"
                                                                    placeholder="Suburb"
                                                                    value={values.city}
                                                                    onChange={handleFormData("city")}
                                                                />
                                                                {error ? (
                                                                    <Form.Text style={{ color: "red" }}>
                                                                        This is a required field
                                                                    </Form.Text>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </Form.Group>
                                                            <Form.Group className="mb-3" as={Col} md={4}>
                                                                <Form.Label>Post Code</Form.Label>
                                                                <Form.Control
                                                                    size="lg"
                                                                    type="text"
                                                                    name="postcode"
                                                                    placeholder="4000"
                                                                    value={values.postcode}
                                                                    onChange={handleFormData("postcode")}
                                                                />
                                                                {error ? (
                                                                    <Form.Text style={{ color: "red" }}>
                                                                        This is a required field
                                                                    </Form.Text>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </Form.Group>
                                                        </Row>
                                                        <Row>
                                                            <Form.Group className="mb-3" as={Col} md={4}>
                                                                <Form.Label>State</Form.Label>
                                                                <CustomSelect
                                                                    className='react-select-container'
                                                                    //@ts-ignore
                                                                    onChange={handleSelectData("state")}
                                                                    value={values.state}
                                                                    options={stateOptions.sort((a, b) => a.value.localeCompare(b.value))}
                                                                />
                                                                {error ? (
                                                                    <Form.Text style={{ color: "red" }}>
                                                                        This is a required field
                                                                    </Form.Text>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </Form.Group>
                                                            <Form.Group className="mb-3" as={Col} md={4}>
                                                                <Form.Label>Country</Form.Label>
                                                                <CustomSelect
                                                                    className='react-select-container'
                                                                    //@ts-ignore
                                                                    onChange={handleSelectData("country")}
                                                                    value={values.country}
                                                                    options={countryOptions}
                                                                />
                                                                {error ? (
                                                                    <Form.Text style={{ color: "red" }}>
                                                                        This is a required field
                                                                    </Form.Text>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </Form.Group>
                                                        </Row>
                                                        <hr />
                                                        <Row>
                                                            <Form.Group>
                                                                <Form.Label>Description</Form.Label>
                                                                <Form.Control
                                                                    size="lg"
                                                                    as="textarea"
                                                                    type="description"
                                                                    name="description"
                                                                    placeholder="Enter job description"
                                                                    value={values.description}
                                                                    onChange={handleFormData("description")}
                                                                />
                                                                {error ? (
                                                                    <Form.Text style={{ color: "red" }}>
                                                                        This is a required field
                                                                    </Form.Text>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </Form.Group>
                                                        </Row>
                                                    </Card.Body>
                                                </Row>
                                            </Card>
                                        </Col>
                                    </Row>
                                </>
                                {isLoadingJobCreate ? (
                                    <Loader />
                                ) : (
                                    <div className="mt-3 text-center">
                                        <Button
                                            className="me-1 mb-1"
                                            type="submit"
                                            variant="outline-danger"
                                            size="lg"
                                            onClick={() => prevStep()}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            className="me-1 mb-1"
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                        >
                                            Complete
                                        </Button>
                                    </div>
                                )}
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </React.Fragment >
        )
    } else if (isErrorStatuses || isErrorUsers || isErrorJobCreate) {
        content = (
            <React.Fragment>
                <Container fluid className="p-0">
                    <Row>
                        <Col>
                            <Card>
                                <Row className="mb-2 mb-xl-3">
                                    <Col xs="auto" className="d-none d-sm-block">
                                        <Card.Header>
                                            <Card.Title>New Enquiry Form</Card.Title>

                                        </Card.Header>
                                    </Col>
                                    <Col xs="auto" className="ms-auto text-end">
                                        <Card.Header>
                                            <Button variant="secondary" className="shadow-sm" onClick={() => navigate(`/jobs`)}><ArrowLeft size={18} /></Button>
                                        </Card.Header>
                                    </Col>
                                </Row>
                                <Card.Body>
                                    {isErrorStatuses ? (
                                        <ErrorAlert title="Error Loading Statuses..." error={JSON.stringify(errorStatuses, null, 2)} />
                                    ) : isErrorUsers ? (
                                        <ErrorAlert title="Error Loading Users..." error={JSON.stringify(errorUsers, null, 2)} />
                                    ) : isErrorJobCreate ? (
                                        <ErrorAlert title="Error Creating Job!" error={JSON.stringify(errorJobCreate, null, 2)} />
                                    ) : ''}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    } else {
        content = (
            <React.Fragment>
                <Card className="flex-fill w-100">
                    <Card.Header>
                        <Card.Title className="mb-0">Job Enquiry Form...</Card.Title>
                    </Card.Header>
                    <Loader />
                </Card >
            </React.Fragment>
        )
    }

    return content;
}

export default CreateStep3;
