import React, { useEffect } from "react";
import dayjs from 'dayjs'
import { Helmet } from "react-helmet-async";
import { Badge, Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { Client } from "../../types/clients";
import { useGetClientByIdQuery } from "../../redux/slices/clientsSlice";
import useAppSelector from "../../hooks/useAppSelector";
import { useGetJobsByClientIdQuery } from "../../redux/slices/jobsSlice";
import { useNavigate, useParams } from "react-router-dom";
import LoadingAlert from "../LoadingAlert";
import ErrorAlert from "../ErrorAlert";
import { ArrowLeftCircle, SkipBack } from "react-feather";

const ClientEdit = () => {

    const { clientId } = useParams();

    const { data: jobs, isLoading: isLoadingJobs, isFetching: isFetchingJobs, isError: isErrorJobs, isSuccess: isSuccessJobs, error: errorJobs } = useGetJobsByClientIdQuery(clientId ? clientId : '')
    const { data: client, isLoading: isLoadingClient, isFetching: isFetchingClient, isError: isErrorClient, isSuccess: isSuccessClient, error: errorClient } = useGetClientByIdQuery(clientId ? clientId : '')

    const navigate = useNavigate();


    let content;

    if (isLoadingJobs || isLoadingClient) {
        content = (
            <LoadingAlert title="Loading..." />
        )
    } else if (isErrorJobs || isErrorClient) {
        content = (
            <ErrorAlert title="Error" error={JSON.stringify(errorJobs ? errorJobs : errorClient)} />
        )
    } else if (isSuccessClient && isSuccessJobs) {
        let sortedJobs: any[]
        if (jobs) {
            sortedJobs = [...jobs]
        } else {
            sortedJobs = []
        }
        content = (
            <Card>
                <Card.Header>
                    <Col xs="auto" className="d-none d-sm-block">
                        <Card.Title className="mb-0">Client Edit</Card.Title>
                    </Col>
                    <Col xs="auto" className="ms-auto text-end mt-n1">
                        <Button variant="primary" className="shadow-sm" onClick={() => navigate('/clients')}>
                            <ArrowLeftCircle />
                        </Button>
                    </Col>
                </Card.Header>
                <Card.Body>
                    <Table size="sm" className="my-2">
                        {client ? (
                            <tbody>
                                <tr>
                                    <th>Name</th>
                                    <td>{client.name}</td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <td>
                                        <Badge bg="success">Active</Badge>
                                    </td>
                                </tr>
                            </tbody>
                        ) : ''}
                    </Table>

                    {sortedJobs && sortedJobs.length > 0 ? (
                        <>
                            <hr />
                            <strong>Jobs</strong>
                            <ul className="timeline mt-2">
                                {
                                    sortedJobs.sort((a, b) => {
                                        let c: any = new Date(a.dateSubmitted)
                                        let d: any = new Date(b.dateSubmitted)
                                        return d - c;
                                    }).map(job => (
                                        <li className="timeline-item" key={job._id}>
                                            <strong>Job #{job.jobNo}</strong>
                                            <span className="float-end text-muted text-sm">{dayjs(job.dateSubmitted).format('DD/MM/YYYY HH:mm')}</span>
                                            <p>{job.description}</p>
                                        </li>
                                    ))
                                }
                            </ul>
                        </>
                    ) : ''}
                </Card.Body>
            </Card>
        )
    } else {
        content = (
            <LoadingAlert title="Loading.." />
        )
    }

    return content;
}

export default ClientEdit