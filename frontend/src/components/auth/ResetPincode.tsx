import React from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import { Alert, Button, Form } from "react-bootstrap";

import useAuth from "../../hooks/useAuth";

function ResetPincode() {
    const navigate = useNavigate();
    // const { resetPassword } = useAuth();

    return (
        <Formik
            initialValues={{
                userId: "",
                submit: false,
            }}
            validationSchema={Yup.object().shape({
                userId: Yup.string()
                    .max(255)
                    .required("userId is required"),
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    // resetPassword(values.email);
                    navigate("/auth/sign-in");
                } catch (error: any) {
                    const message = error.message || "Something went wrong";

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
                        <Form.Label>Employee ID</Form.Label>
                        <Form.Control
                            size="lg"
                            type="userId"
                            name="userId"
                            placeholder="Enter your Employee ID"
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
                    <div className="text-center mt-3">
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={isSubmitting}
                        >
                            Reset pincode
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}

export default ResetPincode;
