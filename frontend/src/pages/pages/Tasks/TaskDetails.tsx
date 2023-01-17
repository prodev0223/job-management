import React from 'react'
import { Alert, Button, Card, Col, Row } from 'react-bootstrap';
import { ArrowLeft, Edit, Edit2 } from 'react-feather';
import { useNavigate, useParams } from 'react-router'
import ErrorAlert from '../../../components/ErrorAlert';
import LoadingAlert from '../../../components/LoadingAlert';
import PaginationTable from '../../../components/PaginationTable';
import { useGetTaskByIdQuery, useGetTaskTimesByIdQuery } from '../../../redux/slices/tasksSlice';

const TaskDetails = () => {

    const { taskId } = useParams();
    const navigate = useNavigate();

    const { data: task, isLoading, isError, isSuccess, error } = useGetTaskByIdQuery(taskId ? taskId : '', {
        refetchOnMountOrArgChange: true
    })

    const { data: taskTimes, isLoading: isLoadingTimes, isError: isErrorTimes, isSuccess: isSuccessTimes, error: errorTimes } = useGetTaskTimesByIdQuery(taskId ? taskId : '', {
        refetchOnMountOrArgChange: true
    })

    let tableColumns = [
        {
            Header: 'Entered By',
            accessor: 'user',
            // @ts-ignore
            Cell: ({ cell: { value } }) => value?.firstName + ' ' + value?.lastName
        },
        {
            Header: 'Start Day',
            accessor: 'startDay'
        },
        {
            Header: 'Start Hour',
            accessor: 'startHour',
        },
        {
            Header: 'Start Minute',
            accessor: 'startMin'
        },
        {
            Header: 'End Day',
            accessor: 'endDay'
        },
        {
            Header: 'End Hour',
            accessor: 'endHour'
        },
        {
            Header: 'End Min',
            accessor: 'endMin'
        }
    ]

    let content;

    if (isLoading || isLoadingTimes) {
        content = (
            <LoadingAlert title="Loading Task..." card={true} />
        )
    } else if (isError || isErrorTimes) {
        content = (
            <ErrorAlert title="Error loading task..." error={JSON.stringify(error)} />
        )
    } else if (isSuccess || isSuccessTimes) {


        content = (
            <>
                <Card>
                    <Row className="mb-2 mb-xl-3">
                        <Col xs="auto" className="d-none d-sm-block">
                            <Card.Header>
                                <Card.Title>Task Details:</Card.Title>
                                <h5>Estimated Hours: <strong>{task && task?.estimatedHours ? task.estimatedHours : 0} hrs</strong></h5>

                            </Card.Header>
                        </Col>
                        <Col xs="auto" className="ms-auto text-end">
                            <Card.Header>
                                <Row>
                                    <Col>
                                        <Button variant="warning" className="shadow-sm" onClick={() => navigate(`/tasks/${taskId}/edit`)}><Edit2 size={18} /></Button>
                                    </Col>
                                    <Col>
                                        <Button variant="secondary" className="shadow-sm" onClick={() => navigate(task && task.jobId ? `/jobs/${task.jobId._id}` : '/jobs')}><ArrowLeft size={18} /></Button>
                                    </Col>
                                </Row>
                            </Card.Header>
                        </Col>
                    </Row>
                    {task
                        ?
                        <Card.Body>
                            <strong>{task.taskDescription}</strong>
                        </Card.Body>
                        : ''}
                </Card>
                {task?.timeEntries && task.timeEntries?.length > 0 ? (

                    <Card>
                        <Card.Header>Task Time Entries:</Card.Header>
                        <Card.Body>
                            <PaginationTable
                                data={task?.timeEntries ? task.timeEntries : []}
                                columns={tableColumns}
                                navigateCommand={'/tasks/edit'}
                                actionIcon={<Edit size={18} />}
                            />
                        </Card.Body>
                    </Card>
                ) : (
                    <ErrorAlert title="No time entries recorded..." error={''} />
                )}
            </>
        )
    } else {
        content = (
            <LoadingAlert title="Loading task..." />
        )
    }

    return content;
}

export default TaskDetails
