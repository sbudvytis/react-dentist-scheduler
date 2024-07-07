import useAuth from "@/hooks/useAuth";
import { Formik, Form, Field, FormikHelpers } from "formik";
import useSignupLoginStore from "@/stores/useSignupLoginStore";
import { Link } from "react-router-dom";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import SignupSchema from "@/utils/signupValidation";

interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

interface SignupResponse {
  id: number;
}

const roles = [
  { value: "dentist", name: "Dentist" },
  { value: "staff", name: "Staff" },
];

const initialValues: SignupFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "",
};

const Signup = () => {
  const { signup } = useAuth();
  const {
    errorMessage,
    successMessage,
    hasSucceeded,
    setErrorMessage,
    setSuccessMessage,
    setHasSucceeded,
  } = useSignupLoginStore();

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
      setErrorMessage("");
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
      <div className="sm:mx-auto sm:w-full sm:max-w-lg bg-white rounded-lg p-6 shadow-lg shadow-gray-100 border-1 border-gray-100">
        <Formik
          initialValues={initialValues}
          validationSchema={SignupSchema}
          onSubmit={submitSignup}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form className="grid space-y-4">
              <div className="pb-8 flex-col space-y-2">
                <h1 className="text-3xl font-semibold">New account</h1>
                <p className="text-gray-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-violet-600 hover:text-violet-700"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
              <div className="flex gap-3 min-h-16">
                <div className="w-full">
                  <Field
                    name="firstName"
                    as={Input}
                    type="text"
                    label="First name"
                    isInvalid={touched.firstName && !!errors.firstName}
                    errorMessage={errors.firstName}
                    required
                    isRequired
                    radius="sm"
                  />
                </div>

                <div className="w-full">
                  <Field
                    name="lastName"
                    as={Input}
                    type="text"
                    label="Last name"
                    isInvalid={touched.lastName && !!errors.lastName}
                    errorMessage={errors.lastName}
                    isRequired
                    radius="sm"
                  />
                </div>
              </div>
              <div className="min-h-16">
                <Field
                  name="email"
                  as={Input}
                  type="email"
                  label="Email"
                  isInvalid={touched.email && !!errors.email}
                  errorMessage={errors.email}
                  isRequired
                  radius="sm"
                />
              </div>
              <div className="min-h-16">
                <Field
                  name="password"
                  as={Input}
                  type="password"
                  label="Password"
                  isInvalid={touched.password && !!errors.password}
                  errorMessage={errors.password}
                  isRequired
                  radius="sm"
                />
              </div>
              <div className="min-h-16">
                <Field
                  name="role"
                  as={Select}
                  label="Select your role"
                  isInvalid={touched.role && !!errors.role}
                  errorMessage={errors.role}
                  isRequired
                  radius="sm"
                >
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.name}
                    </SelectItem>
                  ))}
                </Field>
              </div>
              <Button
                variant="bordered"
                radius="sm"
                type="submit"
                disabled={isSubmitting}
                className="border-1 border-gray-200 shadow-md shadow-gray-100"
              >
                Sign up
              </Button>
            </Form>
          )}
        </Formik>
        {hasSucceeded && (
          <div className="pt-6">
            <div className="bg-green-100 text-sm p-4 rounded-2xl text-center">
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="pt-6">
            <div className="bg-red-100 p-4 rounded-2xl text-sm text-center">
              <p>{errorMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
