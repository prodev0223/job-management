import React, { useEffect } from "react";
import dayjs from 'dayjs'
import { Helmet } from "react-helmet-async";
import { Badge, Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { Client } from "../../types/clients";
import { useCreateClientTeamInMicrosoftMutation, useGetClientByIdQuery, useGetClientTeamsByIdQuery, useGetClientXeroByIdQuery, useUpdateClientMutation } from "../../redux/slices/clientsSlice";
import useAppSelector from "../../hooks/useAppSelector";
import { useGetJobsByClientIdQuery } from "../../redux/slices/jobsSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingAlert from "../LoadingAlert";
import ErrorAlert from "../ErrorAlert";
import { ArrowLeft, ArrowLeftCircle, Loader, SkipBack } from "react-feather";

const ClientDetails = () => {

    const { clientId } = useParams();

    const { data: jobs, isLoading: isLoadingJobs, isError: isErrorJobs, isSuccess: isSuccessJobs, error: errorJobs } = useGetJobsByClientIdQuery(clientId ? clientId : '')
    const { data: client, isLoading: isLoadingClient, isError: isErrorClient, isSuccess: isSuccessClient, error: errorClient } = useGetClientByIdQuery(clientId ? clientId : '', {
        refetchOnMountOrArgChange: true
    })

    const { data: clientTeams, isLoading: isLoadingClientTeams, isError: isErrorClientTeams, isSuccess: isSuccessClientTeams, error: errorClientTeams } = useGetClientTeamsByIdQuery(client?.teamsId ? client.teamsId : '', {
        skip: isSuccessClient && client?.teamsId !== "UNKNOWN" ? false : true,
        refetchOnMountOrArgChange: true
    })

    const [updateClient, { isLoading: isLoadingUpdateClient, isError: isErrorUpdateClient, isSuccess: isSuccessUpdateClient, error: errorUpdateClient }] = useUpdateClientMutation();


    const [createTeamsChannel, { data: clientTeamCreated, isLoading: isLoadingTeamsChannelCreate, isError: isErrorTeamsChannelCreate, isSuccess: isSuccessTeamsChannelCreate, error: errorTeamsChannelCreate }] = useCreateClientTeamInMicrosoftMutation();

    // const { data: clientXero, isLoading: isLoadingClientXero, isError: isErrorClientXero, isSuccess: isSuccessClientXero, error: errorClientXero } = useGetClientXeroByIdQuery(client?.xeroId ? client.xeroId : '', {
    //     skip: isSuccessClient ? false : true
    // })

    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccessTeamsChannelCreate && !isLoadingUpdateClient) {
            console.log('clientTeamCreated', clientTeamCreated)
            if (clientTeamCreated) {
                if (client && clientId) {
                    updateClient({
                        clientId: clientId,
                        client: {
                            name: client.name,
                            isActive: true,
                            teamsId: clientTeamCreated.id
                        }
                    })
                }
            }
        }
    }, [isSuccessClientTeams])




    let content;

    if (isLoadingJobs || isLoadingClient || isLoadingTeamsChannelCreate || isLoadingUpdateClient) {
        content = (
            <LoadingAlert title="Loading..." />
        )
    } else if (isErrorJobs || isErrorClient) {
        content = (
            <ErrorAlert title="Error" error={JSON.stringify(errorJobs ? errorJobs : errorClient)} />
        )
    } else if (isErrorTeamsChannelCreate) {
        content = (
            <ErrorAlert title="Error Creating Teams!" error={JSON.stringify(errorTeamsChannelCreate, null, 2)} />
        )
    } else if (isErrorUpdateClient) {
        content = (
            <ErrorAlert title="Error Updating Client!" error={JSON.stringify(errorUpdateClient, null, 2)} />
        )
    } else if (isSuccessClient && isSuccessJobs) {
        let sortedJobs: any[]
        if (jobs) {
            sortedJobs = [...jobs]
        } else {
            sortedJobs = []
        }

        console.log('client', client);

        content = (
            <Card>
                <Card.Header>
                    <Col xs="auto" className="d-none d-sm-block">
                        <Card.Title className="mb-0">Client Details</Card.Title>
                    </Col>
                    <Col xs="auto" className="ms-auto text-end mt-n1">
                        <Button variant="secondary" className="shadow-sm" onClick={() => navigate('/clients')}>
                            <ArrowLeft size={18} />
                        </Button>
                    </Col>
                </Card.Header>
                <Card.Body>
                    {clientTeams ? (
                        <Table size="sm" className="my-2">
                            {client ? (
                                <tbody>
                                    <tr>
                                        <th>Name</th>
                                        <td>{client.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Teams Site</th>
                                        <td><a href={clientTeams && clientTeams?.webUrl} target="_blank">Client Teams Channel</a></td>
                                    </tr>
                                    <tr>
                                        <th>Xero Contact ID</th>
                                        <td><a href={`https://go.xero.com/Contacts/View/${client.xeroId && client.xeroId}`} target="_blank">Client Xero File</a></td>
                                    </tr>
                                    <tr>
                                        <th>Status</th>
                                        <td>
                                            {client?.isActive === true ? <Badge bg="success">Active</Badge> : <Badge bg="danger">Inactive</Badge>}
                                        </td>
                                    </tr>
                                </tbody>
                            ) : ''}
                        </Table>
                    ) : (
                        <Table size="sm" className="my-2">
                            {client ? (
                                <tbody>
                                    <tr>
                                        <th>Name</th>
                                        <td>{client.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Teams Site</th>
                                        <td>{client.teamsId !== 'UNKNOWN' ? (<a href={clientTeams && clientTeams?.webUrl} target="_blank">Client Teams Channel</a>) : (
                                            <Button onClick={() => createTeamsChannel(client.name)}>
                                                Create Teams
                                            </Button>)
                                        }</td>
                                    </tr>
                                    <tr>
                                        <th>Xero Contact ID</th>
                                        <td>{client.xeroId}</td>
                                    </tr>
                                    <tr>
                                        <th>Status</th>
                                        <td>
                                            {client?.isActive === true ? <Badge bg="success">Active</Badge> : <Badge bg="danger">Inactive</Badge>}
                                        </td>
                                    </tr>
                                </tbody>
                            ) : ''}
                        </Table>

                    )}

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
                                            <Link to={`/jobs/${job._id}`}><strong>Job #{job.jobNo}</strong></Link>
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

export default ClientDetails