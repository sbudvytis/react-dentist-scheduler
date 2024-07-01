import useAuth from "@/hooks/useAuth";
import { Formik, Form, Field } from "formik";
import { Input, Button } from "@nextui-org/react";
import { useNavigate, Link } from "react-router-dom";
import useLoginStore from "@/stores/useLoginStore";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

interface LoginFormValues {
  email: string;
  password: string;
}

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

const Login = () => {
  const { login } = useAuth();
  const { errorMessage, setErrorMessage } = useLoginStore();
  const navigate = useNavigate();

  const submitLogin = async (values: LoginFormValues) => {
    try {
      const response = await login(values);
      console.log(response);

      navigate("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "Error during login");
      }
    }
  };

  return (
    <div className="min-h-full flex-1 flex-col justify-center px-6 py-48 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border-1 border-gray-100">
        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={submitLogin}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form className="grid space-y-4">
              <div className="pb-4 flex-col space-y-2">
                <h1 className="text-3xl font-semibold">Sign in</h1>
                <p className="text-gray-500">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-violet-600 hover:text-violet-700"
                  >
                    Sign up
                  </Link>
                </p>
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
                />
              </div>

              <Button variant="bordered" type="submit" disabled={isSubmitting}>
                Sign in
              </Button>
            </Form>
          )}
        </Formik>
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

export default Login;
