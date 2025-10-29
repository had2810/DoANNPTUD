import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

/**
 * Custom hook để xoá entity và xử lý refetch/toast
 * @param {Function} deleteFn - Hàm xoá từ service
 * @param {string} key - Query key để refetch sau khi xoá
 * @param {string} successMessage - Thông báo sau khi xoá
 */
const useDeleteEntity = (
  deleteFn,
  key,
  successMessage = "Đã xóa thành công"
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteFn,
    onSuccess: () => {
      queryClient.invalidateQueries([key]);
      toast({
        title: successMessage,
        description: "Dữ liệu đã được xoá.",
      });
    },
    onError: (error) => {
      console.error("❌ Delete error:", error);

      toast({
        title: "Lỗi!",
        description:
          error?.response?.data?.message ||
          error.message ||
          "Không thể xoá dữ liệu.",
        variant: "destructive",
      });
    },
  });
};

export default useDeleteEntity;
