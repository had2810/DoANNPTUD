import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import EmployeeFormDialog from "@/components/tables/EmployeeFormDialog";
import DeleteConfirmDialog from "@/components/tables/DeleteConfirmDialog";
import DataTable from "@/components/tables/DataTable";
import employeeService from "../../services/employeeService";
// import { getAllEmployees, deleteEmployee } from "@/services/employeeService";
import { Badge } from "@/components/ui/badge";
import useEntityList from "@/hooks/useEntityList";
import useDeleteEntity from "@/hooks/useDeleteEntity";
import useSearchPagination from "@/hooks/useSearchPagination";
import { formatDate } from "@/lib/format";

const EmployeeList = () => {
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const perPage = 10;

  const {
    data: employees = [],
    isLoading,
    isError,
    refetch,
  } = useEntityList("employees", employeeService.getAllEmployees);

  const deleteMutation = useDeleteEntity(
    employeeService.deleteEmployee,
    "employees",
    "Nhân viên đã được xóa thành công"
  );

  const {
    paginatedData,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useSearchPagination(
    employees,
    ["firstName", "lastName", "email", "phoneNumber"],
    perPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsAddDialogOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleEmployeeSaved = () => {
    refetch();
    toast({
      title: "Thành công!",
      description: "Thông tin nhân viên đã được lưu.",
    });
  };

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;
    deleteMutation.mutate(selectedEmployee._id);
    setIsDeleteDialogOpen(false);
  };

  const columns = [
    {
      key: "name",
      label: "Tên",
      render: (employee) => `${employee.firstName} ${employee.lastName}`,
    },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Điện thoại" },
    {
      key: "position",
      label: "Chức vụ",
      render: (employee) => {
        const roleMapping = {
          Employee: "Kỹ thuật viên",
          Consultant: "Tư vấn viên",
        };
        return (
          roleMapping[employee.role?.role] ||
          employee.role?.role ||
          "Chưa phân quyền"
        );
      },
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (employee) => (
        <Badge
          className={
            employee.status === "active"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-red-100 text-red-800 hover:bg-red-100"
          }
        >
          {employee.status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      hidden: true,
      render: (employee) => formatDate(employee.createdAt),
    },
  ];

  return (
    <>
      <DataTable
        title="Danh Sách Nhân Viên"
        data={paginatedData}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onAdd={handleAddEmployee}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteClick}
        columns={columns}
        searchPlaceholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
        addButtonText="Thêm Nhân Viên"
        isLoading={isLoading}
        formDialog={
          <>
            {isAddDialogOpen && (
              <EmployeeFormDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSave={handleEmployeeSaved}
              />
            )}
            {isEditDialogOpen && selectedEmployee && (
              <EmployeeFormDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                employee={selectedEmployee}
                onSave={handleEmployeeSaved}
              />
            )}
          </>
        }
        deleteDialog={
          isDeleteDialogOpen &&
          selectedEmployee && (
            <DeleteConfirmDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              onConfirm={handleDeleteConfirm}
              customerName={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
            />
          )
        }
      />
    </>
  );
};

export default EmployeeList;
