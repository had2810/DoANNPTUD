import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook dùng để fetch danh sách bất kỳ entity nào
 * @param {string} key - Query key (vd: "customers", "employees")
 * @param {Function} fetchFn - Hàm lấy danh sách từ service
 */
const useEntityList = (key, fetchFn) => {
  return useQuery({
    queryKey: [key],
    queryFn: fetchFn,
  });
};

export default useEntityList;
