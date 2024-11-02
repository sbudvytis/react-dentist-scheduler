import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import useUser from "@/hooks/useUser";
import { Button, Input } from "@nextui-org/react";
import useAuth from "@/hooks/useAuth";

interface PasswordFormValues {
  password: string;
}

interface ApiError {
  message?: string;
}

const SetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email"); // Extract email from the URL
  const { userId } = useAuth();
  const { setPasswordApi, requestNewSetupLinkApi } = useUser(true, userId);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const initialValues: PasswordFormValues = {
    password: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Please create your password to continue"),
  });

  const handleSubmit = async (
    values: PasswordFormValues,
    { resetForm }: FormikHelpers<PasswordFormValues>
  ) => {
    if (!token) {
      setErrorMessage("Invalid or missing token.");
      return;
    }

    try {
      await setPasswordApi(token, values.password);
      setSuccessMessage(
        "Password has been set successfully! You can now login."
      );
      setErrorMessage("");
      resetForm();
    } catch (error) {
      const apiError = error as ApiError;
      setErrorMessage(
        apiError.message || "Failed to set password. Please try again."
      );
    }
    resetForm();
  };

  const handleRequestNewSetupLink = async () => {
    if (!email) {
      setErrorMessage("Email not found. Please contact support.");
      return;
    }

    setErrorMessage("");

    try {
      await requestNewSetupLinkApi(email);
      setSuccessMessage(
        "A new setup link has been sent to your email. Please check your inbox."
      );
    } catch (error) {
      const apiError = error as ApiError;
      setErrorMessage(
        apiError.message ||
          "Failed to request a new setup link. Please try again."
      );
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg bg-white rounded-2xl p-6 border-1 border-gray-200">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form className="grid space-y-4">
              <div className="pb-4 flex-col space-y-2">
                <h1 className="text-2xl font-semibold">Set your password</h1>
                <p className="text-gray-500 text-sm">
                  Please set your password to continue
                </p>
              </div>
              <div className="min-h-14">
                <Field
                  as={Input}
                  type="password"
                  name="password"
                  label="Enter your password"
                  isInvalid={touched.password && !!errors.password}
                  errorMessage={errors.password}
                  isRequired
                  radius="lg"
                  size="sm"
                />
              </div>
              <Button
                variant="solid"
                radius="lg"
                type="submit"
                isLoading={isSubmitting}
                className="border-none shadow-gray-100 bg-black hover:bg-indigo-600 text-white h-9"
              >
                Set Password
              </Button>
            </Form>
          )}
        </Formik>

        {successMessage && (
          <div className="pt-6">
            <div className="bg-[#d8f5e1] text-[#095028] text-sm p-4 rounded-2xl text-center">
              <p>{successMessage}</p>
            </div>
          </div>
        )}
        {errorMessage && (
          <div className="pt-6">
            <div className="bg-[#ffe7ef] text-[#f31261] p-4 rounded-2xl text-sm text-center">
              <p>
                {errorMessage}{" "}
                {errorMessage.includes("expired") && (
                  <button
                    onClick={handleRequestNewSetupLink}
                    className="text-[#f31261] hover:underline font-medium"
                  >
                    Request a new setup link
                  </button>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetPassword;
