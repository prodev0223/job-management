import React, { useContext, useState } from 'react'
import { Formik, useFormik } from 'formik';
import * as Yup from "yup";
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { ArrowLeft, Edit, Edit2, Edit3, Loader } from 'react-feather';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom'
import ErrorAlert from '../../../components/ErrorAlert';
import { useCreateUserMutation, useGetUserByIdQuery, useGetUsersFromXeroQuery, useUpdateUserDetailsMutation } from '../../../redux/slices/userApiSlice';
import { useGetRolesQuery } from '../../../redux/slices/roleSlice';
import CustomSelect from '../../../components/CustomSelect';
import { faker } from '@faker-js/faker';
import NotyfContext from '../../../contexts/NotyfContext';

const UserCreate = () => {

    const navigate = useNavigate();
    const notyf = useContext(NotyfContext);

    const [empId, setEmpId] = useState(faker.random.numeric(4))


    const { data: xeroUsers, isLoading: isLoadingXeroUsers, isSuccess: isSuccessXeroUsers, isError: isErrorXeroUsers, error: errorXeroUsers } = useGetUsersFromXeroQuery(undefined, {
        refetchOnMountOrArgChange: true,
    })

    const { data: roles, isLoading: isLoadingRoles, isSuccess: isSuccessRoles, isError: isErrorRoles, error: errorRoles } = useGetRolesQuery(undefined, {
        refetchOnMountOrArgChange: true
    })

    const [createUser, { isLoading: isLoadingCreateUser, isSuccess: isSuccessCreateUser, isError: isErrorCreateUser, error: errorCreateUser }] = useCreateUserMutation();

    const yupSchema = Yup.object().shape({
        employeeId: Yup.number().min(4).required('Employee ID is required'),
        roleId: Yup.string().required('Role ID is required'),
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        email: Yup.string().required('Email is required').email('Must be a valid email'),
        xero: Yup.object().shape({
            employeeId: Yup.string(),
            currentTimesheetId: Yup.string(),
            previousTimesheetId: Yup.string(),
            earningsRateId: Yup.string(),
        }),
        pincode: Yup.number().min(6),
        pincodeConfirmation: Yup.number().oneOf([Yup.ref('pincode'), null], 'Pin Codes must match'),
        password: Yup.string().min(8).max(255).required('Password is required'),
        passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
    })



    const formik = useFormik({
        initialValues: {
            employeeId: empId,
            roleId: '',
            firstName: '',
            lastName: '',
            email: '',
            xero: {
                employeeId: '',
                earningRateId: '',
            },
            pincode: '',
            pincodeConfirmation: '',
            password: '',
            passwordConfirmation: '',
            submit: false
        },
        enableReinitialize: true,
        validationSchema: yupSchema,
        onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
                // alert(JSON.stringify(values, null, 2));

                if (values.xero.employeeId === '' || values.xero.earningRateId === '') {
                    notyf.open({
                        message: 'Select Xero Employee!'
                    })
                }
                let payload = {
                    email: values.email,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    employeeId: Number(values.employeeId),
                    roleId: values.roleId,
                    xeroEmpID: values.xero.employeeId,
                    xeroEarningRate: values.xero.earningRateId,
                    pincode: Number(values.pincode),
                    password: values.password,
                    passwordConfirmation: values.passwordConfirmation,
                }

                alert(JSON.stringify(payload, null, 2));

                let response = createUser({
                    email: values.email,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    employeeId: Number(values.employeeId),
                    roleId: values.roleId,
                    xeroEmpID: values.xero.employeeId,
                    xeroEarningRate: values.xero.earningRateId,
                    pincode: Number(values.pincode),
                    password: values.password,
                    passwordConfirmation: values.passwordConfirmation,
                }).unwrap();

                console.log('response', response);
            } catch (error: any) {
                console.log('error', error);
                const message = error.response ? error.response.data.message : error.error ? error.error : 'Something went wrong'

                setStatus({ success: false })
                setErrors({ submit: message })
                setSubmitting(false);
            }
        }
    })

    let content;

    const handleXeroSelection = (value: string) => {
        if (xeroUsers) {
            console.log('selected emp', value);

            let employee = xeroUsers.find(emp => emp.employeeID === value);
            console.log('employee', employee);

            formik.setFieldValue('xero.employeeId', employee?.employeeID)
            formik.setFieldValue('xero.earningRateId', employee?.ordinaryEarningsRateID)
        }
    }

    if (isSuccessCreateUser) {
        navigate(`/settings`)
    }

    if (isLoadingXeroUsers || isLoadingRoles || isLoadingCreateUser) {
        content = (
            <React.Fragment>
                <Helmet title="User Loading.." />
                <Container fluid className="p-0">
                    <Loader />
                </Container>
            </React.Fragment>
        )
    } else if (isErrorXeroUsers || isErrorRoles || isErrorCreateUser) {
        content = (
            <React.Fragment>
                <Container fluid className="p-0">
                    <ErrorAlert title="Error creating user!" error={JSON.stringify(errorCreateUser, null, 2)} />
                </Container>
            </React.Fragment>
        )
    } else if (isSuccessXeroUsers && isSuccessRoles && roles && xeroUsers) {

        let xeroEmployeeOptions: { label: string; value: string; }[] = [];

        xeroUsers && xeroUsers.map(emp => {
            xeroEmployeeOptions.push({ label: emp.firstName + ' ' + emp.lastName, value: emp.employeeID ? emp.employeeID : '' })
        })

        let roleOptions: { label: string; value: string; }[] = [];

        roles && roles.map(role => {
            roleOptions.push({ label: role.name, value: role._id });
        })

        content = (
            <React.Fragment>
                <Helmet title={`Create User`} />
                <Container fluid className="p-0">
                    <Row>
                        <Col>
                            <Card>
                                <Row className='mb-2 mb-xl-3'>
                                    <Col xs="auto" className="d-none d-sm-block">
                                        <Card.Header>
                                            <Card.Title>User Create</Card.Title>
                                        </Card.Header>
                                    </Col>
                                    <Col xs="auto" className="ms-auto text-end">
                                        <Card.Header>
                                            <Row>
                                                {/* <Col>
                                                    <Button variant="warning" onClick={() => navigate(`/users/${userId}/edit`)}><Edit2 size={18} /></Button>
                                                </Col> */}
                                                <Col>
                                                    <Button variant="secondary" onClick={() => navigate(`/settings`)}><ArrowLeft size={18} /></Button>
                                                </Col>
                                            </Row>
                                        </Card.Header>
                                    </Col>
                                </Row>
                                <Card.Body>
                                    <Form onSubmit={formik.handleSubmit}>
                                        {formik.errors.submit && (
                                            <Alert className="my-3" variant="danger">
                                                <div className="alert-message">{formik.errors.submit}</div>
                                            </Alert>
                                        )}
                                        {isErrorCreateUser && (
                                            <Alert className="my-3" variant="danger">
                                                <div className="alert-message">{JSON.stringify(errorCreateUser, null, 2)}</div>
                                            </Alert>
                                        )}
                                        <Row className="mb-3">
                                            <Form.Group className="mb-3" as={Col} md={2}>
                                                <Form.Label>Employee ID</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    size="lg"
                                                    value={formik.values.employeeId}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    name="employeeId"
                                                    placeholder="Enter Employee ID"
                                                    isInvalid={Boolean(formik.touched.employeeId && formik.errors.employeeId)}
                                                />
                                                {!!formik.touched.employeeId && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {formik.errors.employeeId}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                            <Form.Group className="mb-3" as={Col} md={2}>
                                                <Form.Label>Assigned Role</Form.Label>
                                                <CustomSelect
                                                    className="react-select-container"
                                                    //@ts-ignore
                                                    onChange={value => formik.setFieldValue('roleId', value.value)}
                                                    value={formik.values.roleId}
                                                    options={roleOptions}
                                                />
                                                {!!formik.touched.roleId && (
                                                    <div style={{
                                                        display: 'block',
                                                        width: '100%',
                                                        marginTop: '0.25rem',
                                                        fontSize: '80%',
                                                        color: '#d9534f'
                                                    }}>
                                                        {formik.errors.roleId}
                                                    </div>
                                                )}
                                            </Form.Group>
                                            <Form.Group className="mb-3" as={Col} md={2}>
                                                <Form.Label>
                                                    Mapped Xero Employee
                                                </Form.Label>
                                                <CustomSelect
                                                    className="react-select-container"
                                                    //@ts-ignore
                                                    onChange={value => handleXeroSelection(value.value)}
                                                    value={formik.values.xero.employeeId}
                                                    options={xeroEmployeeOptions}
                                                />
                                                {!!formik.touched?.xero?.employeeId && (
                                                    <div style={{
                                                        display: 'block',
                                                        width: '100%',
                                                        marginTop: '0.25rem',
                                                        fontSize: '80%',
                                                        color: '#d9534f'
                                                    }}>
                                                        {formik.errors?.xero?.employeeId}
                                                    </div>
                                                )}
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Form.Group className="mb-3" as={Col} md={2}>
                                                <Form.Label>
                                                    First Name
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="firstName"
                                                    value={formik.values.firstName}
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    size="lg"
                                                    placeholder="Enter First Name"
                                                    isInvalid={Boolean(formik.touched.firstName && formik.errors.firstName)}
                                                />
                                                {!!formik.touched.firstName && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {formik.errors.firstName}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                            <Form.Group className="mb-3" as={Col} md={2}>
                                                <Form.Label>
                                                    Last Name
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="lastName"
                                                    value={formik.values.lastName}
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    size="lg"
                                                    placeholder="Enter Last Name"
                                                    isInvalid={Boolean(formik.touched.lastName && formik.errors.lastName)}
                                                />
                                                {!!formik.touched.lastName && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {formik.errors.lastName}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                            <Form.Group className="mb-3" as={Col} md={4}>
                                                <Form.Label>
                                                    Email
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="email"
                                                    value={formik.values.email}
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    size="lg"
                                                    placeholder="Enter Email"
                                                    isInvalid={Boolean(formik.touched.email && formik.errors.email)}
                                                />
                                                {!!formik.touched.email && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {formik.errors.email}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>


                                        </Row>
                                        <Row>
                                            <Form.Group className="mb-3" as={Col} md={2}>
                                                <Form.Label>
                                                    Pin Code
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="pincode"
                                                    value={formik.values.pincode}
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    size="lg"
                                                    placeholder="Enter pincode"
                                                    isInvalid={Boolean(formik.touched.pincode && formik.errors.pincode)}
                                                />
                                                {!!formik.touched.pincode && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {formik.errors.pincode}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                            <Form.Group className="mb-3" as={Col} md={2}>
                                                <Form.Label>
                                                    Pin Code Confirmation
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="pincodeConfirmation"
                                                    value={formik.values.pincodeConfirmation}
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    size="lg"
                                                    placeholder="Enter pincode again"
                                                    isInvalid={Boolean(formik.touched.pincodeConfirmation && formik.errors.pincodeConfirmation)}
                                                />
                                                {!!formik.touched.pincodeConfirmation && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {formik.errors.pincodeConfirmation}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Form.Group className="mb-3" as={Col} md={2}>
                                                <Form.Label>
                                                    Password
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    value={formik.values.password}
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    size="lg"
                                                    placeholder="Enter password"
                                                    isInvalid={Boolean(formik.touched.password && formik.errors.password)}
                                                />
                                                {!!formik.touched.password && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {formik.errors.password}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                            <Form.Group className="mb-3" as={Col} md={2}>
                                                <Form.Label>
                                                    Password Confirmation
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    name="passwordConfirmation"
                                                    value={formik.values.passwordConfirmation}
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    size="lg"
                                                    placeholder="Enter password again"
                                                    isInvalid={Boolean(formik.touched.passwordConfirmation && formik.errors.passwordConfirmation)}
                                                />
                                                {!!formik.touched.passwordConfirmation && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {formik.errors.passwordConfirmation}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Row>
                                        {isLoadingCreateUser ? (
                                            <Loader />
                                        ) : (
                                            <div className="mt-3 text-center">
                                                <Button
                                                    className="me-1 mb-1"
                                                    type="submit"
                                                    variant="outline-danger"
                                                    size="lg"
                                                    disabled={formik.isSubmitting}
                                                    onClick={() => navigate(`/settings`)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    className="me-1 mb-1"
                                                    type="submit"
                                                    variant="primary"
                                                    size="lg"
                                                    disabled={formik.isSubmitting}
                                                >
                                                    Save
                                                </Button>
                                            </div>

                                        )}
                                    </Form>
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
                <Helmet title="User Loading.." />
                <Container fluid className="p-0">
                    <Loader />
                </Container>
            </React.Fragment>
        )
    }

    return content;
}

export default UserCreate