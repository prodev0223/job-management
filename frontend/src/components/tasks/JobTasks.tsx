import React from 'react'
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';
import { Edit2, Eye, PlusCircle } from 'react-feather';
import { useNavigate, useParams } from 'react-router-dom'
import { useGetTasksByJobIdQuery } from '../../redux/slices/tasksSlice';
import ErrorAlert from '../ErrorAlert';
import { SelectColumnFilter } from '../FilterTypes';
import LoadingAlert from '../LoadingAlert';
import PaginationTable from '../PaginationTable';

const JobTasks = () => {
    const { jobId } = useParams();

    const navigate = useNavigate();

    const { data: tasks, isLoading, isError, isSuccess, error } = useGetTasksByJobIdQuery(jobId ? jobId : '', {
        refetchOnMountOrArgChange: true
    });

    let content;

    let tableColumns = [
        {
            Header: 'Task Type',
            accessor: 'taskType',
            Filter: SelectColumnFilter,
            filter: "includes",
        },
        {
            Header: 'Task Description',
            accessor: 'taskDescription',
            //@ts-ignore
            Cell: ({ cell: { value } }) => value.substr(0, 60) + '...'
        },
        {
            Header: 'Status',
            accessor: 'status',
            Filter: SelectColumnFilter,
            filter: "includes",
            // @ts-ignore
            // Cell: ({ cell: { value } }) => value === "New" ? <Badge color="warning">{value}</Badge> : value === "In Progress" ? <Badge color="info">{value}</Badge> : <Badge color="success">{value}</Badge>
            Cell: ({ cell: { value } }) => (
                value === "New" ?
                    <Badge color="warning">{value}</Badge>
                    : value === "In Progress" ?
                        <Badge color="info">{value}</Badge>
                        :
                        <Badge color="success">{value}</Badge>

            )
        },
        {
            Header: 'Assigned User',
            accessor: 'assignedUser',
            // Filter: SelectColumnFilter,
            // filter: "includes",
            //@ts-ignore
            Cell: ({ cell: { value } }) => value?.firstName + ' ' + value?.lastName
        },
        {
            Header: 'Actions',
            accessor: '_id',
            // @ts-ignore
            Cell: ({ cell: { value } }) => (
                <Row>
                    <Col className="mb-1">
                        <Button variant="primary" size="sm" onClick={() => navigate(`/tasks/${value}`)}><Eye size={18} /></Button>
                    </Col>
                    <Col className="mb-1">
                        <Button variant="warning" size="sm" onClick={() => navigate(`/tasks/${value}/edit`)}><Edit2 size={18} /></Button>
                    </Col>
                </Row>
            )
        }
    ]

    if (isLoading) {
        content = (
            <LoadingAlert title="Loading Tasks..." card={true} />
        )
    } else if (isError) {
        content = (
            <ErrorAlert title="Error loading tasks!" error={JSON.stringify(error)} />
        )
    } else if (isSuccess) {
        content = (
            <>
                <Card.Header>
                    <Col xs="auto" className="ms-auto text-end mt-n1">
                        <Button variant="primary" className="shadow-sm" onClick={() => navigate(`/jobs/${jobId}/tasks`)}>
                            <PlusCircle size={18} /> {" "}
                            New Task
                        </Button>
                    </Col>
                </Card.Header>
                <PaginationTable data={tasks ? tasks : []} columns={tableColumns ? tableColumns : []} navigateCommand={'/tasks'} usePageSize={10} />
            </>
        )
    } else {
        content = (
            <LoadingAlert title="Loading Tasks..." card={true} />
        )
    }


    return content;
}

export default JobTasks
