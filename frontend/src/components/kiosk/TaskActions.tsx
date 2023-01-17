import React, { useContext, useState } from 'react'
import { Button, Card, Col, Modal, Row, Table } from 'react-bootstrap';
import { CheckCircle, Loader, PlayCircle, PlusCircle, StopCircle, User } from 'react-feather';
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import NotyfContext from '../../contexts/NotyfContext';
import { useCreateTaskTimeEntryMutation, useGetTaskByIdQuery, useGetTaskTimesByIdQuery, useUpdateTaskByIdMutation, useUpdateTaskTimeEntryMutation } from '../../redux/slices/tasksSlice';
import ErrorAlert from '../ErrorAlert';
import { TaskTime } from '../../types/tasks';
import useAppSelector from '../../hooks/useAppSelector';
import { logout, selectCurrentUser } from '../../redux/slices/authSlice';

const TaskActions = ({ taskId, index }: { taskId: string, index: any }) => {
    const dispatch = useDispatch();
    const user = useAppSelector(selectCurrentUser);
    const notyf = useContext(NotyfContext);

    const { data: task, isLoading: isLoadingTask, isSuccess: isSuccessTask, isError: isErrorTask, error: errorTask } = useGetTaskByIdQuery(taskId ? taskId : '', {
        refetchOnMountOrArgChange: true
    })

    const { data: taskTimes, isLoading: isLoadingTaskTimes, isSuccess: isSuccessTaskTimes, isError: isErrorTaskTimes, error: errorTaskTimes } = useGetTaskTimesByIdQuery(taskId ? taskId : '', {
        refetchOnMountOrArgChange: true,
    })

    const [updateTask, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate, error: errorUpdate }] = useUpdateTaskByIdMutation();


    const [createTaskTime, { isLoading: isLoadingCreateTime, isSuccess: isSuccessCreateTime, isError: isErrorCreateTime, error: errorCreateTime }] = useCreateTaskTimeEntryMutation();

    const [updateTaskTime, { isLoading: isLoadingUpdateTime, isSuccess: isSuccessUpdateTime, isError: isErrorUpdateTime, error: errorUpdateTime }] = useUpdateTaskTimeEntryMutation();


    const colors = [
        {
            name: "Primary",
            value: "primary",
        }
    ]

    const initOpenModals = () => {
        let modals = {};

        colors.forEach((color, index) => {
            modals = Object.assign({}, modals, { [index]: false })
        })

        return modals;
    }

    const [openModal, setOpenModal] = useState<any>(() => initOpenModals());

    const toggle = (index: any) => {
        // Toggle selected element
        setOpenModal((openModal: { [x: string]: any }) => Object.assign({}, openModal, { [index]: !openModal[index] }))
    }

    const handleStartTask = (startDay: string, startHour: string, startMin: string) => {

        console.log('task', task);

        createTaskTime({
            taskId: taskId,
            user: user?._id,
            startDay: startDay,
            startHour: Number(startHour),
            startMin: Number(startMin),
            endDay: null,
            endHour: null,
            endMin: null,
            completed: false
        })

        updateTask({
            taskId: taskId,
            jobId: task.jobId._id,
            update: {
                // timeEntry: {
                //     user: userId,
                //     startDay: startDate,
                //     startHour: Number(startHour),
                //     startMin: Number(startMin),
                // },
                status: task?.status === 'New' ? 'In Progress' : task?.status,
                estimatedHours: task?.estimatedHours ? task.estimatedHours : 0x0
            }
        })

        notyf.open({
            type: "default",
            message: 'Started Task!',
            duration: 5000,
            ripple: true,
            dismissible: true,
            position: {
                x: 'center',
                y: 'top'
            }
        })


    }

    const handleStopTask = (endDay: string, endHour: string, endMin: string, currentTaskTime: TaskTime) => {

        console.log(`${endDay} - ${endHour}:${endMin}`)

        console.log('currentTaskTime', currentTaskTime)

        updateTaskTime({
            taskId: taskId,
            timeEntryId: currentTaskTime?._id ? currentTaskTime._id : '',
            user: user?._id,
            endDay: endDay,
            endHour: Number(endHour),
            endMin: Number(endMin),
            completed: true,

        })

        notyf.open({
            type: "warning",
            message: `Stopped Task!`,
            duration: 5000,
            ripple: true,
            dismissible: true,
            position: {
                x: 'center',
                y: 'top'
            }
        })

    }

    const handleCompleteTask = () => {
        notyf.open({
            type: "success",
            message: `Task ID: ${taskId}`,
            duration: 5000,
            ripple: true,
            dismissible: true,
            position: {
                x: 'center',
                y: 'top'
            }
        })

        toggle(index);
    }

    const handleLogout = () => {
        toggle(index);
        dispatch(logout());
    }

    let content;

    if (isLoadingTask || isLoadingTaskTimes) {
        content = (
            <Loader />
        )
    } else if (isErrorTask || isErrorTaskTimes || isErrorCreateTime || isErrorUpdate || isErrorUpdateTime) {
        content = (
            isErrorTask ? (
                <ErrorAlert title="Error Loading Tasks" error={JSON.stringify(errorTask, null, 2)} />
            ) : isErrorTaskTimes ? (
                <ErrorAlert title="Error Loading Task Times" error={JSON.stringify(errorTaskTimes, null, 2)} />
            ) : isErrorCreateTime ? (
                <ErrorAlert title="Error Creating Time Entry" error={JSON.stringify(errorCreateTime, null, 2)} />
            ) : isErrorUpdate ? (
                <ErrorAlert title="Error Updating Task" error={JSON.stringify(errorUpdate, null, 2)} />
            ) : isErrorUpdateTime ? (
                <ErrorAlert title="Error Updating Task Time" error={JSON.stringify(errorUpdate, null, 2)} />
            ) : (
                <ErrorAlert title="Unknown Error!" error="Unkown Error!" />
            )
        )
    } else if (isSuccessTask && task && isSuccessTaskTimes && taskTimes && user) {

        console.log('task', task);
        console.log('tasktimes', taskTimes);

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

        let currentTaskTime = taskTimes.filter((time: TaskTime) => time.completed !== true && time.user._id === user._id);

        console.log('currentTaskTime', currentTaskTime);

        content = (
            <>
                {colors.map((color, index) => (
                    <React.Fragment key={index}>
                        <Button variant="info" size="lg" onClick={() => toggle(index)}><PlusCircle size={30} />{" "}Actions</Button>
                        <Modal
                            show={openModal[index]}
                            onHide={() => toggle(index)}
                            centered
                            size="lg"
                        >
                            <Modal.Header>
                                <h3>Task Actions</h3>
                            </Modal.Header>
                            <Modal.Body>
                                {isLoadingUpdate || isLoadingCreateTime || isLoadingUpdateTime ? (
                                    <Loader />
                                ) : isSuccessCreateTime ? (
                                    <>
                                        <Card>
                                            <Card.Title>Time Entered!</Card.Title>
                                            <Button variant="success" className="text-center" size="lg" onClick={() => handleLogout()}><h3 style={{ color: "white" }}>Close</h3></Button>
                                        </Card>
                                    </>
                                ) : isSuccessUpdateTime ? (
                                    <>
                                        <Card>
                                            <Card.Title>Time Entered!</Card.Title>
                                            <Button variant="success" className="text-center" size="lg" onClick={() => handleLogout()}><h3 style={{ color: "white" }}>Close</h3></Button>
                                        </Card>
                                    </>
                                ) : (
                                    <>
                                        <Row className="text-center">
                                            {
                                                isErrorCreateTime ? (
                                                    <ErrorAlert title="Error Creating Time Entry" error={JSON.stringify(errorCreateTime, null, 2)} />
                                                ) : isErrorUpdate ? (
                                                    <ErrorAlert title="Error Updating Task" error={JSON.stringify(errorUpdate, null, 2)} />
                                                ) : isErrorUpdateTime ? (
                                                    <ErrorAlert title="Error Updating Task Time" error={JSON.stringify(errorUpdate, null, 2)} />
                                                ) : (
                                                    null
                                                )}
                                            {Object.keys(currentTaskTime).length > 0 ? (
                                                <Card>
                                                    <Card.Header>
                                                        <Card.Title>Current Time Entries for: {user.firstName} {user.lastName}</Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Table>
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ width: '25%' }}>Start Date</th>
                                                                    <th style={{ width: '25%' }}>Start Time</th>
                                                                    <th style={{ width: '25%' }}>End Date</th>
                                                                    <th style={{ width: '25%' }}>End Time</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {currentTaskTime.map((entry: TaskTime, i: number) => (
                                                                    <tr key={i}>
                                                                        <td>{entry.startDay}</td>
                                                                        <td>{String(entry.startHour)}:{String(entry.startMin)}</td>
                                                                        <td>{entry.endDay}</td>
                                                                        {entry.endHour !== null ? (
                                                                            <td>{String(entry.endHour)}:{String(entry.endMin)}</td>
                                                                        ) : (
                                                                            <td></td>
                                                                        )}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    </Card.Body>
                                                </Card>
                                            ) : (
                                                <Card>
                                                    <Card.Header>
                                                        <Card.Title>No Current Time Entry Found for this Task!</Card.Title>
                                                    </Card.Header>
                                                </Card>
                                            )}
                                        </Row>
                                        <Row className="text-center">
                                            <Col>
                                                <Button variant="primary" className="text-center" size="lg" onClick={() => handleStartTask(currentDate, currentHour, currentMin)} disabled={Object.keys(currentTaskTime).length > 0}>
                                                    <span><h3 style={{ color: "white" }}>Start</h3></span>
                                                    <hr />
                                                    <PlayCircle size={100} />{"  "}
                                                </Button>
                                            </Col>
                                            <Col>
                                                <Button variant="warning" className="text-center" size="lg" onClick={() => handleStopTask(currentDate, currentHour, currentMin, currentTaskTime.slice(-1)[0])} disabled={Object.keys(currentTaskTime).length <= 0}>
                                                    <span><h3 style={{ color: "white" }}>Stop</h3></span>
                                                    <hr />
                                                    <StopCircle size={100} />
                                                </Button>
                                            </Col>
                                            <Col>
                                                <Button variant="success" className="text-center" size="lg" onClick={() => handleCompleteTask()} disabled={Object.keys(currentTaskTime).length <= 0}>
                                                    <span><h3 style={{ color: "white" }}>Complete</h3></span>
                                                    <hr />
                                                    <CheckCircle size={100} />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </>
                                )}
                            </Modal.Body>
                        </Modal>
                    </React.Fragment >
                ))}
            </>
        )
    } else {
        content = (
            <Loader />
        )
    }

    return content;
}

export default TaskActions
