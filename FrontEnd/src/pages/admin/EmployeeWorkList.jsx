import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import employeeWorkService from "@/services/employeeWorkService";
import EmployeeWorkFormDialog from "@/components/dialogs/EmployeeWorkFormDialog";
import DeleteConfirmDialog from "@/components/tables/DeleteConfirmDialog";
import DataTable from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";
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

  const filteredWorks = employeeWorks.map(work => ({
    ...work,
    startTime: work.startTime ? new Date(work.startTime) : null,
    endTime: work.endTime ? new Date(work.endTime) : null,
  }));

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

  // Admin should not edit schedules directly here; editing UI removed.

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
      key: "employeeInfo",
      label: "Thông tin nhân viên",
      render: (work) => {
        const employee = work.employeeId;
        if (!employee) return "N/A";
        
        let roleText = "Không xác định";
        if (employee.role?.role === "Employee") roleText = "Kỹ thuật viên";
        if (employee.role?.role === "Consultant") roleText = "Tư vấn viên";

        return (
          <div className="flex items-center gap-2">
            {employee.avatar_url ? (
              <img
                src={employee.avatar_url}
                alt="avatar"
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-white">
                {employee.lastName?.charAt(0) || "?"}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium">{employee.fullName}</span>
              <span className="text-sm text-gray-500">{roleText}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: "schedule",
      label: "Lịch làm việc",
      render: (work) => (
        <div className="flex flex-col">
          <span className="font-medium">{formatDate(work.startTime)}</span>
          <span className="text-sm text-gray-500">
            {formatTime(work.startTime)} - {formatTime(work.endTime)}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (work) => (
        <Badge 
          className={
            work.status === "Đang trực" ? "bg-green-100 text-green-800 hover:bg-green-100" :
            work.status === "Bận" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
            work.status === "Nghỉ" ? "bg-red-100 text-red-800 hover:bg-red-100" :
            "bg-gray-100 text-gray-800"
          }
        >
          {work.status || "Không xác định"}
        </Badge>
      )
    },
    {
      key: "note",
      label: "Ghi chú",
      render: (work) => work.note || "Không có ghi chú"
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
    /* Admin editing removed: do not pass onEdit */
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
      {/* Editing by admin is disabled for employee work schedules */}

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
