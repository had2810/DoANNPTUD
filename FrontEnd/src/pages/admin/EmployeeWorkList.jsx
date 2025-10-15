import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import employeeWorkService from "@/services/employeeWorkService";
import EmployeeWorkFormDialog from "@/components/dialogs/EmployeeWorkFormDialog";
import DeleteConfirmDialog from "@/components/tables/DeleteConfirmDialog";
import DataTable from "@/components/tables/DataTable";
import { useQueryClient } from "@tanstack/react-query";
import useEntityList from "@/hooks/useEntityList";
import useDeleteEntity from "@/hooks/useDeleteEntity";
import useSearchPagination from "@/hooks/useSearchPagination";
import { formatTime, formatDate } from "@/lib/format";
import ViewDialogEmployee from "@/components/dialogs/ViewDialogEmployee";

const perPage = 10;

const EmployeeWorkList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // UI state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedViewWork, setSelectedViewWork] = useState(null);

  // Query: Get all employee works
  const {
    data: employeeWorks = [],
    isLoading,
    isError,
  } = useEntityList("employee-works", employeeWorkService.getAllEmployeeWorks);

  // So sánh ngày theo UTC string để tránh lệch múi giờ
  const getUTCDateString = (date) => {
    return date.toISOString().split("T")[0];
  };

  const todayUTCStr = getUTCDateString(new Date());

  const filteredWorks = employeeWorks.filter((work) => {
    if (!work.excludedDates || !Array.isArray(work.excludedDates)) return true;

    const hasDayOff = work.excludedDates.some((dateStr) => {
      const excludedDateUTC = dateStr.split("T")[0];
      return excludedDateUTC === todayUTCStr;
    });

    return !hasDayOff;
  });

  // Filtering + pagination
  const {
    paginatedData: paginatedWorks,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useSearchPagination(
    filteredWorks.map((work) => ({
      ...work,
      fullName: work.employeeId?.fullName || "",
      status: work.status || "",
      note: work.note || "",
    })),
    ["fullName", "status", "note"],
    perPage
  );

  // Mutation: Delete employee work
  const deleteMutation = useDeleteEntity(
    employeeWorkService.deleteEmployeeWork,
    "employee-works",
    "Lịch làm việc đã được xóa thành công"
  );

  // UI handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleAddWork = () => {
    setSelectedWork(null);
    setIsAddDialogOpen(true);
  };

  const handleEditWork = (work) => {
    setSelectedWork(work);
    setIsEditDialogOpen(true);
  };

  const handleWorkSaved = () => {
    queryClient.invalidateQueries(["employee-works"]);
    toast({
      title: "Thành công!",
      description: "Thông tin lịch làm việc đã được lưu.",
    });
  };

  const handleDeleteClick = (work) => {
    setSelectedWork(work);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedWork) {
      deleteMutation.mutate(selectedWork._id);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleViewDetail = (work) => {
    setSelectedViewWork(work);
    setIsViewDialogOpen(true);
  };

  const columns = [
    {
      key: "employeeId",
      label: "Nhân viên",
      render: (work) =>
        work.employeeId ? (
          <div className="flex items-center gap-2">
            {work.employeeId.avatar_url ? (
              <img
                src={work.employeeId.avatar_url}
                alt="avatar"
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-white">
                {work.employeeId.lastName?.charAt(0) || "?"}
              </div>
            )}

            <span>{work.employeeId.fullName}</span>
          </div>
        ) : (
          "N/A"
        ),
    },
    {
      key: "role",
      label: "Chức vụ",
      render: (work) => {
        const role = work.employeeId?.role;
        if (role === 2) return "Kỹ thuật viên";
        if (role === 3) return "Tư vấn viên";
        return "Không rõ";
      },
    },
    {
      key: "date",
      label: "Ngày",
      render: () => {
        const today = new Date();
        return today.toLocaleDateString("vi-VN");
      },
    },
    {
      key: "startTime",
      label: "Thời gian bắt đầu",
      render: (work) => formatTime(work.startTime),
    },
    {
      key: "endTime",
      label: "Thời gian kết thúc",
      render: (work) => formatTime(work.endTime),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (work) => {
        const statusMap = {
          "Đang trực": {
            color: "bg-green-100 text-green-800",
            text: "Đang trực",
          },
          Bận: { color: "bg-yellow-100 text-yellow-800", text: "Bận" },
          Nghỉ: { color: "bg-red-100 text-red-800", text: "Nghỉ" },
        };

        const status = statusMap[work.status] || {
          color: "bg-gray-100 text-gray-800",
          text: work.status || "Không rõ",
        };

        return (
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${status.color}`}
          >
            {status.text}
          </span>
        );
      },
    },
    {
      key: "appointmentId",
      label: "Số cuộc hẹn",
      render: (work) => {
        if (!work.appointmentId || !Array.isArray(work.appointmentId)) return 0;
        const todayStr = new Date().toISOString().split("T")[0];
        const countToday = work.appointmentId.filter((app) => {
          if (!app.appointmentTime) return false;
          const appDate = new Date(app.appointmentTime)
            .toISOString()
            .split("T")[0];
          return appDate === todayStr;
        }).length;
        return countToday;
      },
    },
    {
      key: "note",
      label: "Ghi chú",
      hidden: true,
    },
  ];

  return (
    <>
      <DataTable
        title="Danh Sách Lịch Làm Việc Hôm Nay"
        data={paginatedWorks}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onAdd={handleAddWork}
        onEdit={handleEditWork}
        onDelete={handleDeleteClick}
        onView={handleViewDetail}
        columns={columns}
        searchPlaceholder="Tìm kiếm theo tên nhân viên, trạng thái hoặc ghi chú..."
        addButtonText="Thêm Lịch Làm Việc"
        isLoading={isLoading}
      />

      {/* Form Dialogs */}
      {isAddDialogOpen && (
        <EmployeeWorkFormDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSave={handleWorkSaved}
        />
      )}
      {isEditDialogOpen && selectedWork && (
        <EmployeeWorkFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          work={selectedWork}
          onSave={handleWorkSaved}
        />
      )}

      {/* View Dialog */}
      {isViewDialogOpen && selectedViewWork && (
        <ViewDialogEmployee
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          work={selectedViewWork}
        />
      )}

      {/* Delete Dialog */}
      {isDeleteDialogOpen && selectedWork && (
        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          serviceName={`lịch làm việc của ${
            selectedWork.employeeId?.fullName || "N/A"
          }`}
        />
      )}
    </>
  );
};

export default EmployeeWorkList;
