import { useQuery } from "react-query";
import { trpc } from "@/trpc";

const usePatients = () => {
  const { data: patients = [], isLoading } = useQuery("patients", () =>
    trpc.patient.find.query()
  );

  return { patients, isLoading };
};

export default usePatients;
