import { useQuery } from "react-query";
import { trpc } from "@/trpc";

const usePatients = (
  currentPage: number,
  pageSize: number,
  searchTerm: string
) => {
  const { data: { patients = [], totalPatients = 0 } = {}, isLoading } =
    useQuery(
      ["patients", currentPage, pageSize, searchTerm],
      () =>
        trpc.patient.find.query({
          page: Math.max(0, currentPage - 1),
          pageSize: pageSize,
          searchTerm: searchTerm,
        }),
      { keepPreviousData: true }
    );

  return { patients, totalPatients, isLoading };
};

export default usePatients;
