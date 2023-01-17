import { Helmet } from "react-helmet-async";
import {
    Alert,
    Button,
    Card,
    Col,
    Container,
    Form,
    ListGroup,
    Nav,
    Row,
    Tab,
    Tabs,
} from "react-bootstrap";
import * as Yup from "yup";
import useAppSelector from "../../hooks/useAppSelector";
import { logout, selectCurrentAccessToken, selectCurrentRefreshToken, selectCurrentUser, setCredentials } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useUpdateUserDetailsMutation } from "../../redux/slices/userApiSlice";
import LoadingAlert from "../LoadingAlert";
import ErrorAlert from "../ErrorAlert";
import { Formik } from "formik";

const UserInfo = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useAppSelector(selectCurrentUser);
    const accessToken = useAppSelector(selectCurrentAccessToken)
    const refreshToken = useAppSelector(selectCurrentRefreshToken)

    const [updateUserDetails, { data: updatedUser, isLoading, isError, isSuccess, error }] = useUpdateUserDetailsMutation();

    if (!user) {
        dispatch(logout())
    }

    // const handleUpdateUserState = () => {

    //     if (updatedUser && isSuccess) {
    //         dispatch(setCredentials({
    //             user: updatedUser, accessToken, refreshToken
    //         }))
    //     }
    // }

    let content;

    if (user && user.azureUser) {
        content = (
            <div>
                <h3>Your account details are bound by Azure!</h3>
            </div>
        )
    } else if (isLoading) {
        content = (
            <LoadingAlert title="Loading Update..." />
        )
    } else if (isError) {
        content = (
            <ErrorAlert title="Error Updating User..." error={JSON.stringify(error ? error : '')} />
        )
    } else if (isSuccess) {

        content = (
            <Formik
                initialValues={{
                    employeeId: updatedUser?.employeeId ? updatedUser?.employeeId : '',
                    firstName: updatedUser?.firstName ? updatedUser?.firstName : '',
                    lastName: updatedUser?.lastName ? updatedUser?.lastName : '',
                    email: updatedUser?.email ? updatedUser?.email : '',
                    submit: false
                }}
                validationSchema={Yup.object().shape({
                    employeeId: Yup.string().max(50).required('Employee ID is required'),
                    firstName: Yup.string().max(50).required('First name is required'),
                    lastName: Yup.string().max(50).required('Last name is required'),
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        // dispatch(updateUserDetails({
                        //     userId: user && user._id,
                        //     employeeId: values.employeeId,
                        //     firstName: values.firstName,
                        //     lastName: values.lastName,
                        //     email: values.email
                        // }))
                        alert('broken!');
                    } catch (error: any) {
                        console.log('error', error);
                        const message = error.response ? error.response.data.message : error.error ? error.error : 'Something went wrong...';

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
                        {/* <Alert>
                            <Button></Button>
                        </Alert> */}
                        <Form.Group className="mb-3">
                            <Form.Label>Employee ID</Form.Label>
                            <Form.Control
                                size="lg"
                                type="employeeId"
                                name="employeeId"
                                placeholder="Enter your Employee ID"
                                value={values.employeeId}
                                isInvalid={Boolean(touched.employeeId && errors.employeeId)}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {!!touched.employeeId && (
                                <Form.Control.Feedback type="invalid">
                                    {errors.employeeId}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        size="lg"
                                        type="firstName"
                                        name="firstName"
                                        placeholder="Enter your First Name"
                                        value={values.firstName}
                                        isInvalid={Boolean(touched.firstName && errors.firstName)}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {!!touched.firstName && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.firstName}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        size="lg"
                                        type="lastName"
                                        name="lastName"
                                        placeholder="Enter your Last Name"
                                        value={values.lastName}
                                        isInvalid={Boolean(touched.lastName && errors.lastName)}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {!!touched.lastName && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.lastName}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                size="lg"
                                type="email"
                                name="email"
                                placeholder="Enter your Email"
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

                            {isLoading ? (
                                <LoadingAlert title="Saving Changes..." />
                            ) : (
                                <div className="text-center mt-3">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        disabled={isSubmitting}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </Form.Group>

                    </Form>
                )
                }
            </Formik >
        )
    } else {
        content = (
            <Formik
                initialValues={{
                    employeeId: user?.employeeId ? user?.employeeId : '',
                    firstName: user?.firstName ? user?.firstName : '',
                    lastName: user?.lastName ? user?.lastName : '',
                    email: user?.email ? user?.email : '',
                    submit: false
                }}
                validationSchema={Yup.object().shape({
                    employeeId: Yup.string().max(50).required('Employee ID is required'),
                    firstName: Yup.string().max(50).required('First name is required'),
                    lastName: Yup.string().max(50).required('Last name is required'),
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        // dispatch(updateUserDetails({
                        //     userId: user && user._id,
                        //     employeeId: values.employeeId,
                        //     firstName: values.firstName,
                        //     lastName: values.lastName,
                        //     email: values.email
                        // }))
                        alert('broken!');
                        //handleUpdateUserState();
                    } catch (error: any) {
                        console.log('error', error);
                        const message = error.response ? error.response.data.message : error.error ? error.error : 'Something went wrong...';

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
                        {/* <Alert>
                            <Button></Button>
                        </Alert> */}
                        <Form.Group className="mb-3">
                            <Form.Label>Employee ID</Form.Label>
                            <Form.Control
                                size="lg"
                                type="employeeId"
                                name="employeeId"
                                placeholder="Enter your Employee ID"
                                value={values.employeeId}
                                isInvalid={Boolean(touched.employeeId && errors.employeeId)}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {!!touched.employeeId && (
                                <Form.Control.Feedback type="invalid">
                                    {errors.employeeId}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        size="lg"
                                        type="firstName"
                                        name="firstName"
                                        placeholder="Enter your First Name"
                                        value={values.firstName}
                                        isInvalid={Boolean(touched.firstName && errors.firstName)}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {!!touched.firstName && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.firstName}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        size="lg"
                                        type="lastName"
                                        name="lastName"
                                        placeholder="Enter your Last Name"
                                        value={values.lastName}
                                        isInvalid={Boolean(touched.lastName && errors.lastName)}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {!!touched.lastName && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.lastName}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                size="lg"
                                type="email"
                                name="email"
                                placeholder="Enter your Email"
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

                            {isLoading ? (
                                <LoadingAlert title="Saving Changes..." />
                            ) : (
                                <div className="text-center mt-3">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        disabled={isSubmitting}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </Form.Group>

                    </Form>
                )
                }
            </Formik >
        )
    }

    return content;
};

export default UserInfo;