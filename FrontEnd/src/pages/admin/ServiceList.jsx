import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import serviceService from "@/services/serviceService";
import ServiceFormDialog from "@/components/tables/ServiceFormDialog";
import DeleteConfirmDialog from "@/components/tables/DeleteConfirmDialog";
import DataTable from "@/components/tables/DataTable";
import { useQueryClient } from "@tanstack/react-query";
import useEntityList from "@/hooks/useEntityList";
import useDeleteEntity from "@/hooks/useDeleteEntity";
import useSearchPagination from "@/hooks/useSearchPagination";
import { formatCurrency, formatDuration } from "@/lib/format";

const perPage = 10;

const ServiceList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // UI state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Query: Get all services
  const {
    data: services = [],
    isLoading,
    isError,
  } = useEntityList("services", serviceService.getAllServices);

  // Mutation: Delete service
  const deleteMutation = useDeleteEntity(
    serviceService.deleteService,
    "services",
    "Dịch vụ đã được xóa thành công"
  );

  // Filtering + pagination
  const {
    paginatedData: paginatedServices,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useSearchPagination(
    services,
    ["serviceName", "serviceType", "description"],
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

  const handleAddService = () => {
    setSelectedService(null);
    setIsAddDialogOpen(true);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setIsEditDialogOpen(true);
  };

  const handleServiceSaved = () => {
    queryClient.invalidateQueries(["services"]);
    toast({
      title: "Thành công!",
      description: "Thông tin dịch vụ đã được lưu.",
    });
  };

  const handleDeleteClick = (service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedService) {
      deleteMutation.mutate(selectedService._id);
      setIsDeleteDialogOpen(false);
    }
  };

  const columns = [
    { key: "serviceName", label: "Tên dịch vụ" },
    { key: "serviceType", label: "Loại dịch vụ" },
    {
      key: "deviceTemplateId",
      label: "Thiết bị",
      render: (service) => service.deviceTemplateId?.name || "N/A",
    },
    {
      key: "price",
      label: "Giá",
      render: (service) => formatCurrency(service.price),
    },
    {
      key: "estimatedDuration",
      label: "Thời lượng",
      render: (service) => formatDuration(service.estimatedDuration),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (service) =>
        service.status === "active" ? (
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700 border border-green-300 shadow-sm">
            Hoạt động
          </span>
        ) : (
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-700 border border-red-300 shadow-sm">
            Không hoạt động
          </span>
        ),
    },
    { key: "description", label: "Mô tả", hidden: true },
  ];

  return (
    <DataTable
      title="Danh Sách Dịch Vụ"
      data={paginatedServices}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      onSearch={handleSearch}
      onAdd={handleAddService}
      onEdit={handleEditService}
      onDelete={handleDeleteClick}
      columns={columns}
      searchPlaceholder="Tìm kiếm theo tên, loại dịch vụ hoặc mô tả..."
      addButtonText="Thêm Dịch Vụ"
      isLoading={isLoading}
      formDialog={
        <>
          {isAddDialogOpen && (
            <ServiceFormDialog
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              onSave={handleServiceSaved}
            />
          )}
          {isEditDialogOpen && selectedService && (
            <ServiceFormDialog
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              service={selectedService}
              onSave={handleServiceSaved}
            />
          )}
        </>
      }
      deleteDialog={
        isDeleteDialogOpen &&
        selectedService && (
          <DeleteConfirmDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
            serviceName={selectedService.serviceName}
          />
        )
      }
    />
  );
};

export default ServiceList;
