import dayjs from "dayjs";
import React, { useEffect, useMemo } from "react";

import { Badge, Button, Card, Col, Dropdown, Row, Table } from "react-bootstrap";

import { Check, Edit2, ExternalLink, Eye, MoreHorizontal, PlusCircle, X } from "react-feather";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { Status } from '../../types/jobs';
import { Link, useLocation, useNavigate } from "react-router-dom";
import JobStatuses from "../../components/jobs/JobStatuses";
import PaginationTable from "../../components/PaginationTable";
import { Helmet } from "react-helmet-async";
import { useGetJobsQuery, useGetStatusesQuery } from "../../redux/slices/jobsSlice";
import ErrorAlert from "../../components/ErrorAlert";
import LoadingAlert from "../../components/LoadingAlert";
import { dateBetweenFilterFn, DateRangeColumnFilter, SelectColumnFilter } from "../../components/FilterTypes";

const Projects = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const { data: jobs, isLoading, isSuccess, isError, error } = useGetJobsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: statuses, isLoading: isLoadingStatuses, isSuccess: isSuccessStatuses, isError: isErrorStatuses, error: errorStatuses } = useGetStatusesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });



  let tableColumns;

  if (statuses) {
    tableColumns = [
      {
        Header: 'Job No',
        accessor: 'jobNo'
      },
      {
        Header: 'Client Name',
        accessor: 'client.name',
        Filter: SelectColumnFilter,
        filter: "include",
        // Cell: ({ cell: { value}}) => 
      },
      {
        Header: 'Date Submitted',
        accessor: 'dateSubmitted',
        // Filter: DateRangeColumnFilter,
        // filter: dateBetweenFilterFn,
        //@ts-ignore
        Cell: ({ cell: { value } }) => dayjs(value).format('DD/MM/YYYY')
      },
      {
        Header: 'Do and Charge?',
        accessor: 'doAndCharge',
        // Filter: SelectColumnFilter,
        // filter: "include",
        //@ts-ignore
        Cell: ({ cell: { value } }) => value === true ? <Check color="green" /> : <X color="red" />
      },
      {
        Header: 'Job Status',
        accessor: 'jobStatus',
        //@ts-ignore
        Cell: ({ cell: { value } }) => <JobStatuses statusId={value?._id} statuses={Object.values(statuses)} />
      },
      {
        Header: 'Quote Status',
        accessor: 'quoteStatus',
        //@ts-ignore
        Cell: ({ cell: { value } }) => <JobStatuses statusId={value?._id} statuses={Object.values(statuses)} />

      },
      {
        Header: 'Req. Date of Quote',
        accessor: 'reqDateOfQuote',
        //@ts-ignore
        Cell: ({ cell: { value } }) => dayjs(value).format('DD/MM/YYYY')
      },
      {
        Header: 'Follow Up Date',
        accessor: 'followUpDate',
        //@ts-ignore
        Cell: ({ cell: { value } }) => dayjs(value).format('DD/MM/YYYY')
      },
      {
        Header: 'Estimator',
        accessor: 'estimator',
        Filter: SelectColumnFilter,
        filter: "include",
      },
      {
        Header: 'Actions',
        accessor: '_id',

        Cell: ({ cell: { value } }: { cell: { value: string } }) => isLoading ? <LoadingAlert title="Loading..." /> : (
          <Row>
            <Col className="mb-1">
              <Button size="sm" variant="primary" onClick={() => navigate(`/jobs/${value}`)}><Eye size={18} /></Button>
            </Col>
            <Col className="mb-1">
              <Button size="sm" variant="warning" onClick={() => navigate(`/jobs/${value}/edit`)}><Edit2 size={18} /></Button>
            </Col>
          </Row>
        )
      }
    ]
  } else {
    tableColumns = [
      {
        Header: 'Job No',
        accessor: 'jobNo'
      },
      {
        Header: 'Client Name',
        accessor: 'client.name',
        Filter: SelectColumnFilter,
        filter: "include",
        // Cell: ({ cell: { value}}) => 
      },
      {
        Header: 'Date Submitted',
        accessor: 'dateSubmitted',
        // Filter: DateRangeColumnFilter,
        // filter: dateBetweenFilterFn
      },
      {
        Header: 'Do and Charge?',
        accessor: 'doAndCharge',
        //@ts-ignore
        Cell: ({ cell: { value } }) => value === true ? <Check color="green" /> : <X color="red" />
      },
      {
        Header: 'Job Status',
        accessor: 'jobStatus',
        //@ts-ignore
        // Cell: ({ cell: { value } }) => <JobStatuses statusId={value?._id} statuses={Object.values(statuses)} />
      },
      {
        Header: 'Quote Status',
        accessor: 'quoteStatus',
        //@ts-ignore
        // Cell: ({ cell: { value } }) => <JobStatuses statusId={value?._id} statuses={Object.values(statuses)} />

      },
      {
        Header: 'Req. Date of Quote',
        accessor: 'reqDateOfQuote',
        //@ts-ignore
        Cell: ({ cell: { value } }) => dayjs(value).format('DD/MM/YYYY')
      },
      {
        Header: 'Follow Up Date',
        accessor: 'followUpDate',
        //@ts-ignore
        Cell: ({ cell: { value } }) => dayjs(value).format('DD/MM/YYYY')
      },
      {
        Header: 'Estimator',
        accessor: 'estimator',
        Filter: SelectColumnFilter,
        filter: "include"
      },
    ]
  }


  let content;

  if (isLoading || isLoadingStatuses) {
    content = (
      <LoadingAlert title="Loading..." />
    )
  } else if (isSuccess && isSuccessStatuses) {
    content = (
      <React.Fragment>
        <Helmet title="Projects" />
        <Card className="flex-fill w-100">
          <Card.Header>
            <Row>
              <Col>
                <Card.Title className="mb-0">Projects</Card.Title>
              </Col>
              <Col xs="auto" className="ms-auto text-end mt-n1">
                <Button variant="primary" className="shadow-sm" onClick={() => navigate(`/jobs/create`)}>
                  <PlusCircle size={18} /> {" "}
                  New Enquiry
              </Button>
              </Col>
            </Row>
          </Card.Header>
          <PaginationTable columns={statuses ? tableColumns : []} data={jobs ? jobs.filter(job => job.jobStatus?.status !== 'Completed') : []} navigateCommand="/jobs" usePageSize={location.pathname === "/jobs/list" ? 20 : 20} />
        </Card >
      </React.Fragment>
    )
  } else if (isError || isErrorStatuses) {
    content = (
      <ErrorAlert title={isError ? 'Jobs Loading Error!' : 'Status Loading Error!'} error={JSON.stringify(error ? error : errorStatuses)} />
    )
  } else {
    content = (
      <LoadingAlert title="Loading..." />
    )
  }

  return content;
};

export default Projects;
