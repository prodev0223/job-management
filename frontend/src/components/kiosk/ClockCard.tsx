import React, { useContext, useState } from 'react'
import dayjs from 'dayjs'
import { Button, Card, Col, Container, Row, Toast } from 'react-bootstrap'
import { Edit2, Eye, PlayCircle, StopCircle } from 'react-feather'
import { Helmet } from 'react-helmet-async'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import ErrorAlert from '../ErrorAlert'
import LoadingAlert from '../LoadingAlert'
import { logout, selectCurrentUser } from '../../redux/slices/authSlice'
import { useCreateTimesheetEntryMutation, useGetCurrentUserTimesheetsQuery, useCompleteTimesheetEntryMutation } from '../../redux/slices/timesheetApiSlice'
import NotyfContext from '../../contexts/NotyfContext'

const ClockCard = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const notyf = useContext(NotyfContext);


    const user = useSelector(selectCurrentUser)

    const [timesheet, { isLoading: isLoadingCreateTimeEntry, isError: isErrorCreateTimeEntry, error: errorCreateTimeEntry, isSuccess: isSuccessCreateTimeEntry }] = useCreateTimesheetEntryMutation();
    const [completedTimesheet, { isLoading: isLoadingCompletedTimeEntry, isError: isErrorCompletedTimeEntry, error: errorCompletedTimeEntry, isSuccess: isSuccessCompletedTimeEntry }] = useCompleteTimesheetEntryMutation();
    const { data: timesheets, isLoading: isLoadingUserTimesheets, isError: isErrorUserTimesheets, error: errorUserTimesheets, isSuccess: isSuccessUserTimesheets } = useGetCurrentUserTimesheetsQuery(user && user?._id, {
        refetchOnMountOrArgChange: true
    })

    const handleClockInInitiate = () => {
        let todayDate = new Date;
        console.log('todayDate', todayDate)
        let dateConverted = todayDate.toLocaleString(undefined, { timeZone: 'Australia/Brisbane', hourCycle: 'h23' });
        console.log('dateConverted', dateConverted)

        let currentDate = dateConverted.split(",")[0];

        let currentHour = dateConverted.split(",")[1].split(":")[0];
        let currentMin = dateConverted.split(":")[1];


        console.log('currentDate', currentDate);
        console.log('currentHour', currentHour);
        console.log('currentMin', currentMin);

        let todaysTimeEntry = timesheets && timesheets.find(timesheet => timesheet.startDate === currentDate);

        if (user) {
            if (todaysTimeEntry) {
                notyf.open({
                    type: "danger",
                    message: "Time Entry has already started tracking for today!",
                    duration: 7500,
                    ripple: true,
                    dismissible: true,
                    position: {
                        x: 'center',
                        y: 'top'
                    }
                })
            } else {
                let userId = user && user?._id;
                dispatch(timesheet({
                    user: userId,
                    startDate: currentDate,
                    startHour: Number(currentHour),
                    startMin: Number(currentMin)
                })).unwrap();

            }
        } else {
            dispatch(logout())
        }


    }

    const handleClockInEnd = () => {
        let todayDate = new Date;
        console.log('todayDate', todayDate)
        let dateConverted = todayDate.toLocaleString(undefined, { timeZone: 'Australia/Brisbane', hourCycle: 'h23' });
        console.log('dateConverted', dateConverted)

        let currentDate = dateConverted.split(",")[0];

        let currentHour = dateConverted.split(",")[1].split(":")[0];
        let currentMin = dateConverted.split(":")[1];


        console.log('currentDate', currentDate);
        console.log('currentHour', currentHour);
        console.log('currentMin', currentMin);



        let todaysTimeEntry = timesheets && timesheets.find(timesheet => timesheet.startDate === currentDate);
        console.log('todaysTimeEntry found', todaysTimeEntry);
        if (user) {
            if (todaysTimeEntry) {
                let userId = user && user?._id;
                console.log('logging', {
                    timesheetId: todaysTimeEntry && todaysTimeEntry._id,
                    user: userId,
                    endDate: currentDate,
                    endHour: Number(currentHour),
                    endMin: Number(currentMin),
                    completed: true,

                })
                dispatch(completedTimesheet({
                    timesheetId: todaysTimeEntry && todaysTimeEntry._id,
                    user: userId,
                    endDate: currentDate,
                    endHour: Number(currentHour),
                    endMin: Number(currentMin),
                    completed: true,

                }))
            } else {
                alert('No Time Entry started today! Please clock in!')
            }
        }

    }

    if (isSuccessCreateTimeEntry || isSuccessCompletedTimeEntry) {

        if (isSuccessCreateTimeEntry) {
            notyf.open({
                type: "success",
                message: "Time Entry started - signing you out!",
                duration: 5000,
                ripple: true,
                dismissible: true,
                position: {
                    x: 'center',
                    y: 'top'
                }
            })
        }
        if (isSuccessCompletedTimeEntry) {
            notyf.open({
                type: "success",
                message: "Time Entry completed - signing you out!",
                duration: 5000,
                ripple: true,
                dismissible: true,
                position: {
                    x: 'center',
                    y: 'top'
                }
            })
        }
        setTimeout(() => {
            dispatch(logout());
        }, 5000)
    }

    return (
        <Card>
            <Card.Header>
                <Card.Title>Clock In/Out</Card.Title>
            </Card.Header>
            {isLoadingUserTimesheets ? (
                <LoadingAlert title="Loading..." />
            ) : isErrorUserTimesheets ? (
                <ErrorAlert title="Error loading user timesheets!" error={JSON.stringify(errorUserTimesheets)} />
            ) : (
                <Card.Body>
                    <Row>
                        <Col>
                            {isLoadingCreateTimeEntry ? (
                                <LoadingAlert title="Submitting Time Entry Start..." />
                            ) : isErrorCreateTimeEntry ? (
                                <ErrorAlert title="Error Submitting Time Entry" error={JSON.stringify(errorCreateTimeEntry)} />
                            ) : (
                                <Button variant="primary" className="text-center" onClick={handleClockInInitiate}>
                                    <span>Start</span>
                                    <hr />

                                    <PlayCircle size={100} />
                                </Button>
                            )}
                        </Col>
                        <Col>
                            {isLoadingCompletedTimeEntry ? (
                                <LoadingAlert title="Submitting Time Entry Finish..." />
                            ) : isErrorCompletedTimeEntry ? (
                                <ErrorAlert title="Error Completing Time Entry" error={JSON.stringify(errorCompletedTimeEntry)} />
                            ) : (
                                <Button variant="primary" className="text-center" onClick={handleClockInEnd}>
                                    <span>End</span>
                                    <hr />
                                    <StopCircle size={100} />
                                </Button>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            )}
        </Card>
    )
}

export default ClockCard