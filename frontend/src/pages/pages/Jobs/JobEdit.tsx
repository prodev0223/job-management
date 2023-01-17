import React from "react";
import { Helmet } from "react-helmet-async";
import { Formik, useFormik } from 'formik';
import * as Yup from "yup";
import { Alert, Badge, Button, Card, Col, Container, Row, Form, Table, ButtonGroup } from "react-bootstrap";
import { useParams } from "react-router";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import DatePicker from 'react-date-picker';
import { ArrowLeft, Calendar, ExternalLink, Home, Mail, Phone, Target, User } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import { useGetJobByIdQuery, useGetStatusesQuery, useUpdateJobByIdMutation } from "../../../redux/slices/jobsSlice";
import Loader from "../../../components/Loader";
import ErrorAlert from "../../../components/ErrorAlert";
import CustomSelect from "../../../components/CustomSelect";
import InputMask from "react-input-mask";
import { useGetClientsQuery } from "../../../redux/slices/clientsSlice";
import { Client } from "../../../types/clients";
import { useGetUsersQuery } from "../../../redux/slices/userApiSlice";
import Datetime from "react-datetime";

const JobEdit = () => {

  const { jobId } = useParams();

  const navigate = useNavigate();

  const { data: job, isLoading: isLoadingJob, isError: isErrorJob, isSuccess: isSuccessJob, error: errorJob } = useGetJobByIdQuery(jobId ? jobId : '', {
    refetchOnMountOrArgChange: true
  }
  )

  const { data: statuses, isLoading: isLoadingStatuses, isError: isErrorStatuses, isSuccess: isSuccessStatuses, error: errorStatuses } = useGetStatusesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const { data: clients, isLoading: isLoadingClients, isError: isErrorClients, isSuccess: isSuccessClients, error: errorClients } = useGetClientsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const { data: users, isLoading: isLoadingUsers, isError: isErrorUsers, isSuccess: isSuccessUsers, error: errorUsers } = useGetUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const [updateJob, { isLoading: isLoadingJobUpdate, isError: isErrorJobUpdate, isSuccess: isSuccessJobUpdate, error: errorJobUpdate }] = useUpdateJobByIdMutation();

  let content;

  const yupSchema = Yup.object().shape({
    jobNo: Yup.string().required('Job No is required!'),
    address: Yup.object().shape({
      streetAddress1: Yup.string().required('Street Address1 is required'),
      streetAddress2: Yup.string().optional(),
      city: Yup.string().required('city is required'),
      postcode: Yup.string().required('postcode is required'),
      state: Yup.string().required('state is required'),
      country: Yup.string().required('country is required'),
    }),
    client: Yup.object().shape({
      _id: Yup.string().required('Client ID is required'),
      name: Yup.string().optional(),
      isActive: Yup.string().optional(),
      xeroId: Yup.string().optional(),
      teamsId: Yup.string().optional(),
    }),
    contact: Yup.object().shape({
      name: Yup.string().required('Contact Name is required'),
      email: Yup.string().required('Contact Email is required'),
      phone: Yup.string().required('Contact Phone is required'),
    }),
    description: Yup.string().required('Description is required'),
    dateSubmitted: Yup.string().required('Date Submitted is required'),
    followUpDate: Yup.string().required('Follow Up Date is required'),
    reqDateOfQuote: Yup.string().required('Req Date Of Quote is required'),
    doAndCharge: Yup.boolean().required('Do And Charge is required'),
    estimator: Yup.string().required('Estimator is required'),
    fileReference: Yup.string(),
    jobStatus: Yup.string().required('Job Status is required'),
    quoteStatus: Yup.string().required('Quote Status is required'),
    xeroReference: Yup.string(),
  })



  const formik = useFormik({
    initialValues: {
      jobNo: job?.jobNo ? job.jobNo : '',
      address: {
        streetAddress1: job?.address?.streetAddress1 ? job.address.streetAddress1 : '',
        streetAddress2: job?.address?.streetAddress2 ? job.address.streetAddress2 : '',
        city: job?.address?.city ? job.address.city : '',
        postcode: job?.address?.postcode ? job.address.postcode : '',
        state: job?.address?.state ? job.address.state : '',
        country: job?.address?.country ? job.address.country : '',
      },
      client: {
        _id: job?.client?._id ? job.client._id : '',
        name: job?.client?.name ? job.client.name : '',
        isActive: job?.client?.isActive ? job.client.isActive : '',
        xeroId: job?.client?.xeroId ? job.client.xeroId : '',
        teamsId: job?.client?.teamsId ? job.client.teamsId : '',
      },
      contact: {
        email: job?.contact?.email ? job.contact.email : '',
        name: job?.contact?.name ? job.contact.name : '',
        phone: job?.contact?.phone ? job.contact.phone : '',
      },
      description: job?.description ? job.description : '',
      dateSubmitted: job?.dateSubmitted ? new Date(job.dateSubmitted) : '',
      followUpDate: job?.followUpDate ? new Date(job.followUpDate) : '',
      reqDateOfQuote: job?.reqDateOfQuote ? new Date(job.reqDateOfQuote) : '',
      doAndCharge: job?.doAndCharge ? job.doAndCharge : false,
      estimator: job?.estimator ? job.estimator : '',
      fileReference: job?.fileReference ? job.fileReference : '',
      jobStatus: job?.jobStatus?._id ? job.jobStatus._id : '',
      quoteStatus: job?.quoteStatus?._id ? job.quoteStatus._id : '',
      xeroReference: job?.xeroReference ? job.xeroReference : '',
      submit: false
    },
    enableReinitialize: true,
    validationSchema: yupSchema,
    onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      try {
        console.log('values', values);
        dayjs.extend(timezone)
        dayjs.tz.setDefault('Australia/Brisbane');
        // let dateSubmitted = new Date(values.dateSubmitted);
        // let reqDateOfQuote = new Date(values.reqDateOfQuote);
        // let followUpDate = new Date(values.followUpDate);


        // console.log('dateSubmitted', values.dateSubmitted);
        // console.log('reqDateOfQuote', values.reqDateOfQuote);
        // console.log('followUpDate', values.followUpDate);

        if (jobId) {
          updateJob({
            jobId: jobId && jobId,
            update: {
              jobNo: values.jobNo,
              dateSubmitted: String(values.dateSubmitted),
              client: values.client._id,
              contact: {
                name: values.contact.name,
                email: values.contact.email,
                phone: values.contact.phone
              },
              address: {
                streetAddress1: values.address.streetAddress1,
                streetAddress2: values.address.streetAddress2,
                city: values.address.city,
                postcode: values.address.postcode,
                state: values.address.state,
                country: values.address.country,
              },
              description: values.description,
              doAndCharge: values.doAndCharge,
              jobStatus: values.jobStatus,
              quoteStatus: values.quoteStatus,
              reqDateOfQuote: String(values.reqDateOfQuote),
              followUpDate: String(values.followUpDate),
              estimator: values.estimator,
              fileReference: values.fileReference,
              xeroReference: values.xeroReference
            }
          })
        } else {
          console.log('job ID not found');
        }

      } catch (error: any) {
        console.log('error', error);
        const message = error.response ? error.response.data.message : error.error ? error.error : error ? JSON.stringify(error, null, 2) : 'Something went wrong'

        setStatus({ success: false });
        setErrors({ submit: message });
        setSubmitting(false);
      }
    }
  })

  if (isSuccessJobUpdate) {
    navigate(`/jobs/${jobId}`)
  }

  if (isLoadingJob || isLoadingStatuses || isLoadingClients || isLoadingUsers) {
    content = (
      <React.Fragment>
        <Helmet title="Job loading" />
        <Container fluid className="p-0">
          <Row>
            <Col>
              <Card>
                <Row className="mb-2 mb-xl-3">
                  <Col xs="auto" className="d-none d-sm-block">
                    <Card.Header>
                      <Card.Title>Edit Job</Card.Title>

                    </Card.Header>
                  </Col>
                  <Col xs="auto" className="ms-auto text-end">
                    <Card.Header>
                      <Button variant="secondary" className="shadow-sm" onClick={() => navigate(`/jobs/${jobId}`)}><ArrowLeft size={18} /></Button>
                    </Card.Header>
                  </Col>
                </Row>
                <Card.Body>
                  <Loader />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  } else if (isSuccessJob && isSuccessStatuses && isSuccessClients && isSuccessUsers) {

    let jobStatusOptions: { label: string; value: string; }[] = []
    let quoteStatusOptions: { label: string; value: string; }[] = []

    statuses && statuses.filter(status => status.type === 'Job').map(stat => {
      jobStatusOptions.push({ label: stat.status, value: stat._id })
    });

    statuses && statuses.filter(status => status.type === 'Quote').map(stat => {
      quoteStatusOptions.push({ label: stat.status, value: stat._id })
    });

    let clientOptions: { label: string; value: string; }[] = []

    clients && clients.map(client => {
      clientOptions.push({ label: client.name, value: client._id })
    })

    let userOptions: { label: string; value: string; }[] = []
    let estimatorOptions: { label: string; value: string; }[] = [
      { value: 'Contractor', label: 'Contractor' },
    ]

    // @ts-ignore
    users && users.map(user => {
      userOptions.push({ label: user.firstName + ' ' + user.lastName, value: user._id })
      estimatorOptions.push({ label: user.firstName + ' ' + user.lastName, value: user.firstName + ' ' + user.lastName })
    })

    let stateOptions: { label: string; value: string; }[] = [
      { value: 'Queensland', label: 'Queensland' },
      { value: 'New South Wales', label: 'New South Wales' },
      { value: 'Victoria', label: 'Victoria' },
      { value: 'Australian Capital Territory', label: 'Australian Capital Territory' },
      { value: 'Northern Territory', label: 'Northern Territory' },
      { value: 'Tasmania', label: 'Tasmania' },
      { value: 'Western Australia', label: 'Western Australia' },
      { value: 'Other', label: 'Other' },
    ]

    let countryOptions: { label: string; value: string; }[] = [
      { value: 'Australia', label: 'Australia' },
      { value: 'Other', label: 'Other' },

    ]



    content = (
      <React.Fragment>
        <Helmet title={`#${job?.jobNo} - ${job?.description}`} />
        <Container fluid className="p-0">
          {/* <h1 className="h3 mb-2">Job: {job?.jobNo}</h1> */}
          <Card>
            <Row className="mb-2 mb-xl-3">
              <Col xs="auto" className="d-none d-sm-block">
                <Card.Header>
                  <Card.Title>Edit Job</Card.Title>
                </Card.Header>
              </Col>
              <Col xs="auto" className="ms-auto text-end">
                <Card.Header>
                  <Button variant="secondary" className="shadow-sm" onClick={() => navigate(`/jobs/${jobId}`)}><ArrowLeft size={18} /></Button>
                </Card.Header>
              </Col>
            </Row>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                {formik.errors.submit && (
                  <Alert className="my-3" variant="danger">
                    <div className="alert-message">{formik.errors.submit}</div>
                  </Alert>
                )}

                {isErrorJobUpdate ? (
                  <ErrorAlert title="Error Updating" error={JSON.stringify(errorJobUpdate, null, 2)} />
                ) : null}

                {isLoadingJob ? (
                  <Loader />
                ) : isErrorJob ? (
                  <ErrorAlert title="Error loading job..." error={JSON.stringify(errorJob, null, 2)} />
                ) : (
                  <>
                    <Row>
                      <Col md={8}>
                        <Card>
                          <Row className="mb-3">
                            <Card.Header>
                              <Card.Title>Job Details</Card.Title>
                            </Card.Header>
                            <Card.Body>
                              <Col>
                                <Row>
                                  <Form.Group className="mb-3" as={Col} md={4}>
                                    <Form.Label>Job No</Form.Label>
                                    <Form.Control
                                      size="lg"
                                      type="text"
                                      name="jobNo"
                                      placeholder="Enter your jobNo"
                                      value={formik.values.jobNo}
                                      isInvalid={Boolean(formik.touched.jobNo && formik.errors.jobNo)}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      disabled
                                    />
                                    {!!formik.touched.jobNo && (
                                      <Form.Control.Feedback type="invalid">
                                        {formik.errors.jobNo}
                                      </Form.Control.Feedback>
                                    )}
                                  </Form.Group>
                                  <Form.Group className="mb-3" as={Col} md={4}>
                                    <Form.Label>Estimator</Form.Label>
                                    <CustomSelect
                                      className='react-select-container'
                                      //@ts-ignore
                                      onChange={value => formik.setFieldValue('estimator', value.value)}
                                      value={formik.values.estimator}
                                      options={estimatorOptions}
                                    />
                                    {
                                      !!formik.touched.estimator && (
                                        <div style={{
                                          display: 'block',
                                          width: '100%',
                                          marginTop: '0.25rem',
                                          fontSize: '80%',
                                          color: '#d9534f'
                                        }}>
                                          {formik.errors.estimator}
                                        </div>
                                      )
                                    }
                                  </Form.Group>
                                  <Form.Group className="mb-3" as={Col} md={4}>
                                    <Form.Label>Do & Charge?</Form.Label>
                                    <Form.Check
                                      type="switch"
                                      id="doAndChargeSwitch"
                                      name="doAndCharge"
                                      label={String(formik.values.doAndCharge)}
                                      // value={String(formik.values.doAndCharge)}
                                      checked={formik.values.doAndCharge}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      isInvalid={Boolean(formik.touched.doAndCharge && formik.errors.doAndCharge)}
                                    />
                                    {
                                      !!formik.touched.doAndCharge && (
                                        <Form.Control.Feedback type="invalid">
                                          {formik.errors.doAndCharge}
                                        </Form.Control.Feedback>
                                      )
                                    }
                                  </Form.Group>
                                </Row>
                              </Col>
                              <Col>
                                <Row>
                                  <Form.Group className="mb-3" as={Col} md={6}>
                                    <Form.Label>Job Status</Form.Label>
                                    <CustomSelect
                                      className='react-select-container'
                                      //@ts-ignore
                                      onChange={value => formik.setFieldValue('jobStatus', value.value)}
                                      value={formik.values.jobStatus}
                                      options={jobStatusOptions}
                                    />
                                    {
                                      !!formik.touched.jobStatus && (
                                        <div style={{
                                          display: 'block',
                                          width: '100%',
                                          marginTop: '0.25rem',
                                          fontSize: '80%',
                                          color: '#d9534f'
                                        }}>
                                          {formik.errors.jobStatus}
                                        </div>
                                      )
                                    }
                                  </Form.Group>
                                  <Form.Group className="mb-3" as={Col} md={6}>
                                    <Form.Label>Quote Status</Form.Label>
                                    <CustomSelect
                                      className='react-select-container'
                                      //@ts-ignore
                                      onChange={value => formik.setFieldValue('quoteStatus', value.value)}
                                      value={formik.values.quoteStatus}
                                      options={quoteStatusOptions}
                                    />
                                    {
                                      !!formik.touched.quoteStatus && (
                                        <div style={{
                                          display: 'block',
                                          width: '100%',
                                          marginTop: '0.25rem',
                                          fontSize: '80%',
                                          color: '#d9534f'
                                        }}>
                                          {formik.errors.quoteStatus}
                                        </div>
                                      )
                                    }
                                  </Form.Group>
                                </Row>
                              </Col>
                              <Row>
                                <Form.Group className="mb-3" as={Col} md={4}>
                                  <Form.Label>Date Submitted</Form.Label>
                                  {/* {console.log('dateSubmitted', formik.values.dateSubmitted)}
                                  {console.log('dateSubmitted Date', new Date(formik.values.dateSubmitted))} */}
                                  <Datetime dateFormat="DD/MM/YYYY" timeFormat={false} onChange={value => formik.setFieldValue('dateSubmitted', value)} value={formik.values.dateSubmitted} />
                                  { /* @ts-ignore */}
                                  {/* <DatePicker format='d/M/yyyy' className="form-control" name="dateSubmitted" onChange={value => formik.setFieldValue('dateSubmitted', value)} value={formik.values.dateSubmitted} /> */}
                                  {/* @ts-ignore */}
                                  {/* <InputMask mask="99/99/9999" value={formik.values.dateSubmitted} size="lg" name="dateSubmitted" disabled readOnly>
                                    {(inputProps: any) => (
                                      <Form.Control {...inputProps} type="text" />
                                    )}
                                  </InputMask> */}
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} md={4}>
                                  <Form.Label>Req Date of Quote</Form.Label>
                                  { /* @ts-ignore */}
                                  <Datetime dateFormat="DD/MM/YYYY" timeFormat={false} onChange={value => formik.setFieldValue('reqDateOfQuote', value)} value={formik.values.reqDateOfQuote} />
                                  {/* <DatePicker format='d/M/yyyy' className="form-control" name="reqDateOfQuote" onChange={value => formik.setFieldValue('reqDateOfQuote', value)} value={formik.values.reqDateOfQuote} /> */}
                                  {/* @ts-ignore */}
                                  {/* <InputMask mask="99/99/9999" size="lg" name="reqDateOfQuote" value={formik.values.reqDateOfQuote} onChange={value => formik.setFieldValue('reqDateOfQuote', value.value)}  >
                                    {(inputProps: any) => (
                                      <Form.Control {...inputProps} type="text" />
                                    )}
                                  </InputMask> */}
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} md={4}>
                                  <Form.Label>Follow Up Date</Form.Label>
                                  <Datetime dateFormat="DD/MM/YYYY" timeFormat={false} onChange={value => formik.setFieldValue('followUpDate', value)} value={formik.values.followUpDate} />
                                  {/* @ts-ignore */}
                                  {/* <InputMask mask="99/99/9999" size="lg" name="followUpDate" value={formik.values.followUpDate} onChange={value => formik.setFieldValue('followUpDate', value.value)}  >
                                    {(inputProps: any) => (
                                      <Form.Control {...inputProps} type="text" />
                                    )}
                                  </InputMask> */}
                                </Form.Group>
                              </Row>
                              <hr />
                              <Row>
                                <Form.Group className="mb-3" as={Col} md={6}>
                                  <Form.Label>Street Address 1</Form.Label>
                                  <Form.Control
                                    size="lg"
                                    type="text"
                                    name="address.streetAddress1"
                                    placeholder="123 Main Street"
                                    value={formik.values.address.streetAddress1}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={Boolean(formik.touched.address?.streetAddress1 && formik.errors.address?.streetAddress1)}
                                  />
                                  {!!formik.touched.address?.streetAddress1 && (
                                    <Form.Control.Feedback type="invalid">
                                      {formik.errors.address?.streetAddress1}
                                    </Form.Control.Feedback>
                                  )}
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} md={6}>
                                  <Form.Label>Street Address 2</Form.Label>
                                  <Form.Control
                                    size="lg"
                                    type="text"
                                    name="address.streetAddress2"
                                    placeholder=""
                                    value={formik.values.address.streetAddress2}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={Boolean(formik.touched.address?.streetAddress2 && formik.errors.address?.streetAddress2)}
                                  />
                                  {!!formik.touched.address?.streetAddress2 && (
                                    <Form.Control.Feedback type="invalid">
                                      {formik.errors.address?.streetAddress2}
                                    </Form.Control.Feedback>
                                  )}
                                </Form.Group>
                              </Row>
                              <Row>
                                <Form.Group className="mb-3" as={Col} md={4}>
                                  <Form.Label>City</Form.Label>
                                  <Form.Control
                                    size="lg"
                                    type="text"
                                    name="address.city"
                                    placeholder="123 Main Street"
                                    value={formik.values.address.city}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={Boolean(formik.touched.address?.city && formik.errors.address?.city)}
                                  />
                                  {!!formik.touched.address?.city && (
                                    <Form.Control.Feedback type="invalid">
                                      {formik.errors.address?.city}
                                    </Form.Control.Feedback>
                                  )}
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} md={4}>
                                  <Form.Label>Post Code</Form.Label>
                                  <Form.Control
                                    size="lg"
                                    type="text"
                                    name="address.postcode"
                                    placeholder="4000"
                                    value={formik.values.address.postcode}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={Boolean(formik.touched.address?.postcode && formik.errors.address?.postcode)}
                                  />
                                  {!!formik.touched.address?.postcode && (
                                    <Form.Control.Feedback type="invalid">
                                      {formik.errors.address?.postcode}
                                    </Form.Control.Feedback>
                                  )}
                                </Form.Group>
                              </Row>
                              <Row>
                                <Form.Group className="mb-3" as={Col} md={4}>
                                  <Form.Label>State</Form.Label>
                                  <CustomSelect
                                    className='react-select-container'
                                    //@ts-ignore
                                    onChange={value => formik.setFieldValue('address.state', value.value)}
                                    value={formik.values.address.state}
                                    options={stateOptions.sort((a, b) => a.value.localeCompare(b.value))}
                                  />
                                  {
                                    !!formik.touched.address?.state && (
                                      <div style={{
                                        display: 'block',
                                        width: '100%',
                                        marginTop: '0.25rem',
                                        fontSize: '80%',
                                        color: '#d9534f'
                                      }}>
                                        {formik.errors.address?.state}
                                      </div>
                                    )
                                  }
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} md={4}>
                                  <Form.Label>Country</Form.Label>
                                  <CustomSelect
                                    className='react-select-container'
                                    //@ts-ignore
                                    onChange={value => formik.setFieldValue('address.country', value.value)}
                                    value={formik.values.address.country}
                                    options={countryOptions}
                                  />
                                  {
                                    !!formik.touched.address?.country && (
                                      <div style={{
                                        display: 'block',
                                        width: '100%',
                                        marginTop: '0.25rem',
                                        fontSize: '80%',
                                        color: '#d9534f'
                                      }}>
                                        {formik.errors.address?.country}
                                      </div>
                                    )
                                  }
                                </Form.Group>
                              </Row>
                              <hr />
                              <Row>
                                <Form.Group>
                                  <Form.Label>Description</Form.Label>
                                  <Form.Control
                                    size="lg"
                                    as="textarea"
                                    type="description"
                                    name="description"
                                    placeholder="Enter job description"
                                    value={formik.values.description}
                                    isInvalid={Boolean(formik.touched.description && formik.errors.description)}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                  />
                                  {!!formik.touched.description && (
                                    <Form.Control.Feedback type="invalid">
                                      {formik.errors.description}
                                    </Form.Control.Feedback>
                                  )}
                                </Form.Group>
                              </Row>
                            </Card.Body>
                          </Row>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card>
                          <Card.Header>
                            <Card.Title>Client Details</Card.Title>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Form.Group className="mb-3" as={Col} md={8}>
                                <Form.Label>Client</Form.Label>
                                <CustomSelect
                                  className='react-select-container'
                                  //@ts-ignore
                                  onChange={value => formik.setFieldValue('client._id', value.value)}
                                  value={formik.values.client._id}
                                  options={clientOptions.sort((a, b) => a.label.localeCompare(b.label))}
                                />
                                {
                                  !!formik.touched.client?._id && (
                                    <div style={{
                                      display: 'block',
                                      width: '100%',
                                      marginTop: '0.25rem',
                                      fontSize: '80%',
                                      color: '#d9534f'
                                    }}>
                                      {formik.errors.client?._id}
                                    </div>
                                  )
                                }
                              </Form.Group>
                              <Form.Group className="mb-3" as={Col} md={2}>
                                <Form.Label>Link</Form.Label>
                                <Link style={{ textDecoration: 'none' }} to={`/clients/${formik.values.client._id}`} target="_blank" rel="noopener noreferrer">
                                  <Button className="form-control" size="lg" variant="info">
                                    <Target size={18} />
                                  </Button>
                                </Link>
                              </Form.Group>
                            </Row>
                          </Card.Body>
                        </Card>
                        <Card>
                          <Card.Header>
                            <Card.Title>Contact Details</Card.Title>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Form.Group className="mb-3" as={Col} md={12}>
                                <Form.Label>Contact Name</Form.Label>
                                <Form.Control
                                  size="lg"
                                  type="text"
                                  name="contact.name"
                                  placeholder="Enter Contact Name"
                                  value={formik.values.contact.name}
                                  isInvalid={Boolean(formik.touched.contact?.name && formik.errors.contact?.name)}
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                />
                                {!!formik.touched.contact?.name && (
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors.contact?.name}
                                  </Form.Control.Feedback>
                                )}
                              </Form.Group>
                            </Row>
                            <Row>
                              <Form.Group className="mb-3" as={Col} md={12}>
                                <Form.Label>Contact Email</Form.Label>
                                <Form.Control
                                  size="lg"
                                  type="email"
                                  name="contact.email"
                                  placeholder="Enter Contact Email"
                                  value={formik.values.contact.email}
                                  isInvalid={Boolean(formik.touched.contact?.email && formik.errors.contact?.email)}
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                />
                                {!!formik.touched.contact?.email && (
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors.contact?.email}
                                  </Form.Control.Feedback>
                                )}
                              </Form.Group>
                            </Row>
                            <Row>
                              <Form.Group className="mb-3" as={Col} md={12}>
                                <Form.Label>Contact Phone</Form.Label>
                                <Form.Control
                                  size="lg"
                                  type="text"
                                  name="contact.phone"
                                  placeholder="Enter Contact Phone"
                                  value={formik.values.contact.phone}
                                  isInvalid={Boolean(formik.touched.contact?.phone && formik.errors.contact?.phone)}
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                />
                                {!!formik.touched.contact?.phone && (
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors.contact?.phone}
                                  </Form.Control.Feedback>
                                )}
                              </Form.Group>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </>
                )}
                {isLoadingJobUpdate ? (
                  <Loader />
                ) : (
                  <div className="mt-3 text-center">
                    <Button
                      className="me-1 mb-1"
                      type="submit"
                      variant="outline-danger"
                      size="lg"
                      disabled={formik.isSubmitting}
                      onClick={() => navigate(`/jobs/${jobId}`)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="me-1 mb-1"
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={formik.isSubmitting}
                    >
                      Save
                    </Button>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </React.Fragment >
    )
  } else if (isErrorJob || isErrorStatuses || isErrorClients || isErrorUsers || isErrorJobUpdate) {
    content = (
      <React.Fragment>
        <Container fluid className="p-0">
          <Row>
            <Col>
              <Card>
                <Row className="mb-2 mb-xl-3">
                  <Col xs="auto" className="d-none d-sm-block">
                    <Card.Header>
                      <Card.Title>Edit Job</Card.Title>

                    </Card.Header>
                  </Col>
                  <Col xs="auto" className="ms-auto text-end">
                    <Card.Header>
                      <Button variant="secondary" className="shadow-sm" onClick={() => navigate(`/jobs/${jobId}`)}><ArrowLeft size={18} /></Button>
                    </Card.Header>
                  </Col>
                </Row>
                <Card.Body>
                  {isErrorJob ? (
                    <ErrorAlert title="Error Loading Job..." error={JSON.stringify(errorJob, null, 2)} />
                  ) : isErrorStatuses ? (
                    <ErrorAlert title="Error Loading Statuses..." error={JSON.stringify(errorStatuses, null, 2)} />
                  ) : isErrorClients ? (
                    <ErrorAlert title="Error Loading Clients..." error={JSON.stringify(errorClients, null, 2)} />
                  ) : isErrorUsers ? (
                    <ErrorAlert title="Error Loading Users..." error={JSON.stringify(errorUsers, null, 2)} />
                  ) : isErrorJobUpdate ? (
                    <ErrorAlert title="Error Updating Job!" error={JSON.stringify(errorJobUpdate, null, 2)} />
                  ) : ''}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    )
  } else {
    content = (
      <React.Fragment>
        <Card className="flex-fill w-100">
          <Card.Header>
            <Card.Title className="mb-0">Job Edit...</Card.Title>
          </Card.Header>
          <Loader />
        </Card >
      </React.Fragment>
    )
  }

  return content;
}

export default JobEdit;
