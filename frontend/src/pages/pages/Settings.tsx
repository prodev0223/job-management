import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Card,
  Col,
  Container,
  Nav,
  Row,
  Tab,
} from "react-bootstrap";

import ResetPassword from "../../components/auth/ResetPassword";
import UserInfo from "../../components/user/UserInfo";
import { selectCurrentUser } from "../../redux/slices/authSlice";
import useAppSelector from "../../hooks/useAppSelector";
import UsersList from "../../components/user/UsersList";

const Settings = () => {

  let content;

  content = (
    <React.Fragment>
      <Helmet title="Settings" />
      <Container fluid className="p-0">
        <h1 className="h3 mb-3">Settings</h1>
        <Tab.Container id="left-tabs" defaultActiveKey="users">
          <Row className="mb-0 ml-1">
            <Col sm={3}>
              <Card>
                <Card.Body>
                  <Nav variant="pills" className="flex-column" fill>
                    <Nav.Item>
                      <Nav.Link eventKey="users">
                        User Management
                      </Nav.Link>
                    </Nav.Item>
                    {/* <Nav.Item>
                      <Nav.Link eventKey="roles" href="#roles">
                        Role Management
                      </Nav.Link>
                    </Nav.Item> */}
                    {/* <Nav.Item>
                      <Nav.Link eventKey="account" href="#details">
                        My Account
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="password" href="#password">
                        Password
                      </Nav.Link>
                    </Nav.Item> */}
                  </Nav>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={9}>
              <Card>
                <Card.Body>
                  <Tab.Content>
                    <Tab.Pane eventKey="users">
                      <UsersList />
                    </Tab.Pane>
                    {/* <Tab.Pane eventKey="account">
                      <UserInfo />
                    </Tab.Pane> */}
                    {/* <Tab.Pane eventKey="password">
                      <ResetPassword />
                    </Tab.Pane> */}

                  </Tab.Content>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </React.Fragment>
  )

  return content;
};

export default Settings;
