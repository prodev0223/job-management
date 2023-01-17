import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => (
  <footer className="footer">
    <Container fluid>
      <Row className="text-muted">
        <Col xs="6" className="text-start">
          <ul className="list-inline">
            <li className="list-inline-item">
              <span className="text-muted"><a target="_blank" href="mailto: support@lmc2.com.au" style={{ textDecoration: 'none', color: "inherit" }}>Support</a></span>
            </li>
          </ul>
        </Col>
        <Col xs="6" className="text-end">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} -{" "}
            <span className="text-muted">Lucid Multi Cloud Pty Ltd</span>
          </p>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
