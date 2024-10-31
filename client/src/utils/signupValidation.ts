import * as Yup from "yup";

export const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  clinic: Yup.object().shape({
    name: Yup.string().required("Clinic name is required"),
    address: Yup.string().required("Clinic address is required"),
    contactNumber: Yup.string().required("Clinic contact number is required"),
  }),
});

export const AddUserSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  role: Yup.string().required("Role is required"),
});
