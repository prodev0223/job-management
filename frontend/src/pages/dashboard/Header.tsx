import React, { useContext, useState } from "react";

import { Button, Col, Dropdown, Row } from "react-bootstrap";

import { Calendar, Filter, Loader, RefreshCw } from "react-feather";
import LoadingAlert from "../../components/LoadingAlert";
import NotyfContext from "../../contexts/NotyfContext";
import useAppDispatch from "../../hooks/useAppDispatch";
// import { JobActions, TaskActions } from "../../utils/api";

const Header = () => {
  const dispatch = useAppDispatch();
  const notyf = useContext(NotyfContext);

  const [refreshing, setRefreshing] = useState(false);

  const retrieveData = () => {
    setRefreshing(true)
    notyf.open({
      type: 'default',
      message: 'Refreshing Data',
      duration: 2500,
      ripple: true,
      dismissible: true,
      position: {
        x: 'right',
        y: 'bottom'
      }
    })
    setTimeout(() => {
      setRefreshing(false)
    }, 5000)
  }

  return (
    <Row className="mb-2 mb-xl-3">
      <Col xs="auto" className="d-none d-sm-block">
        <h3>Dashboard</h3>
      </Col>

      <Col xs="auto" className="ms-auto text-end mt-n1">
        {refreshing ? (
          <LoadingAlert title="Refreshing Data..." />
        ) : (
          <Button variant="primary" className="shadow-sm" onClick={() => retrieveData()}>
            <RefreshCw className="feather" />
          </Button>
        )
        }
      </Col>
    </Row>
  );
};

export default Header;
