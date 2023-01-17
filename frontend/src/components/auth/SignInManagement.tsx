import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import jwtDecode from 'jwt-decode';
import { Formik, FormikProps } from "formik";
import { Alert, Button, Form } from "react-bootstrap";
import { useLoginMutation } from "../../redux/slices/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import LoadingAlert from "../LoadingAlert";
import MicrosoftLogo from '../../assets/img/brands/microsoft.svg';
import getAzureOAuthURL from "../../utils/getAzureUrl";
import ErrorAlert from "../ErrorAlert";
import { Loader } from "react-feather";

function SignInManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();




  const queryParams = new URLSearchParams(window.location.search)

  const [searchParams, setSearchParams] = useSearchParams();

  console.log('searchParams', searchParams.get("accessToken"))

  console.log('queryParams', queryParams.get('accessToken'));

  const [login, { isLoading }] = useLoginMutation();

  const [microsoftLogin, setMicrosoftLogin] = useState(true);

  const azureURL = getAzureOAuthURL()

  let content;
  let accessToken = searchParams.get('accessToken') || queryParams.get('accessToken')
  let refreshToken = searchParams.get('refreshToken') || queryParams.get('accessToken');

  console.log('accessToken found', accessToken)
  console.log('refreshToken found', refreshToken)




  if (microsoftLogin) {

    let errorFromAzure = queryParams.get("error");

    console.log('errorFromAzure', errorFromAzure);
    if (accessToken && refreshToken) {
      content = (
        <div className="text-center mt-3">
          <Loader />
        </div>
      )
      let user = jwtDecode(accessToken)
      dispatch(setCredentials({ refreshToken: refreshToken, accessToken: accessToken, user }))

      setTimeout(() => {
        for (const [key, value] of searchParams.entries()) {
          console.log(`${key}, ${value}`)
        }
        searchParams.delete('accessToken');
        setSearchParams(searchParams);
        if (searchParams.has('accessToken')) {
        }

        queryParams.delete('accessToken');
        if (queryParams.has('accessToken')) {
        }
        console.log(window.location)
        console.log('location', location)
        navigate('/moreinfo', {
          replace: true
        })
      }, 2000)
    } else if (errorFromAzure) {
      content = (
        <>
          <hr />
          <ErrorAlert title="Issue with login!" error={JSON.stringify(errorFromAzure)} />
          <div className="text-center mt-3">
            <Button
              onClick={() => getAzureOAuthURL()}
              href={azureURL}
              variant="microsoft"
              size="lg"
            >
              <img src={MicrosoftLogo} /> {" "}
              Sign In with Microsoft
            </Button>
            {/* <div className="text-center mt-3">
              <Button
                variant="none"
                size="sm"
                onClick={() => setMicrosoftLogin(false)}
              >
                I Don't Have a Microsoft Login
              </Button>
            </div> */}
            <hr />
            <div className="text-center mt-3">
              <Button
                variant="outline-primary"
                size="lg"
                onClick={() => navigate('/kiosk/login')}
              >
                Production Login
              </Button>
            </div>
          </div>
        </>
      )
    } else {

      content = (
        <>
          <hr />
          <div className="text-center mt-3">
            <Button
              onClick={() => getAzureOAuthURL()}
              href={azureURL}
              variant="microsoft"
              size="lg"
            >
              <img src={MicrosoftLogo} /> {" "}
              Sign In with Microsoft
            </Button>
            {/* <div className="text-center mt-3">
            <Button
            variant="none"
            size="sm"
            onClick={() => setMicrosoftLogin(false)}
            >
            I Don't Have a Microsoft Login
            </Button>
          </div> */}
            <hr />
            <div className="text-center mt-3">
              <Button
                variant="outline-primary"
                size="lg"
                onClick={() => navigate('/kiosk/login')}
              >
                Production Login
              </Button>
            </div>
          </div>
        </>
      )
    }
  } else if (!microsoftLogin) {

    content = (
      <Formik
        initialValues={{
          email: "",
          password: "",
          submit: false,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            // await signIn(values.email, values.password);
            const userData = await login({ email: values.email, password: values.password }).unwrap();
            console.log('userData', userData);
            let user = jwtDecode(userData?.accessToken)
            dispatch(setCredentials({ ...userData, user }))
            navigate('/')
            //navigate("/private");
          } catch (error: any) {
            console.log('error', error);
            const message = error.response ? error.response.data.message : error.data ? error.data : 'Something went wrong...';

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
            {errors.submit && (
              <Alert className="my-3" variant="danger">
                <div className="alert-message">{errors.submit}</div>
              </Alert>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                size="lg"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={values.email}
                isInvalid={Boolean(touched.email && errors.email)}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {!!touched.email && (
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                size="lg"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={values.password}
                isInvalid={Boolean(touched.password && errors.password)}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {!!touched.password && (
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              )}
              <small>
                <a href="mailto:info@coasteelengineering.com.au">Reset Password?</a>
              </small>
            </Form.Group>


            {isLoading ? (
              <LoadingAlert title="Signing In..." />
            ) : (
              <>
                <div className="text-center mt-3">
                  <Button
                    variant="outline-danger"
                    className="me-1 mb-1"
                    size="lg"
                    onClick={() => setMicrosoftLogin(true)}
                  >
                    {/* <img src={MicrosoftLogo} /> {" "} */}
                    Go Back
                  </Button>
                  <Button
                    type="submit"
                    className="me-1 mb-1"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    Sign in
                  </Button>
                </div>
              </>
            )}
          </Form>
        )
        }
      </Formik >
    )
  } else {
    content = (
      <div className="text-center mt-3">
        <Button
          variant="outline-primary"
          size="lg"
          onClick={() => navigate('/kiosk/login')}
        >
          Production Login
        </Button>
      </div>
    )
  }

  return content

}



export default SignInManagement;
