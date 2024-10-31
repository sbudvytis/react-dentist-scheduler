import { useState, useEffect } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { IoPersonAddOutline } from "react-icons/io5";
import useAuth from "@/hooks/useAuth";
import useSignupLoginStore from "@/stores/useSignupLoginStore";
import { AddUserSchema } from "@/utils/signupValidation";
import { UserInsert } from "@mono/server/src/shared/entities";
import { AnimatePresence, motion } from "framer-motion";

interface AddUserFormProps {
  currentClinicId: number | null;
}

type UserInsertForm = Omit<
  UserInsert,
  "password" | "isApproved" | "setupToken" | "setupTokenExpiresAt"
>;

const initialValues: UserInsertForm = {
  email: "",
  firstName: "",
  lastName: "",
  role: "",
  permissions: [],
};

const roles = [
  { value: "dentist", name: "Dentist" },
  { value: "receptionist", name: "Receptionist" },
];

const AddUser: React.FC<AddUserFormProps> = ({ currentClinicId }) => {
  const { addUser } = useAuth();
  const {
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
    resetMessages,
  } = useSignupLoginStore();

  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    return () => {
      resetMessages();
    };
  }, [resetMessages]);

  const toggleFormVisibility = () => {
    setIsFormVisible((prevState) => !prevState);
  };

  const handleAddUser = async (
    values: UserInsertForm,
    { resetForm }: FormikHelpers<UserInsertForm>
  ) => {
    try {
      if (!currentClinicId) {
        throw new Error("Clinic ID is required to add a user.");
      }

      const userToAdd = {
        ...values,
        clinicId: currentClinicId,
        password: "",
        isApproved: false,
        setupToken: null,
        setupTokenExpiresAt: null,
      };

      await addUser(userToAdd);
      setSuccessMessage("User added successfully!");
      resetForm();
      setIsFormVisible(false); // Optionally hide the form after submission
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to add user."
      );
    }
  };

  return (
    <div className="overflow-hidden text-sm rounded-2xl border border-gray-200">
      <div className="w-full bg-white rounded-2xl p-4 ">
        <div className="pb-4">
          <h1 className="text-lg text-left flex items-center gap-2 text-gray-800 font-semibold">
            Add new user
          </h1>
          <h2 className="text-sm text-gray-400">
            You can add a new user to the system here.
          </h2>
          <h2 className="text-sm text-gray-400">
            Please fill out the form by clicking button below
          </h2>
        </div>
        {/* Toggle Button */}
        <Button
          onClick={toggleFormVisibility}
          className="flex items-center gap-2 bg-black hover:bg-indigo-600 text-white h-9"
        >
          <IoPersonAddOutline />
          {isFormVisible ? "Hide Add User Form" : "Add New User"}
        </Button>

        <AnimatePresence>
          {isFormVisible && (
            <motion.div
              key="user-form"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Formik
                initialValues={initialValues}
                validationSchema={AddUserSchema}
                onSubmit={handleAddUser}
              >
                {({ isSubmitting, touched, errors }) => (
                  <Form className="grid space-y-4 pt-6">
                    <div className="min-h-14">
                      <Field
                        name="email"
                        as={Input}
                        type="email"
                        label="Email"
                        isInvalid={touched.email && !!errors.email}
                        errorMessage={errors.email}
                        required
                        radius="lg"
                        size="sm"
                      />
                    </div>
                    <div className="min-h-14">
                      <Field
                        name="firstName"
                        as={Input}
                        type="text"
                        label="First Name"
                        isInvalid={touched.firstName && !!errors.firstName}
                        errorMessage={errors.firstName}
                        required
                        radius="lg"
                        size="sm"
                      />
                    </div>
                    <div className="min-h-14">
                      <Field
                        name="lastName"
                        as={Input}
                        type="text"
                        label="Last Name"
                        isInvalid={touched.lastName && !!errors.lastName}
                        errorMessage={errors.lastName}
                        required
                        radius="lg"
                        size="sm"
                      />
                    </div>
                    <div className="min-h-14">
                      <Field
                        name="role"
                        as={Select}
                        label="Select your role"
                        isInvalid={!touched.role && !!errors.role}
                        errorMessage={errors.role}
                        required
                        radius="lg"
                        size="sm"
                      >
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </Field>
                    </div>
                    <div className="flex justify-center gap-2 lg:justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-black hover:bg-indigo-600 text-white h-9"
                        isLoading={isSubmitting}
                        radius="lg"
                      >
                        Add User
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
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
              <p>{errorMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddUser;
