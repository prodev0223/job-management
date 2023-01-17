import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, Col, Container, Row } from "react-bootstrap";
import { AlertOctagon } from "react-feather";
import { selectCurrentUser } from "../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MoreInfo = () => {

  const appUri = process.env.REACT_APP_URI as string;
  const user = useSelector(selectCurrentUser)
  const navigate = useNavigate();

  console.log('user', user);

  useEffect(() => {
    if (user && user.roleId.name !== 'Unassigned') {
      // navigate('/')
      window.location.href = appUri
    }

  }, [user])

  return (
    <React.Fragment>
      <Helmet title="More Info Required" />
      <Container fluid className="p-0">
        <h1 className="h3 mb-3 text-danger"><AlertOctagon color="red" /> {" "} More Info Required</h1>


        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title className="mb-0 text-center">Please have an admin assign your role permissions to use the app!</Card.Title>
              </Card.Header>
              {/* <Card.Body>&nbsp;</Card.Body> */}
            </Card>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
};

export default MoreInfo;
