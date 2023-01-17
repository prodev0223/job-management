import React, { useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import useAppSelector from '../../hooks/useAppSelector'
import { selectCurrentUser } from '../../redux/slices/authSlice'
import { useGetTasksByUserQuery } from '../../redux/slices/tasksSlice';
import ErrorAlert from '../ErrorAlert';
import JobStatuses from '../jobs/JobStatuses';
import Loader from '../Loader';
import LoadingAlert from '../LoadingAlert';
import PaginationTable from '../PaginationTable';
import TaskActions from './TaskActions';

const TasksByUser2 = () => {

    const user = useAppSelector(selectCurrentUser);

    const { data: tasks, isLoading: isLoadingTasks, isSuccess: isSuccessTasks, isError: isErrorTasks, error: errorTasks } = useGetTasksByUserQuery(user ? user?._id : '', {
        refetchOnMountOrArgChange: true
    })


    let tableColumns = [
        {
            Header: 'Job No',
            accessor: 'jobId.jobNo',
        },
        {
            Header: 'Client Name',
            accessor: 'jobId',
            //@ts-ignore
            Cell: ({ cell: { value } }) => value?.client?.name
        },
        {
            Header: 'Assigned',
            accessor: 'assignedUser',
            //@ts-ignore
            Cell: ({ cell: { value } }) => value?.firstName + ' ' + value?.lastName
        },
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
            Cell: ({ cell: { value } }: { cell: { value: string } }) => <TaskActions taskId={value} index={0} />
        }
    ];

    let content;

    if (isLoadingTasks) {
        content = (
            <LoadingAlert title="Loading Tasks..." />
        )
    } else if (isSuccessTasks && tasks) {
        content = (
            <>
                <Helmet title="Tasks" />
                <Card className="flex-fill">
                    <Card.Header>
                        <Card.Title className="mb-0">Tasks</Card.Title>
                    </Card.Header>
                    <PaginationTable columns={tasks ? tableColumns : []} data={tasks ? tasks.filter(task => task.status !== 'Completed') : []} />
                </Card>
            </>
        )
    } else if (isErrorTasks) {
        content = (
            <ErrorAlert title="Error loading tasks!" error={errorTasks ? JSON.stringify(errorTasks, null, 2) : ''} />
        )
    } else {
        content = (
            <Loader />
        )
    }

    return content;
}

export default TasksByUser2
