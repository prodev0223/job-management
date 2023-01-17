import dayjs from 'dayjs'
import React from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Edit2, Eye, PlayCircle, StopCircle } from 'react-feather'
import { Helmet } from 'react-helmet-async'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import ErrorAlert from '../../../components/ErrorAlert'
import BreakCard from '../../../components/kiosk/BreakCard'
import ClockCard from '../../../components/kiosk/ClockCard'
import TasksByUser from '../../../components/kiosk/TasksByUser'
import LoadingAlert from '../../../components/LoadingAlert'
import { logout, selectCurrentUser } from '../../../redux/slices/authSlice'
const KioskHome = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(selectCurrentUser)

    return (
        <React.Fragment>
            <Helmet title="Kiosk" />
            <Container fluid className="p-0">
                <h3>Welcome Back, {user && user.firstName} {user && user.lastName}</h3>
                <strong>Choose an activity from the below cards</strong>
                <hr />
                <Row>
                    <Col lg={4} md={12} sm={12} xs={12}>
                        <Card>
                            <Card.Header>
                                <Card.Title>Tasks</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Button variant="primary" className="text-center" onClick={() => navigate('/kiosk/tasks')}>
                                    <span>View</span>
                                    <hr />
                                    <Eye size={100} />
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4} md={12} sm={12} xs={12}>
                        <BreakCard />
                    </Col>
                    <Col lg={4} md={12} sm={12} xs={12}>
                        <ClockCard />
                    </Col>
                </Row>
            </Container>
        </React.Fragment >
    )
}

export default KioskHome
