import React from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { ArrowLeft, Edit, Edit2, Edit3, Loader, Target } from 'react-feather';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import ErrorAlert from '../../../components/ErrorAlert';
import { useGetUserByIdQuery } from '../../../redux/slices/userApiSlice';

const UserDetails = () => {

    const { userId } = useParams();
    const navigate = useNavigate();

    const { data: user, isLoading: isLoadingUser, isSuccess: isSuccessUser, isError: isErrorUser, error: errorUser } = useGetUserByIdQuery(userId ? userId : '', {
        refetchOnMountOrArgChange: true,
    })

    dayjs.extend(timezone);


    let content;

    if (isLoadingUser) {
        content = (
            <React.Fragment>
                <Helmet title="User Loading.." />
                <Container fluid className="p-0">
                    <Loader />
                </Container>
            </React.Fragment>
        )
    } else if (isErrorUser) {
        content = (
            <React.Fragment>
                <Container fluid className="p-0">
                    <ErrorAlert title="Error loading user!" error={JSON.stringify(errorUser, null, 2)} />
                </Container>
            </React.Fragment>
        )
    } else if (isSuccessUser && user) {
        content = (
            <React.Fragment>
                <Helmet title={`User Details`} />
                <Container fluid className="p-0">
                    <Row>
                        <Col>
                            <Card>
                                <Row className='mb-2 mb-xl-3'>
                                    <Col xs="auto" className="d-none d-sm-block">
                                        <Card.Header>
                                            <Card.Title>User Details</Card.Title>
                                        </Card.Header>
                                    </Col>
                                    <Col xs="auto" className="ms-auto text-end">
                                        <Card.Header>
                                            <Row>
                                                <Col>
                                                    <Button variant="warning" onClick={() => navigate(`/users/${userId}/edit`)}><Edit2 size={18} /></Button>
                                                </Col>
                                                <Col>
                                                    <Button variant="secondary" onClick={() => navigate(`/settings`)}><ArrowLeft size={18} /></Button>
                                                </Col>
                                            </Row>
                                        </Card.Header>
                                    </Col>
                                </Row>
                                <Card.Body>
                                    {/* _id */}
                                    {/* email */}
                                    {/* firstName */}
                                    {/* lastName */}
                                    {/* xero */}
                                    {/* assignedTask */}
                                    {/* roleId */}
                                    {/* employeeId */}
                                    {/* azureUser */}
                                    <Row className="mb-3">
                                        <Form.Group className="mb-3" as={Col} xl={2} lg={2} md={4}>
                                            <Form.Label>
                                                <strong>Employee ID</strong>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user.employeeId}
                                                plaintext
                                                readOnly
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" as={Col} xl={2} lg={2} md={4}>
                                            <Form.Label>
                                                <strong>Assigned Role</strong>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user.roleId.name}
                                                readOnly
                                                plaintext
                                            />
                                        </Form.Group>
                                        {user.activeTask !== undefined || null ? (
                                            <Form.Group className="mb-3" as={Col} xl={2} lg={4} md={4}>
                                                <Form.Label>
                                                    <strong> Current Active Task</strong>
                                                </Form.Label>
                                                <a style={{ textDecoration: 'none', color: 'inherit' }} href={`/tasks/${user.activeTask}`} target='_blank'>
                                                    <Button className="form-control" variant="outline-info"><Target size={18} /></Button>
                                                </a>
                                            </Form.Group>

                                        ) : ''}
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group className="mb-3" as={Col} xl={2} lg={2} md={4}>
                                            <Form.Label>
                                                <strong>First Name</strong>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user.firstName}
                                                readOnly
                                                plaintext
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" as={Col} xl={2} lg={2} md={4}>
                                            <Form.Label>
                                                <strong>Last Name</strong>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user.lastName}
                                                readOnly
                                                plaintext
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" as={Col} xl={4} lg={6} md={6}>
                                            <Form.Label>
                                                <strong>Email</strong>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user.email}
                                                readOnly
                                                plaintext
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group className="mb-3" as={Col} md={4}>
                                            <Form.Label>
                                                <strong> Xero Employee ID</strong>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user.xero?.employeeId ? user?.xero?.employeeId : 'N/A'}
                                                readOnly
                                                plaintext
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" as={Col} md={4}>
                                            <Form.Label>
                                                <strong>Xero Current Timesheet ID</strong>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user.xero?.currentTimesheetId ? user.xero?.currentTimesheetId : 'N/A'}
                                                readOnly
                                                plaintext
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" as={Col} md={4}>
                                            <Form.Label>
                                                <strong>Xero Previous Timesheet ID</strong>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user.xero?.previousTimesheetId ? user.xero?.previousTimesheetId : 'N/A'}
                                                readOnly
                                                plaintext
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group className="mb-3" as={Col} xl={2} lg={4} md={4}>
                                            <Form.Label>
                                                <strong>Created At</strong>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={dayjs(user.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                                                readOnly
                                                plaintext
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" as={Col} xl={2} lg={4} md={4}>
                                            <Form.Label>
                                                <strong>Last Updated At</strong>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={dayjs(user.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
                                                readOnly
                                                plaintext
                                            />
                                        </Form.Group>
                                    </Row>
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

export default UserDetails