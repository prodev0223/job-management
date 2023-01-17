import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { Button } from "react-bootstrap";

const AzureAuthError = () => (
  <React.Fragment>
    <Helmet title="422 Error" />
    <div className="text-center">
      <h1 className="display-1 fw-bold">422</h1>
      <p className="h1">We weren't able to log you in via Microsoft 365</p>
      <p className="h2 fw-normal mt-3 mb-4">
        Please contact your administrator to fix!
      </p>
      <Link to="/">
        <Button variant="primary" size="lg">
          Return to website
        </Button>
      </Link>
    </div>
  </React.Fragment>
);

export default AzureAuthError;
