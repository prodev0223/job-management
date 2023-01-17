import React from 'react'
import { Formik, useFormik } from 'formik';
import * as Yup from "yup";
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import Select from 'react-select';
import { ArrowLeft, Loader } from 'react-feather'
import { useNavigate, useParams } from 'react-router';
import ErrorAlert from '../../../components/ErrorAlert';
import LoadingAlert from '../../../components/LoadingAlert';
import { useGetUsersQuery } from '../../../redux/slices/userApiSlice';
import { selectCurrentUser } from '../../../redux/slices/authSlice';
import useAppSelector from '../../../hooks/useAppSelector';
import { useGetJobByIdQuery } from '../../../redux/slices/jobsSlice';
import CustomSelect from '../../../components/CustomSelect';
import { useCreateTaskMutation } from '../../../redux/slices/tasksSlice';

const TaskCreate = () => {


    const { jobId } = useParams();
    const navigate = useNavigate();

    const user = useAppSelector(selectCurrentUser);

    const { data: users, isLoading: isLoadingUsers, isError: isErrorUsers, isSuccess: isSuccessUsers, error: errorUsers } = useGetUsersQuery();

    const { data: job, isLoading: isLoadingJob, isError: isErrorJob, isSuccess: isSuccessJob, error: errorJob } = useGetJobByIdQuery(jobId ? jobId : '');

    const [createTask, { isLoading: isLoadingCreate, isError: isErrorCreate, isSuccess: isSuccessCreate, error: errorCreate }] = useCreateTaskMutation();

    let content;

    const yupSchema = Yup.object().shape({
        jobNo: Yup.string().required('Job ID is required'),
        assignedUser: Yup.string().required('A User is required'),
        taskType: Yup.string().required('A Task Type is required'),
        taskDescription: Yup.string().required('A Task Description is required'),
        taskRate: Yup.number().required('Task Rate is required'),
        estimatedHours: Yup.number().required('Estimated Hours are required')
    })

    const formik = useFormik({
        initialValues: {
            jobNo: job && job.jobNo,
            assignedUser: '',
            taskType: '',
            taskDescription: '',
            taskRate: 45.00,
            status: 'New',
            estimatedHours: 0x0,
            submit: false
        },
        validationSchema: yupSchema,
        onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
                console.log('jobId', values.jobNo)
                console.log('user', values.assignedUser)
                console.log('taskType', values.taskType)
                console.log('taskDescription', values.taskDescription)
                console.log('estimatedHours', values.estimatedHours)
                console.log('status', values.status)
                if (job && jobId) {
                    createTask({
                        jobId,
                        task: {
                            jobId: jobId,
                            assignedUser: values.assignedUser,
                            taskType: values.taskType,
                            taskDescription: values.taskDescription,
                            taskRate: Number(values.taskRate),
                            status: 'New',
                            estimatedHours: Number(values.estimatedHours)
                        }
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

    if (isSuccessCreate) {
        navigate(`/jobs/${jobId}`)
    }

    if (isLoadingUsers) {
        content = (
            <Container fluid className="p-0">
                <Row>
                    <Col>
                        <Card>
                            <Row className="mb-2 mb-xl-3">
                                <Col xs="auto" className="d-none d-sm-block">
                                    <Card.Header>
                                        <Card.Title>Create Task</Card.Title>

                                    </Card.Header>
                                </Col>
                                <Col xs="auto" className="ms-auto text-end">
                                    <Card.Header>
                                        <Button variant="secondary" className="shadow-sm" onClick={() => navigate(`/jobs/${jobId}`)}><ArrowLeft size={18} /></Button>
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
        )
    } else if (isErrorUsers) {
        content = (
            <Container fluid className="p-0">
                <Row>
                    <Col>
                        <Card>
                            <Row className="mb-2 mb-xl-3">
                                <Col xs="auto" className="d-none d-sm-block">
                                    <Card.Header>
                                        <Card.Title>Create Task</Card.Title>

                                    </Card.Header>
                                </Col>
                                <Col xs="auto" className="ms-auto text-end">
                                    <Card.Header>
                                        <Button variant="secondary" className="shadow-sm" onClick={() => navigate(`/jobs/${jobId}`)}><ArrowLeft size={18} /></Button>
                                    </Card.Header>
                                </Col>
                            </Row>
                            <Card.Body>
                                <ErrorAlert title="Error Loading Users..." error={JSON.stringify(errorUsers, null, 2)} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    } else if (isSuccessUsers) {

        let userOptions: { label: string; value: string; }[] = []

        users && users.map(user => {
            userOptions.push({ label: user.firstName + ' ' + user.lastName, value: user._id })
        })

        let taskTypeOptions: { label: string; value: string; }[] = [
            { label: 'Fabrication', value: "Fabrication" },
            { label: 'Processing', value: "Processing" },
            { label: 'Painting', value: "Painting" },
            { label: 'Site Work', value: "Site Work" },
            { label: 'Detailing', value: "Detailing" },
            { label: 'Yard', value: "Yard" },
            { label: 'Admin - Projects', value: "Admin - Projects" },
            { label: 'Admin - General', value: "Admin - General" },
            { label: 'Maintenance', value: "Maintenance" },
            { label: 'WHS', value: "WHS" },
        ]

        content = (
            <Container fluid className="p-0">
                <Row>
                    <Col>
                        <Card>
                            <Row className="mb-2 mb-xl-3">
                                <Col xs="auto" className="d-none d-sm-block">
                                    <Card.Header>
                                        <Card.Title>Create Task</Card.Title>

                                    </Card.Header>
                                </Col>
                                <Col xs="auto" className="ms-auto text-end">
                                    <Card.Header>
                                        <Button variant="secondary" className="shadow-sm" onClick={() => navigate(`/jobs/${jobId}`)}><ArrowLeft size={18} /></Button>
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
                                    {isErrorCreate && (
                                        <Alert className="my-3" variant="danger">
                                            <div className="alert-message">{JSON.stringify(errorCreate, null, 2)}</div>
                                        </Alert>
                                    )}
                                    <Row className="mb-3">
                                        {isLoadingJob ? (
                                            <Loader />
                                        ) : isErrorJob ? (
                                            <ErrorAlert title="Error Loading job..." error={JSON.stringify(errorJob, null, 2)} />
                                        ) : (

                                            <Form.Group className="mb-3" as={Col} md={3}>
                                                <Form.Label>Job No</Form.Label>
                                                <Form.Control
                                                    size="lg"
                                                    type="jobNo"
                                                    name="jobNo"
                                                    placeholder="Enter your jobNo"
                                                    value={formik.values.jobNo}
                                                    isInvalid={Boolean(formik.touched.jobNo && formik.errors.jobNo)}
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    disabled
                                                />
                                                {!!formik.touched.jobNo && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {formik.errors.jobNo}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        )}
                                        <Form.Group className="mb-3" as={Col} md={3}>
                                            <Form.Label>Assigned User</Form.Label>
                                            <CustomSelect
                                                className='react-select-container'
                                                //@ts-ignore
                                                onChange={value => formik.setFieldValue('assignedUser', value.value)}
                                                value={formik.values.assignedUser}
                                                options={userOptions}
                                            />
                                            {
                                                !!formik.touched.assignedUser && (
                                                    <div style={{
                                                        display: 'block',
                                                        width: '100%',
                                                        marginTop: '0.25rem',
                                                        fontSize: '80%',
                                                        color: '#d9534f'
                                                    }}>
                                                        {formik.errors.assignedUser}
                                                    </div>
                                                )
                                            }

                                        </Form.Group>
                                        <Form.Group className="mb-3" as={Col} md={3}>
                                            <Form.Label>Task Type</Form.Label>
                                            <CustomSelect
                                                className="react-select-container"
                                                //@ts-ignore
                                                onChange={value => formik.setFieldValue('taskType', value.value)}
                                                value={formik.values.taskType}
                                                options={taskTypeOptions}
                                            />
                                            {
                                                !!formik.touched.taskType && (
                                                    <div style={{
                                                        display: 'block',
                                                        width: '100%',
                                                        marginTop: '0.25rem',
                                                        fontSize: '80%',
                                                        color: '#d9534f'
                                                    }}>
                                                        {formik.errors.taskType}
                                                    </div>
                                                )
                                            }
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group className="mb-3" as={Col} md={3}>
                                            <Form.Label>Task Hourly Rate</Form.Label>
                                            <Form.Control
                                                size="lg"
                                                type="taskRate"
                                                name="taskRate"
                                                placeholder="Enter Estimated Hours"
                                                value={formik.values.taskRate}
                                                isInvalid={Boolean(formik.touched.taskRate && formik.errors.taskRate)}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                            />
                                            {!!formik.touched.taskRate && (
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.taskRate}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>

                                        <Form.Group className="mb-3" as={Col} md={3}>
                                            <Form.Label>Estimated Hours</Form.Label>
                                            <Form.Control
                                                size="lg"
                                                type="estimatedHours"
                                                name="estimatedHours"
                                                placeholder="Enter Estimated Hours"
                                                value={formik.values.estimatedHours}
                                                isInvalid={Boolean(formik.touched.estimatedHours && formik.errors.estimatedHours)}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                            />
                                            {!!formik.touched.estimatedHours && (
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.estimatedHours}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group className="mb-3" as={Col} md={12}>
                                            <Form.Label>Task Description</Form.Label>
                                            <Form.Control
                                                size="lg"
                                                as="textarea"
                                                type="taskDescription"
                                                name="taskDescription"
                                                placeholder="Enter your task description"
                                                value={formik.values.taskDescription}
                                                isInvalid={Boolean(formik.touched.taskDescription && formik.errors.taskDescription)}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}

                                            />
                                            {!!formik.touched.taskDescription && (
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.taskDescription}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Row>
                                    {isLoadingCreate ? (
                                        <LoadingAlert title="Creating task..." />
                                    ) : (
                                        <div className="mt-3 text-center">
                                            <Button
                                                className="me-1 mb-1"
                                                type="submit"
                                                variant="outline-danger"
                                                size="lg"
                                                disabled={formik.isSubmitting}
                                                onClick={() => navigate(`/jobs/${jobId}`)}
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
            </Container >
        )
    } else {
        content = (
            <>
                <Loader />
            </>
        )
    }

    return content
}

export default TaskCreate
