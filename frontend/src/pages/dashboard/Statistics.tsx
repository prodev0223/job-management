import { useTranslation } from "react-i18next";
import { Badge, Col, Card, Row, Alert } from "react-bootstrap";

import { Clock, Pause, Target } from "react-feather";

import illustration from "../../assets/img/illustrations/customer-support.png";
import useAppSelector from "../../hooks/useAppSelector";
import { selectCurrentUser } from "../../redux/slices/authSlice";
import { useGetJobsQuery } from "../../redux/slices/jobsSlice";
import { useGetTasksQuery } from "../../redux/slices/tasksSlice";
import LoadingAlert from "../../components/LoadingAlert";
import ErrorAlert from "../../components/ErrorAlert";

const Statistics = () => {
  const { t } = useTranslation();
  const user = useAppSelector(selectCurrentUser);

  const { data: jobs, isLoading, isSuccess, isError, error } = useGetJobsQuery();

  const { data: tasks, isLoading: isLoadingTasks, isSuccess: isSuccessTasks, isError: isErrorTasks, error: errorTasks } = useGetTasksQuery();


  // const tasks = useAppSelector(state => state.tasks.tasks);

  let content;

  if (isLoading || isLoadingTasks) {
    content = (
      <>
        <LoadingAlert title="Loading Jobs..." />
      </>
    )
  } else if (isSuccess || isSuccessTasks) {
    content = (
      <Row>
        <Col md="6" xl className="d-flex">
          <Card className="illustration flex-fill">
            <Card.Body className="p-0 d-flex flex-fill">
              <Row className="g-0 w-100">
                <Col xs="6">
                  <div className="illustration-text p-3 m-1">
                    <h4 className="illustration-text">
                      {t("Welcome back")}, {user && user.firstName}!
                    </h4>
                  </div>
                </Col>
                <Col xs={6} className="align-self-end text-end">
                  <img
                    src={illustration}
                    alt="Customer Support"
                    className="img-fluid illustration-img"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md="6" xl className="d-flex">
          <Card className="flex-fill">
            <Card.Body className=" py-4">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <h3 className="mb-2">{jobs && Object.values(jobs).filter(job => job.jobStatus?.status !== 'Completed' || "Closed")?.length}</h3>
                  <p className="mb-2">Active Jobs</p>
                </div>
                <div className="d-inline-block ms-3">
                  <div className="stat">
                    <Clock className="align-middle text-success" />
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md="6" xl className="d-flex">
          <Card className="flex-fill">
            <Card.Body className=" py-4">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <h3 className="mb-2">{jobs && Object.values(jobs).filter(job => job.jobStatus?.status === 'Pending')?.length}</h3>
                  <p className="mb-2">Pending Jobs</p>
                  {/* <div className="mb-0">
                  <Badge bg="" className="badge-soft-danger me-2">
                    -4.25%
                  </Badge>
                  <span className="text-muted">Since last week</span>
                </div> */}
                </div>
                <div className="d-inline-block ms-3">
                  <div className="stat">
                    <Pause className="align-middle text-success" />
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md="6" xl className="d-flex">
          <Card className="flex-fill">
            <Card.Body className=" py-4">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <h3 className="mb-2">{tasks && Object.values(tasks).filter(task => task.status !== 'Completed')?.length}</h3>
                  <p className="mb-2">Total Tasks</p>
                </div>
                <div className="d-inline-block ms-3">
                  <div className="stat">
                    <Target className="align-middle text-success" />
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    )
  } else if (isError || isErrorTasks) {
    content = (
      <>
        <ErrorAlert title={isError ? 'Error Loading Jobs' : 'Error Loading Tasks'} error={error ? JSON.stringify(error) : errorTasks ? JSON.stringify(errorTasks) : ''} />
      </>
    )
  } else {
    content = (
      <>
        <LoadingAlert title="Loading Stats..." />
      </>
    )
  }

  return content;
};

export default Statistics;
