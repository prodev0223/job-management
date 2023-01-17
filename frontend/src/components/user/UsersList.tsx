import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Edit2, Eye, Loader, PlusCircle } from 'react-feather';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetUsersQuery } from '../../redux/slices/userApiSlice';
import ErrorAlert from '../ErrorAlert';
import LoadingAlert from '../LoadingAlert';
import PaginationTable from '../PaginationTable';

const UsersList = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { data: users, isLoading: isLoadingUsers, isSuccess: isSucccessUsers, isError: isErrorUsers, error: errorUsers } = useGetUsersQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    })

    let tableColumns = [
        {
            Header: 'Employee ID',
            accessor: 'employeeId',
        },
        {
            Header: 'First Name',
            accessor: 'firstName',
        },
        {
            Header: 'Last Name',
            accessor: 'lastName',
        },
        {
            Header: 'Email',
            accessor: 'email',
        },
        {
            Header: 'Role',
            accessor: 'roleId',
            //@ts-ignore
            Cell: ({ cell: { value } }) => value?.name
        },
        {
            Header: 'Actions',
            accessor: '_id',
            //@ts-ignore
            Cell: ({ cell: { value } }) => (
                <Row>
                    <Col className="mb-1">
                        <Button variant="primary" size="sm" onClick={() => navigate(`/users/${value}`)}><Eye size={18} /></Button>
                    </Col>
                    <Col className="mb-1">
                        <Button variant="warning" size="sm" onClick={() => navigate(`/users/${value}/edit`)}><Edit2 size={18} /></Button>
                    </Col>
                </Row>
            )
        }
    ]

    let content;

    if (isLoadingUsers) {
        content = (
            <LoadingAlert title="Loading Users..." />
        )
    } else if (isSucccessUsers) {
        content = (
            <React.Fragment>
                <Helmet title="User Management" />
                <Card className="flex-fill w-100">
                    <Card.Header>
                        <Col xs="auto" className="ms-auto text-end mt-n1">
                            <Button variant="primary" className="shadow-sm" onClick={() => navigate(`/users`)}>
                                <PlusCircle size={18} /> {" "}
                                New
                            </Button>
                        </Col>
                    </Card.Header>
                    <PaginationTable columns={tableColumns} data={users ? users : []} />
                </Card>
            </React.Fragment>
        )
    } else if (isErrorUsers) {
        content = (
            <ErrorAlert title="Error loading users!" error={JSON.stringify(errorUsers, null, 2)} />
        )
    } else {
        content = (
            <LoadingAlert title="Loading..." />
        )
    }

    return content;
}

export default UsersList