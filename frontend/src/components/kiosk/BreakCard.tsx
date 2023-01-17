import React, { useContext } from 'react'
import dayjs from 'dayjs'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Edit2, Eye, PlayCircle, StopCircle } from 'react-feather'
import { Helmet } from 'react-helmet-async'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import ErrorAlert from '../ErrorAlert'
import TasksByUser from './TasksByUser'
import LoadingAlert from '../LoadingAlert'
import { logout, selectCurrentUser } from '../../redux/slices/authSlice'
import { useCreateTimesheetEntryMutation, useGetCurrentUserTimesheetsQuery } from '../../redux/slices/timesheetApiSlice'
import NotyfContext from '../../contexts/NotyfContext'

const BreakCard = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const notyf = useContext(NotyfContext);

    const user = useSelector(selectCurrentUser)


    const [timesheet, { isLoading: isLoadingCreateTimeEntry, isError: isErrorCreateTimeEntry, error: errorCreateTimeEntry, isSuccess: isSuccessCreateTimeEntry }] = useCreateTimesheetEntryMutation();

    const { data: timesheets, isLoading: isLoadingUserTimesheets, isError: isErrorUserTimesheets, error: errorUserTimesheets, isSuccess: isSuccessUserTimesheets } = useGetCurrentUserTimesheetsQuery(user && user?._id, {
        refetchOnMountOrArgChange: true
    })

    const handleBreakInitiate = () => {
        const date = new Date
        let dateConverted = date.toLocaleString(undefined, { timeZone: "Australia/Sydney" })
        let dateToString = dayjs(dateConverted).format('DD/MM/YYYY HH:mm:ss').toString();
        notyf.open({
            type: "default",
            message: "Break Started! Enjoy it!",
            duration: 5000,
            ripple: true,
            dismissible: true,
            position: {
                x: 'center',
                y: 'top'
            }
        })
        dispatch(logout());
    }

    const handleBreakEnd = () => {
        const date = new Date
        let dateConverted = date.toLocaleString(undefined, { timeZone: "Australia/Sydney" })
        let dateToString = dayjs(dateConverted).format('DD/MM/YYYY HH:mm:ss').toString();
        notyf.open({
            type: "default",
            message: "Break Ended - Select your next task!",
            duration: 5000,
            ripple: true,
            dismissible: true,
            position: {
                x: 'center',
                y: 'top'
            }
        })
        navigate('/kiosk/tasks')
    }

    return (
        <Card>
            <Card.Header>
                <Card.Title>Break</Card.Title>
            </Card.Header>
            {isLoadingUserTimesheets ? (
                <LoadingAlert title="Loading..." />
            ) : isErrorUserTimesheets ? (
                <ErrorAlert title="Error loading user timesheets!" error={JSON.stringify(errorUserTimesheets)} />
            ) : (
                <Card.Body>
                    <Row>
                        <Col>
                            <Button variant="primary" className="text-center" onClick={handleBreakInitiate}>
                                <span>Start</span>
                                <hr />
                                <PlayCircle size={100} />
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="primary" className="text-center" onClick={handleBreakEnd}>
                                <span>End</span>
                                <hr />
                                <StopCircle size={100} />
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            )}
        </Card>
    )
}

export default BreakCard