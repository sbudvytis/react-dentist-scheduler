import useAuth from "@/hooks/useAuth";
import { Formik, Form, Field } from "formik";
import { Input, Button } from "@nextui-org/react";
import { useNavigate, Link } from "react-router-dom";
import useSignupLoginStore from "@/stores/useSignupLoginStore";
import * as Yup from "yup";
import { useEffect } from "react";

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
  const { login, isLoggedIn } = useAuth();
  const { errorMessage, setErrorMessage } = useSignupLoginStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

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
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg bg-white rounded-lg p-6 border-1 border-gray-200">
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
                    className="text-black hover:text-indigo-600 font-medium"
                  >
                    Sign up
                  </Link>
                </p>
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
                  radius="sm"
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
                  radius="sm"
                  size="sm"
                />
              </div>

              <Button
                variant="solid"
                radius="sm"
                type="submit"
                disabled={isSubmitting}
                className="border-none shadow-gray-100 bg-black hover:bg-indigo-600 text-white h-9"
              >
                Sign in
              </Button>
            </Form>
          )}
        </Formik>
        {errorMessage && (
          <div className="pt-6">
            <div className="bg-[#fed5df] text-[#620726] p-4 rounded-lg text-sm text-center">
              <p>{errorMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
