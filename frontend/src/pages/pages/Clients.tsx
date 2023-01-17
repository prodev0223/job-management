import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

import { Alert, Badge, Button, Card, Col, Container, Row, Table } from "react-bootstrap";

import useAppDispatch from "../../hooks/useAppDispatch";
import { selectedClient, useDeleteClientByIdMutation, useGetClientByIdQuery, useGetClientsQuery } from "../../redux/slices/clientsSlice";
import useAppSelector from "../../hooks/useAppSelector";
import { Client } from "../../types/clients";
import PaginationTable from "../../components/PaginationTable";
import { Job } from "../../types/jobs";
import dayjs from "dayjs";
import { useGetJobsQuery } from "../../redux/slices/jobsSlice";
import LoadingAlert from "../../components/LoadingAlert";
import ErrorAlert from "../../components/ErrorAlert";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Edit2, Eye, Target, Trash2 } from "react-feather";
import { SelectColumnFilter } from "../../components/FilterTypes";

const Clients = () => {


  const navigate = useNavigate();

  let dummy;
  const { data: clients, isLoading: isLoadingClients, isSuccess: isSuccessClients, isError: isErrorClients, error: errorClients, refetch: refetchClients } = useGetClientsQuery(dummy, {
    refetchOnMountOrArgChange: true
  });

  let content;

  const [deleteClient, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete, error: errorDelete }] = useDeleteClientByIdMutation();


  let tableColumns = [
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Status',
      accessor: 'isActive',
      // Filter: SelectColumnFilter,
      // filter: "includes",
      // @ts-ignore
      Cell: ({ cell: { value } }) => value === true ? <Badge bg="success">Active</Badge> : <Badge bg="danger">Inactive</Badge>
    },
    {
      Header: 'Xero File',
      accessor: 'xeroId',
      // @ts-ignore
      Cell: ({ cell: { value } }) => <a href={`https://go.xero.com/Contacts/View/${value}`} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}><Button size="sm" variant="info"><Target size={18} /></Button></a>
    },
    {
      Header: 'Actions',
      accessor: '_id',
      //@ts-ignore
      Cell: ({ cell: { value } }) => {
        return (
          isLoadingDelete ? <LoadingAlert title="Is Loading..." /> : (
            <Row>
              <Col className="mb-1">
                <Button size="sm" onClick={() => navigate(`/clients/${value}`)}><Eye size={18} /></Button>
              </Col>
              {/* <Col className="mb-1">
                <Button size="sm" variant="warning" onClick={() => navigate(`/clients/${value}/edit`)}><Edit2 size={18} /></Button>
              </Col> */}
              <Col className="mb-1">
                <Button size="sm" variant="danger" onClick={() => deleteClient(value)}><Trash2 size={18} /></Button>
              </Col>
            </Row>
          )
        )
      }
    }

  ]

  if (isLoadingClients) {
    content = (
      <>
        <LoadingAlert title={isLoadingClients ? 'Loading Clients...' : 'Loading...'} />
      </>
    )
  } else if (isSuccessClients) {
    if (isSuccessDelete) {
      refetchClients()
      content = (
        <React.Fragment>
          <Helmet title="Clients" />
          <Container fluid className="p-0">
            <h1 className="h3 mb-3">Clients</h1>
            <Row>
              <Col xl="12">
                <Alert variant="success">Deleted Client Successfully!</Alert>
              </Col>
            </Row>
            <Row>
              <Col xl="12">
                <PaginationTable columns={tableColumns} data={clients ? clients : []} usePageSize={20} />
              </Col>

            </Row>
          </Container>
        </React.Fragment>
      )
    } else if (isErrorDelete) {
      content = (
        <React.Fragment>
          <Helmet title="Clients" />
          <Container fluid className="p-0">
            <h1 className="h3 mb-3">Clients</h1>
            <Row>
              <Col xl="12">
                <ErrorAlert title="Error Deleting Client!" error={JSON.stringify(errorDelete)} />
              </Col>
            </Row>
            <Row>
              <Col xl="12">
                <PaginationTable columns={tableColumns} data={clients ? clients : []} usePageSize={20} />
              </Col>

            </Row>
          </Container>
        </React.Fragment>
      )
    } else {
      content = (
        <React.Fragment>
          <Helmet title="Clients" />
          <Container fluid className="p-0">
            <h1 className="h3 mb-3">Clients</h1>

            <Row>
              <Col xl="12">
                <PaginationTable columns={tableColumns} data={clients ? clients : []} usePageSize={20} />
              </Col>

            </Row>
          </Container>
        </React.Fragment>
      )
    }
  } else if (isErrorClients) {
    content = (
      <>
        <ErrorAlert title={errorClients ? 'Error Loading Clients...' : 'Error!'} error={errorClients ? JSON.stringify(errorClients) : 'Unknown Error!'} />
      </>
    )
  } else {
    content = (
      <>
        <LoadingAlert title="Loading..." />
      </>
    )
  }

  return content;
};

export default Clients;
