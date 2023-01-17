import React from 'react'
import { Alert, Button, Card, Col, Row } from 'react-bootstrap';
import { ArrowLeft, Clock, Edit, Edit2 } from 'react-feather';
import { useNavigate, useParams } from 'react-router'
import ErrorAlert from '../../../components/ErrorAlert';
import LoadingAlert from '../../../components/LoadingAlert';
import PaginationTable from '../../../components/PaginationTable';
import { useGetTaskByIdQuery } from '../../../redux/slices/tasksSlice';

const KioskTaskDetails = () => {

    const { taskId } = useParams();
    const navigate = useNavigate();

    const { data: task, isLoading, isError, isSuccess, error } = useGetTaskByIdQuery(taskId ? taskId : '', {
        refetchOnMountOrArgChange: true
    })

    const handleTimeEntryStart = () => {
        alert('Handling Time Entries');
    }

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

    if (isLoading) {
        content = (
            <LoadingAlert title="Loading Task..." card={true} />
        )
    } else if (isError) {
        content = (
            <ErrorAlert title="Error loading task..." error={JSON.stringify(error)} />
        )
    } else if (isSuccess) {
        content = (
            <>
                <Card>
                    <Row className="mb-2 mb-xl-3">
                        <Col xs="auto" className="d-none d-sm-block">
                            <Card.Header>
                                <Card.Title>Task Details:</Card.Title>

                            </Card.Header>
                        </Col>
                        <Col xs="auto" className="ms-auto text-end">
                            <Card.Header>
                                <Button variant="secondary" className="shadow-sm" onClick={() => navigate(`/kiosk/tasks`)}><ArrowLeft size={18} /></Button>
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
                {task?.timeEntries && task?.timeEntries?.length > 0 ? (

                    <Card>
                        <Row className="mb-2 mb-xl-3">
                            <Col xs="auto" className="d-none d-sm-block">
                                <Card.Header>
                                    <Card.Title>
                                        Task Time Entries:
                                    </Card.Title>
                                </Card.Header>
                            </Col>
                            <Col xs="auto" className="ms-auto text-end">
                                <Card.Header>
                                    <Button variant="secondary" className="shadow-sm" onClick={handleTimeEntryStart}><Clock size={18} /></Button>
                                </Card.Header>
                            </Col>
                        </Row>
                        <Card.Header>
                        </Card.Header>
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

export default KioskTaskDetails
