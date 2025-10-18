import { useState, useMemo } from "react";

/**
 * @template T - Kiểu dữ liệu đầu vào (dữ liệu đã được map sẵn)
 */
const useSearchPagination = <T>(
  data: T[] = [],
  searchFields: (keyof T)[] = [],
  perPage: number = 10
) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    const lower = searchQuery.toLowerCase();
    return data.filter((item) =>
      searchFields.some((field) =>
        item[field]?.toString().toLowerCase().includes(lower)
      )
    );
  }, [searchQuery, data, searchFields]);

  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return {
    paginatedData,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
  };
};

export default useSearchPagination;
