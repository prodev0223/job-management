import React from "react";
import { Helmet } from "react-helmet-async";
import { Card } from "react-bootstrap";

import logo from "../../assets/img/brands/CE_Logo_Transparent_H.png";

const SignInPage: React.FC = ({ children }) => (
  <React.Fragment>
    <Helmet title="Sign In" />
    <div className="text-center mt-4">
      <h2>JARVIS Web Interface</h2>
      <p className="lead">Sign in to your account to continue</p>
    </div>

    <Card>
      <Card.Body>
        <div className="m-sm-4">
          <div className="text-center">
            <img
              src={logo}
              alt="Coasteel Engineering"
              className="img-fluid"
              width="350"
              height="300"
            />
          </div>
          {children}
        </div>
      </Card.Body>
    </Card>
  </React.Fragment>
);

export default SignInPage;
