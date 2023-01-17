import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";

import Header from "./Header";
import TaskTypes from "./TaskTypes";
import Projects from "../pages/Projects";
import Statistics from "./Statistics";
import JobsCurrent from "./JobsCurrent";
import TasksByUser from "../../components/kiosk/TasksByUser";
import TasksByUser2 from "../../components/kiosk/TasksByUser2";

const Dashboard = () => {

  // const dispatch = useAppDispatch();

  // const tasks = useAppSelector(state => state.tasks.tasks);

  // useEffect(() => {
  //console.log('Object.values(tasks).length', Object.values(tasks).length)
  // if (Object.values(tasks).length <= 0) {
  //   TaskActions.getAllTasks().then((tasks) => {
  //     dispatch(receivedTasks(tasks))
  //   })
  // }
  // }, [tasks])

  return (
    <React.Fragment>
      <Helmet title="Dashboard" />
      <Container fluid className="p-0">
        <Header />
        <Statistics />
        <TasksByUser2 />
        <Projects />
        <Row>
          <Col lg="8" className="d-flex">
            <JobsCurrent />
          </Col>
          <Col lg="4" className="d-flex">
            <TaskTypes />
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
};

export default Dashboard;
