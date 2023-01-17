import React, { useContext, useState } from 'react'
import { useCreateTaskTimeEntryMutation, useGetTasksByUserQuery, useGetTasksQuery, useGetTaskTimesByIdQuery, useUpdateTaskByIdMutation, useUpdateTaskTimeEntryMutation } from '../../redux/slices/tasksSlice'
import LoadingAlert from '../LoadingAlert';
import { Badge, Button, Card, Col, Dropdown, Row, Table } from "react-bootstrap";
import { Helmet } from 'react-helmet-async'
import PaginationTable from '../PaginationTable';
import ErrorAlert from '../ErrorAlert';
import useAppSelector from '../../hooks/useAppSelector';
import { logout, selectCurrentUser } from '../../redux/slices/authSlice';
import dayjs from 'dayjs';
import JobStatuses from '../jobs/JobStatuses';
import { useGetStatusesQuery } from '../../redux/slices/jobsSlice';
import { CheckCircle, PauseCircle, PlayCircle } from 'react-feather';
import { useDispatch } from 'react-redux';
import NotyfContext from '../../contexts/NotyfContext';
import { find } from 'lodash';

const TasksByUser = () => {

    const dispatch = useDispatch();
    const notyf = useContext(NotyfContext);

    const user = useAppSelector(selectCurrentUser)

    const [currentTaskId, setCurrentTaskId] = useState('');

    const { data: tasks, isLoading: isLoadingTasks, isSuccess: isSuccessTasks, isError: isErrorTasks, error: errorTasks } = useGetTasksByUserQuery(user ? user?._id : '', {
        refetchOnMountOrArgChange: true
    });

    const { data: taskTimes, isLoading: isLoadingTaskTimes, isSuccess: isSuccessTaskTimes, isError: isErrorTaskTimes, error: errorTaskTimes } = useGetTaskTimesByIdQuery(currentTaskId ? currentTaskId : '', {
        refetchOnMountOrArgChange: true,
        skip: currentTaskId ? true : false
    });

    const [updateTask, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate, error: errorUpdate }] = useUpdateTaskByIdMutation();

    const [createTaskTime, { isLoading: isLoadingCreateTime, isSuccess: isSuccessCreateTime, isError: isErrorCreateTime, error: errorCreateTime }] = useCreateTaskTimeEntryMutation();

    const [updateTaskTime, { isLoading: isLoadingUpdateTime, isSuccess: isSuccessUpdateTime, isError: isErrorUpdateTime, error: errorUpdateTime }] = useUpdateTaskTimeEntryMutation();

    const { data: statuses, isLoading: isLoadingStatuses, isSuccess: isSuccessStatuses, isError: isErrorStatuses, error: errorStatuses } = useGetStatusesQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const handleStartTask = (taskId: string) => {
        console.log('taskId', taskId);

        setCurrentTaskId(taskId);

        // console.log('taskTimes', taskTimes);

        let jobId = tasks?.find(task => task._id === taskId)?.jobId?._id
        let task = tasks?.find(task => task._id === taskId);


        const date = new Date
        let dateConverted = date.toLocaleString(undefined, { timeZone: "Australia/Brisbane" })
        let dateToString = dayjs(dateConverted).format('DD/MM/YYYY HH:mm:ss').toString();

        let startDate = dateToString.split(" ")[0];
        let startHour = dateToString.split(" ")[1].split(":")[0]
        let startMin = dateToString.split(" ")[1].split(":")[1]

        console.log('startDate', startDate);
        console.log('task timeentries', task?.timeEntries);

        console.log('user', user?.activeTask === taskId);

        if (user?.activeTask !== task?.timeEntries.find(time => time._id === user?.activeTask) && user?.activeTask !== null) {
            notyf.open({
                message: 'Please stop other task first!',
                type: 'danger',
                duration: 2000,
                ripple: true,
                dismissible: true,
                position: {
                    x: 'center',
                    y: 'top'
                }
            })
        } else {
            //@ts-ignore
            console.log(task?.timeEntries.filter(time => time.startDay === startDate))

            if (task?.status === 'Completed') {
                notyf.open({
                    message: 'Task Completed! No Time Allowed',
                    type: 'danger',
                    duration: 2000,
                    ripple: true,
                    dismissible: true,
                    position: {
                        x: 'center',
                        y: 'top',
                    }
                })
            } else {
                //@ts-ignore
                if (task?.timeEntries.filter(time => time.startDay === startDate).length > 0) {
                    let existingTimeEntry = task?.timeEntries.find(time => time.startDay === startDate)

                    if (existingTimeEntry && existingTimeEntry.completed !== false) {
                        // notyf.open({
                        //     message: 'Task time entry completed',
                        //     type: 'danger',
                        //     duration: 2000,
                        //     ripple: true,
                        //     dismissible: true,
                        //     position: {
                        //         x: 'center',
                        //         y: 'top'
                        //     }
                        // })
                        notyf.open({
                            type: 'danger',
                            message: 'Zac Broke This!',
                            duration: 2000,
                            ripple: true,
                            dismissible: true,
                            position: {
                                x: 'center',
                                y: 'top'
                            }
                        })
                        // if (jobId) {
                        //     if (task) {
                        //         let userId = user && user?._id;
                        //         createTaskTime({
                        //             taskId: taskId,
                        //             user: userId,
                        //             startDay: startDate,
                        //             startHour: Number(startHour),
                        //             startMin: Number(startMin),
                        //             endDay: null,
                        //             endHour: null,
                        //             endMin: null,
                        //             completed: false
                        //         })

                        //         updateTask({
                        //             taskId: taskId,
                        //             jobId: jobId,
                        //             update: {
                        //                 // timeEntry: {
                        //                 //     user: userId,
                        //                 //     startDay: startDate,
                        //                 //     startHour: Number(startHour),
                        //                 //     startMin: Number(startMin),
                        //                 // },
                        //                 status: task?.status === 'New' ? 'In Progress' : task?.status,
                        //                 estimatedHours: task?.estimatedHours ? task.estimatedHours : 0x0
                        //             }
                        //         })
                        //     }
                        // }
                    } else {
                        notyf.open({
                            message: 'Task already started!',
                            type: 'danger',
                            duration: 2000,
                            ripple: true,
                            dismissible: true,
                            position: {
                                x: 'center',
                                y: 'top'
                            }
                        })
                    }
                    console.log('Task ID', task?._id)

                } else {
                    if (jobId) {
                        if (task) {
                            let userId = user && user?._id;

                            // let existingTimeEntries = task.timeEntries;

                            // let todayEntryIndex = existingTimeEntries.findIndex((item) => item.startDay === startDate);

                            // let timeEntryPayload = [{
                            //     user: userId,
                            //     startDay: startDate,
                            //     startHour: Number(startHour),
                            //     startMin: Number(startMin),
                            // }, ...existingTimeEntries]

                            // console.log('timeEntryPayload', timeEntryPayload);

                            createTaskTime({
                                taskId: taskId,
                                user: userId,
                                startDay: startDate,
                                startHour: Number(startHour),
                                startMin: Number(startMin),
                                endDay: null,
                                endHour: null,
                                endMin: null,
                                completed: false
                            })

                            updateTask({
                                taskId: taskId,
                                jobId: jobId,
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
                        }
                    }
                }
            }
        }
    }

    const handleStopTask = (taskId: string) => {
        console.log('taskId', taskId);
        let jobId = tasks?.find(task => task._id === taskId)?.jobId?._id
        let task = tasks?.find(task => task._id === taskId);

        const date = new Date
        let dateConverted = date.toLocaleString(undefined, { timeZone: "Australia/Sydney" })
        let dateToString = dayjs(dateConverted).format('DD/MM/YYYY HH:mm:ss').toString();

        let endDate = dateToString.split(" ")[0];
        let endHour = dateToString.split(" ")[1].split(":")[0]
        let endMin = dateToString.split(" ")[1].split(":")[1]

        // notyf.open({
        //     type: "default",
        //     message: "Paused Task - select another!",
        //     duration: 5000,
        //     ripple: true,
        //     dismissible: true,
        //     position: {
        //         x: 'center',
        //         y: 'top'
        //     }
        // })

        console.log('task.timeEntries.filter(time => time.startDay === endDate)', task?.timeEntries.filter(time => time.startDay === endDate));

        if (task && jobId) {
            if (task.timeEntries.filter(time => time.startDay === endDate).length > 0) {
                let existingTimeEntry = task.timeEntries.find(time => time.startDay === endDate)
                console.log('time entry for today found!', existingTimeEntry);
                let userId = user && user?._id;

                if (existingTimeEntry?.endDay !== null) {
                    notyf.open({
                        type: 'danger',
                        message: 'Time Entry already stopped!',
                        duration: 2000,
                        ripple: true,
                        dismissible: true,
                        position: {
                            x: 'center',
                            y: 'top'
                        }
                    })
                } else {
                    // notyf.open({
                    //     type: 'danger',
                    //     message: 'Zac Broke This!',
                    //     duration: 2000,
                    //     ripple: true,
                    //     dismissible: true,
                    //     position: {
                    //         x: 'center',
                    //         y: 'top'
                    //     }
                    // })
                    updateTaskTime({
                        taskId: taskId,
                        timeEntryId: existingTimeEntry?._id ? existingTimeEntry._id : '',
                        user: userId,
                        endDay: endDate,
                        endHour: Number(endHour),
                        endMin: Number(endMin),
                        completed: true,
                    })
                }


                // updateTask({
                //     taskId: taskId,
                //     jobId: jobId,
                //     update: {
                //         timeEntry: {
                //             user: userId,
                //             endDay: endDate,
                //             endHour: Number(endHour),
                //             endMin: Number(endMin),
                //         },
                //         status: task?.status === 'New' ? 'In Progress' : task?.status,
                //         estimatedHours: task?.estimatedHours ? task.estimatedHours : 0x0
                //     }
                // })

            } else {
                notyf.open({
                    type: 'danger',
                    message: 'Time Enty not found for today!',
                    duration: 2000,
                    ripple: true,
                    dismissible: true,
                    position: {
                        x: 'center',
                        y: 'top'
                    }
                })
            }
        }

        console.log('task', task);

        dispatch(logout());
    }

    const handleCompleteTask = (taskId: string) => {
        console.log('taskId', taskId);
        notyf.open({
            type: "success",
            message: "Completed Task!",
            duration: 5000,
            ripple: true,
            dismissible: true,
            position: {
                x: 'center',
                y: 'top'
            }
        })
    }

    let tableColumns = [

        {
            Header: 'Job No',
            accessor: 'jobId.jobNo',
        },
        // {
        //     Header: 'Client Name',
        //     accessor: 'jobId',
        //     //@ts-ignore
        //     Cell: ({ cell: { value } }) => value?.client?.name
        // },
        // {
        //     Header: 'Assigned',
        //     accessor: 'assignedUser',
        //     //@ts-ignore
        //     Cell: ({ cell: { value } }) => value.firstName + ' ' + value.lastName
        // },
        {
            Header: 'Task Type',
            accessor: 'taskType',
        },
        {
            Header: 'Task Description',
            accessor: 'taskDescription',
        },
        {
            Header: 'Status',
            accessor: 'status',
            //@ts-ignore
            Cell: ({ cell: { value } }) => <JobStatuses statusName={value} statuses={['New', 'In Progress', 'Completed']} />
        },
        {
            Header: 'Actions',
            accessor: '_id',
            //@ts-ignore
            Cell: ({ cell: { value } }) => (
                <Button variant="primary" size="sm" onClick={() => handleStartTask(value)}>{/*<PlayCircle size={18} /> */}Start</Button>
            )
        },
        {
            Header: 'Actions',
            accessor: '_id',
            //@ts-ignore
            Cell: ({ cell: { value } }) => (
                <Button variant="warning" size="sm" onClick={() => handleStopTask(value)}>{/*<PauseCircle size={18} />*/}Stop</Button>
            )
        },
        {
            Header: 'Actions',
            accessor: '_id',
            //@ts-ignore
            Cell: ({ cell: { value } }) => (

                <Button variant="success" size="sm" onClick={() => handleCompleteTask(value)}>{/*<CheckCircle size={18} />*/}Complete</Button>
            )
        }
    ];

    let content;

    if (isSuccessUpdate) {
        notyf.open({
            type: "default",
            message: "Saved Task!",
            duration: 5000,
            ripple: true,
            dismissible: true,
            position: {
                x: 'center',
                y: 'top'
            }
        })
        // dispatch(logout());
    }

    if (isErrorUpdate) {
        notyf.open({
            type: "danger",
            message: `Error: ${JSON.stringify(errorUpdate, null, 2)}`,
            duration: 5000,
            ripple: true,
            dismissible: true,
            position: {
                x: 'center',
                y: 'top'
            }
        })
    }

    if (isLoadingTasks) {
        content = (
            <LoadingAlert title="Loading Tasks..." />
        )
    } else if (isSuccessTasks && tasks) {
        content = (
            <React.Fragment>
                <Helmet title="Tasks" />
                <Card className="flex-fill w-100">
                    <Card.Header>
                        <Card.Title className="mb-0">Tasks</Card.Title>
                    </Card.Header>
                    <PaginationTable columns={tasks ? tableColumns : []} data={tasks ? tasks : []} navigateCommand="/kiosk/tasks" />
                </Card >
            </React.Fragment>
        )
    } else if (isErrorTasks || isErrorTaskTimes) {
        isErrorTaskTimes ? (
            content = (
                <ErrorAlert title="Error loading tasks!" error={errorTasks ? JSON.stringify(errorTasks) : ''} />
            )
        ) : content = (
            <ErrorAlert title="Error loading task times!" error={errorTaskTimes ? JSON.stringify(errorTaskTimes) : ''} />
        )
    } else {
        content = (
            <LoadingAlert title="Loading..." />
        )
    }

    return content;
}

export default TasksByUser