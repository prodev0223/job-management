import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import jwtDecode from 'jwt-decode';
import { Formik, FormikProps } from "formik";
import { Alert, Button, Form } from "react-bootstrap";
import { useLoginMutation, useLoginPinMutation } from "../../redux/slices/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import LoadingAlert from "../LoadingAlert";

function SignInProduction() {
  const navigate = useNavigate();
  const dispatch = useDispatch();;

  const userRef = useRef();
  const errorRef = useRef();

  // const [user, setUser] = useState('');
  // const [password, setPassword] = useState('');
  // const [errMsg, setErrMsg] = useState('');

  // const [login, { isLoading }] = useLoginMutation();
  const [loginPin, { isLoading }] = useLoginPinMutation();

  useEffect(() => {
    // if (userRef) {
    //   // userRef?.current.focus();
    // }
  }, [])

  return (
    <Formik
      initialValues={{
        // TODO: Remove init values
        userId: "",
        pinCode: "",
        submit: false,
      }}
      validationSchema={Yup.object().shape({
        // email: Yup.string()
        //   .email("Must be a valid email")
        //   .max(255)
        //   .required("Email is required"),
        userId: Yup.number().required('Employee ID is required'),
        pinCode: Yup.number().required("PinCode is required"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // await signIn(values.email, values.password);
          const userData = await loginPin({ employeeId: Number(values.userId), pinCode: Number(values.pinCode) }).unwrap();
          let user = jwtDecode(userData?.accessToken)
          dispatch(setCredentials({ ...userData, user }))
          navigate('/kiosk')
          //navigate("/private");
        } catch (error: any) {
          console.log('error', error);
          const message = error.response ? error.response.data.message : error.error ? error.error : error.data ? JSON.stringify(error.data) : 'Something went wrong...';

          setStatus({ success: false });
          setErrors({ submit: message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Alert className="my-3" variant="primary">
            {/* <div className="alert-message">
              Use <strong>test@example.com</strong> and{" "}
              <strong>BigPineappleCorn@22</strong> to sign in
            </div> */}
          </Alert>
          {errors.submit && (
            <Alert className="my-3" variant="danger">
              <div className="alert-message">{errors.submit}</div>
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Employee ID</Form.Label>
            <Form.Control
              size="lg"
              type="userId"
              name="userId"
              placeholder="Enter your User ID"
              value={values.userId}
              isInvalid={Boolean(touched.userId && errors.userId)}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {!!touched.userId && (
              <Form.Control.Feedback type="invalid">
                {errors.userId}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Pin Code</Form.Label>
            <Form.Control
              size="lg"
              type="pinCode"
              name="pinCode"
              placeholder="Enter your Pin Code"
              value={values.pinCode}
              isInvalid={Boolean(touched.pinCode && errors.pinCode)}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {!!touched.pinCode && (
              <Form.Control.Feedback type="invalid">
                {errors.pinCode}
              </Form.Control.Feedback>
            )}
            <small>
              <a href="mailto:info@coasteelengineering.com.au">Forgot Your Pin Code or User ID?</a>
            </small>
          </Form.Group>

          {isLoading ? (
            <LoadingAlert title="Signing In..." />
          ) : (
            <div className="text-center mt-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
              >
                Sign in
              </Button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
}

export default SignInProduction;
