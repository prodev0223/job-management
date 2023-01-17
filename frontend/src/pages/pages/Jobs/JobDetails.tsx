import React from "react";
import { Helmet } from "react-helmet-async";
import { Alert, Badge, Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import useAppSelector from "../../../hooks/useAppSelector";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Calendar, Clock, DollarSign, Edit, ExternalLink, FilePlus, Home, Info, Mail, Phone, User } from "react-feather";
import { Link } from "react-router-dom";
import { useGetJobByIdQuery, useGetJobStatsInXeroByIdQuery, useGetStatusesQuery } from "../../../redux/slices/jobsSlice";
import Loader from "../../../components/Loader";
import JobTasks from "../../../components/tasks/JobTasks";
import JobStatuses from "../../../components/jobs/JobStatuses";
import { useGetClientTeamsByIdQuery } from "../../../redux/slices/clientsSlice";

const JobDetails = () => {

  const { jobId } = useParams();
  const navigate = useNavigate();
  const { data: job, isLoading, isSuccess, isError, error } = useGetJobByIdQuery(jobId ? jobId : '', {
    refetchOnMountOrArgChange: true
  });

  const { data: statuses, isLoading: isLoadingStatuses, isError: isErrorStatuses, isSuccess: isSuccessStatuses, error: errorStatuses } = useGetStatusesQuery(undefined, {
    refetchOnMountOrArgChange: true
  })

  const { data: clientTeams, isLoading: isLoadingClientTeams, isError: isErrorClientTeams, isSuccess: isSuccessClientTeams, error: errorClientTeams } = useGetClientTeamsByIdQuery(job?.client?.teamsId ? job?.client.teamsId : '', {
    skip: isSuccess ? false : true
  })

  const { data: jobStats, isLoading: isLoadingJobStats, isError: isErrorJobStats, isSuccess: isSuccessJobStats, error: errorJobStats } = useGetJobStatsInXeroByIdQuery(job && job.xeroReference ? job.xeroReference : '', {
    refetchOnMountOrArgChange: true,
    skip: isSuccess ? false : true
  })


  let content;

  if (isLoading || isLoadingStatuses) {
    content = (
      <React.Fragment>
        <Helmet title="Job loading" />
        <Container fluid className="p-0">
          <Loader />
        </Container>
      </React.Fragment>
    )
  } else if (isSuccess && isSuccessStatuses) {

    if (job && job._id === jobId && statuses) {
      content = (
        <React.Fragment>
          <Helmet title={`#${job?.jobNo} - ${job?.description}`} />
          <Container fluid className="p-0">
            {/* <h1 className="h3 mb-2">Job: {job?.jobNo}</h1> */}
            <Row>
              <Col sm="5" md="4" lg="3" xl="3">
                <React.Fragment>
                  {/* <ClientDetails client={job?.client} /> */}
                  <Card className="table-responsive">
                    <Card.Header>
                      <Row>
                        <Col>
                          <Card.Title className="mb-0">Job Details - {job?.jobNo}</Card.Title>
                        </Col>
                        <Col xs="auto" className="ms-auto text-end mt-n1">
                          <Button variant="warning" onClick={() => navigate(`/jobs/${job._id}/edit`)}><Edit size={18} /></Button>
                        </Col>
                      </Row>
                    </Card.Header>
                    <Card.Body className="text-center">
                      <Card.Title className="mb-0">{job?.description}</Card.Title>
                    </Card.Body>
                    <hr className="my-0" />
                    <Card.Body className="m-sm-1 m-md-1">
                      <Link to={`/clients/${job?.client?._id}`} ><Card.Title className="text-center">{job?.client?.name}</Card.Title></Link>
                      <Table size="sm" className="my-2">
                        <tbody>
                          <tr>
                            <th><Info width={16} height={16} className="me-1" />{" "} Job Status</th>
                            <td><JobStatuses statusId={job.jobStatus?._id} statuses={statuses} /></td>                          </tr>
                          <tr>
                            <th><Info width={16} height={16} className="me-1" />{" "} Quote Status</th>
                            <td><JobStatuses statusId={job.quoteStatus?._id} statuses={statuses} /></td>
                          </tr>
                          <tr>
                            <th><DollarSign width={16} height={16} className="me-1" />{" "} Do and Charge?</th>
                            <td>{Boolean(job.doAndCharge) ?
                              (
                                <Badge bg="success">Yes</Badge>
                              ) : (
                                <Badge bg="danger">No</Badge>
                              )}
                            </td>
                          </tr>
                          {jobStats ? (
                            <>
                              <tr>
                                <th><Clock width={16} height={16} className="me-1" />{" "} Hours Estimated</th>
                                <td><strong>{String(jobStats?.estimatedMinutes) ? String((jobStats.estimatedMinutes / 60).toFixed(2)) : 'Loading...'} {" "} hrs</strong></td>
                              </tr>
                              <tr>
                                <th><Clock width={16} height={16} className="me-1" />{" "} Hours Spent</th>
                                <td><strong>{String(jobStats?.spentMinutes) ? String((jobStats.spentMinutes / 60).toFixed(2)) : 'Loading...'} {" "} hrs</strong></td>
                              </tr>
                            </>
                          ) : null}
                        </tbody>
                      </Table>
                    </Card.Body>
                    <hr className="my-0" />
                    <Card.Body>
                      <Table size="sm" className="table">
                        <tbody>
                          <tr>
                            <th><User width={16} height={16} className="me-1" />{" "} Contact</th>
                            <td>{job.contact.name}</td>
                          </tr>
                          <tr>
                            <th><Mail width={16} height={16} className="me-1" />{" "} Email</th>
                            <td><a href={`mailto:${job.contact.email}`}>{job.contact.email}</a></td>
                          </tr>
                          <tr>
                            <th><Phone width={16} height={16} className="me-1" />{" "} Phone</th>
                            <td><a href={`tel:${job.contact.phone}`}>{job.contact.phone}</a></td>
                          </tr>
                          <tr>
                            <th style={{ border: 0 }}><Home width={16} height={16} className="me-1" />{" "} Address</th>
                            <td style={{ border: 0 }}>
                              {job.address.streetAddress1},
                            </td>
                          </tr>
                          <tr style={{ border: 0 }}>
                            <th style={{ border: 0 }}></th>
                            <td style={{ border: 0 }}>
                              {job.address.city}, {job.address.postcode},
                            </td>
                          </tr>
                          <tr style={{ border: 0 }}>
                            <th></th>
                            <td>
                              {job.address.state}, {job.address.country}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                    <hr className="my-0" />
                    <Card.Body className="m-sm-1 m-md-1">
                      <Card.Title className="text-center">Dates</Card.Title>
                      <Table size="sm" className="my-2 ml-1 mr-1">
                        <tbody>
                          <tr>
                            <th><Calendar width={16} height={16} className="me-1" />{" "} Date Submitted</th>
                            <td>{dayjs(job.dateSubmitted).format('DD/MM/YYYY')}</td>
                          </tr>
                          <tr>
                            <th><Calendar width={16} height={16} className="me-1" />{" "} Required Date of Quote</th>
                            <td>{dayjs(job.reqDateOfQuote).format('DD/MM/YYYY')}</td>
                          </tr>
                          <tr>
                            <th><Calendar width={16} height={16} className="me-1" />{" "} Follow Up Date</th>
                            <td>{dayjs(job?.followUpDate).format('DD/MM/YYYY')}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                    <hr className="my-0" />
                    <Card.Body className="m-sm-1 m-md-1">
                      <Card.Title className="text-center">References</Card.Title>
                      <Table size="sm" className="my-2">
                        <tbody>
                          <tr>
                            <th>Project Files</th>
                            <td><Button variant="info" size="sm" href={clientTeams && clientTeams?.webUrl} target="_blank"><ExternalLink width={16} height={16} /></Button></td>
                          </tr>
                          <tr>
                            <th>Xero Project Link</th>
                            <td><Button variant="info" size="sm" href={`https://go.xero.com/app/!mz9g0/projects/project/${job.xeroReference}`} target="_blank"><ExternalLink width={16} height={16} /></Button></td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </React.Fragment>
              </Col>
              <Col>
                {jobId ? (
                  <>
                    <JobTasks />
                  </>
                ) : (
                  null
                )}
              </Col>
            </Row>
          </Container>
        </React.Fragment >
      )
    } else {
      content = (
        <React.Fragment>
          <Card className="flex-fill w-100">
            <Card.Header>
              <Card.Title className="mb-0">Job Details...</Card.Title>
            </Card.Header>
            <Loader />
          </Card >
        </React.Fragment>
      )
    }
  } else if (isError || isErrorStatuses) {
    content = (
      <React.Fragment>
        <Container fluid className="p-0">
          {isError ? (
            <Alert variant="danger">{JSON.stringify(error, null, 2)}</Alert>)
            : isErrorStatuses ? (
              <Alert variant="danger">{JSON.stringify(errorStatuses, null, 2)}</Alert>
            ) : ''}
        </Container>
      </React.Fragment>
    )
  } else {
    content = (
      <React.Fragment>
        <Card className="flex-fill w-100">
          <Card.Header>
            <Card.Title className="mb-0">Job Details...</Card.Title>
          </Card.Header>
          <Loader />
        </Card >
      </React.Fragment>
    )
  }

  return content;
}

export default JobDetails;
