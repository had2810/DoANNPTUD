import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import customerService from "@/services/customerService";
import CustomerFormDialog from "@/components/tables/CustomerFormDialog";
import DeleteConfirmDialog from "@/components/tables/DeleteConfirmDialog";
import DataTable from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import useEntityList from "@/hooks/useEntityList";
import useDeleteEntity from "@/hooks/useDeleteEntity";
import useSearchPagination from "@/hooks/useSearchPagination";
import { formatDate } from "@/lib/format";

const perPage = 10;

const CustomerList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // UI state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Query: Get all customers
  const {
    data: customers = [],
    isLoading,
    isError,
  } = useEntityList("customers", customerService.getAllCustomers);

  // Mutation: Delete customer
  const deleteMutation = useDeleteEntity(
    customerService.deleteCustomer,
    "customers",
    "Khách hàng đã được xóa thành công"
  );

  // Filtering + pagination
  const {
    paginatedData: paginatedCustomers,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useSearchPagination(
    customers,
    ["userName", "email", "phoneNumber"],
    perPage
  );

  // UI handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setIsAddDialogOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleCustomerSaved = () => {
    queryClient.invalidateQueries(["customers"]);
    toast({
      title: "Thành công!",
      description: "Thông tin khách hàng đã được lưu.",
    });
  };

  const handleDeleteClick = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedCustomer) {
      deleteMutation.mutate(selectedCustomer._id);
      setIsDeleteDialogOpen(false);
    }
  };

  const columns = [
    { key: "fullName", label: "Tên" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Điện thoại" },
    { key: "address", label: "Địa chỉ", hidden: true },
    {
      key: "status",
      label: "Trạng thái",
      render: (customer) => (
        <Badge
          className={
            customer.status === "active"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-red-100 text-red-800 hover:bg-red-100"
          }
        >
          {customer.status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      hidden: true,
      render: (customer) => formatDate(customer.createdAt),
    },
  ];

  return (
    <DataTable
      title="Danh Sách Khách Hàng"
      data={paginatedCustomers}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      onSearch={handleSearch}
      onAdd={handleAddCustomer}
      onEdit={handleEditCustomer}
      onDelete={handleDeleteClick}
      columns={columns}
      searchPlaceholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
      addButtonText="Thêm Khách Hàng"
      isLoading={isLoading}
      formDialog={
        <>
          {isAddDialogOpen && (
            <CustomerFormDialog
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              onSave={handleCustomerSaved}
            />
          )}
          {isEditDialogOpen && selectedCustomer && (
            <CustomerFormDialog
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              customer={selectedCustomer}
              onSave={handleCustomerSaved}
            />
          )}
        </>
      }
      deleteDialog={
        isDeleteDialogOpen &&
        selectedCustomer && (
          <DeleteConfirmDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
            customerName={selectedCustomer.userName}
          />
        )
      }
    />
  );
};

export default CustomerList;
