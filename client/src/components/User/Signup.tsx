import useAuth from "@/hooks/useAuth";
import { Formik, Form, Field, FormikHelpers } from "formik";
import useSignupLoginStore from "@/stores/useSignupLoginStore";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "@nextui-org/react";
import { SignupSchema } from "@/utils/signupValidation";
import { useEffect } from "react";

interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  clinic: {
    name: string;
    address: string;
    contactNumber: string;
  };
}

interface SignupResponse {
  id: number;
}

const initialValues: SignupFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "admin",
  clinic: {
    name: "",
    address: "",
    contactNumber: "",
  },
};

const Signup = () => {
  const { signup, isLoggedIn } = useAuth();
  const {
    errorMessage,
    successMessage,
    hasSucceeded,
    setErrorMessage,
    setSuccessMessage,
    setHasSucceeded,
    resetMessages,
  } = useSignupLoginStore();

  useEffect(() => {
    return () => {
      // Clear all messages on unmount
      resetMessages();
    };
  }, [resetMessages]);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  const submitSignup = async (
    values: SignupFormValues,
    { resetForm }: FormikHelpers<SignupFormValues>
  ) => {
    try {
      const response: SignupResponse = await signup(values);

      if (response.id === 1) {
        setSuccessMessage(
          "You have successfully signed up! This profile will be used as the admin"
        );
      } else {
        setSuccessMessage(
          "You have successfully signed up! Hang in there while we approve your profile"
        );
      }
      setHasSucceeded(true);
      resetForm();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "Error during signup");
        setHasSucceeded(false);
      }
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg bg-white rounded-2xl p-6 border-1 border-gray-200">
        <Formik
          initialValues={initialValues}
          validationSchema={SignupSchema}
          onSubmit={submitSignup}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form className="grid space-y-4">
              <div className="pb-4 flex-col space-y-2">
                <h1 className="text-2xl font-semibold">New account</h1>
                <p className="text-gray-500 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-black hover:text-indigo-600 font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
              <div className="flex gap-3 min-h-14">
                <div className="w-full">
                  <Field
                    name="firstName"
                    as={Input}
                    type="text"
                    label="first name"
                    isInvalid={touched.firstName && !!errors.firstName}
                    errorMessage={errors.firstName}
                    required
                    isRequired
                    radius="lg"
                    size="sm"
                  />
                </div>

                <div className="w-full">
                  <Field
                    name="lastName"
                    as={Input}
                    type="text"
                    label="last name"
                    isInvalid={touched.lastName && !!errors.lastName}
                    errorMessage={errors.lastName}
                    isRequired
                    radius="lg"
                    size="sm"
                  />
                </div>
              </div>
              <div className="min-h-14">
                <Field
                  name="email"
                  as={Input}
                  type="email"
                  label="name@example.com"
                  isInvalid={touched.email && !!errors.email}
                  errorMessage={errors.email}
                  isRequired
                  radius="lg"
                  size="sm"
                />
              </div>
              <div className="min-h-14">
                <Field
                  name="password"
                  as={Input}
                  type="password"
                  label="password"
                  isInvalid={touched.password && !!errors.password}
                  errorMessage={errors.password}
                  isRequired
                  radius="lg"
                  size="sm"
                />
              </div>
              <div className="min-h-14">
                <Field
                  name="clinic.name"
                  as={Input}
                  type="text"
                  label="Clinic Name"
                  isInvalid={touched.clinic?.name && !!errors.clinic?.name}
                  errorMessage={errors.clinic?.name}
                  isRequired
                  radius="lg"
                  size="sm"
                />
              </div>
              <div className="min-h-14">
                <Field
                  name="clinic.address"
                  as={Input}
                  type="text"
                  label="Clinic Address"
                  isInvalid={
                    touched.clinic?.address && !!errors.clinic?.address
                  }
                  errorMessage={errors.clinic?.address}
                  radius="lg"
                  isRequired
                  size="sm"
                />
              </div>
              <div className="min-h-14">
                <Field
                  name="clinic.contactNumber"
                  as={Input}
                  type="text"
                  label="Clinic Contact Number"
                  isInvalid={
                    touched.clinic?.contactNumber &&
                    !!errors.clinic?.contactNumber
                  }
                  errorMessage={errors.clinic?.contactNumber}
                  radius="lg"
                  isRequired
                  size="sm"
                />
              </div>
              <Button
                variant="solid"
                radius="lg"
                type="submit"
                isLoading={isSubmitting}
                className="bg-black hover:bg-indigo-600 text-white h-9"
              >
                Sign up
              </Button>
            </Form>
          )}
        </Formik>
        {hasSucceeded && (
          <div className="pt-6">
            <div className="bg-[#d8f5e1] text-[#095028] text-sm p-4 rounded-2xl text-center">
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="pt-6">
            <div className="bg-[#ffe7ef] text-[#f31261] p-4 rounded-2xl text-sm text-center">
              <p>{errorMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
