import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card } from "react-bootstrap";

import ResetPassword from "../../components/auth/ResetPassword";
import { useSearchParams } from "react-router-dom";
import ResetPincode from "../../components/auth/ResetPincode";

const ResetPasswordPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [resetPin, setResetPin] = useState(false);

  useEffect(() => {
    if (searchParams) {
      console.log('searchparams', searchParams.get('pincode'));
      if (searchParams.get('pincode') === '1') {
        setResetPin(true);
      }
    }
  }, [resetPin])

  let content;

  if (resetPin) {
    content = (

      <React.Fragment>
        <Helmet title="Reset Password" />
        <div className="text-center mt-4">
          <h1 className="h2">Reset Pincode</h1>
          <p className="lead">Enter your user ID to reset your pincode.</p>
        </div>

        <Card>
          <Card.Body>
            <div className="m-sm-4">
              <ResetPincode />
            </div>
          </Card.Body>
        </Card>
      </React.Fragment>
    )
  } else {
    content = (
      <React.Fragment>
        <Helmet title="Reset Password" />
        <div className="text-center mt-4">
          <h1 className="h2">Reset password</h1>
          <p className="lead">Enter your email to reset your password.</p>
        </div>

        <Card>
          <Card.Body>
            <div className="m-sm-4">
              <ResetPassword />
            </div>
          </Card.Body>
        </Card>
      </React.Fragment>
    )
  }
  return content;
}

export default ResetPasswordPage;
