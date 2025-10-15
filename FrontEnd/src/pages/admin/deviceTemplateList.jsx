import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import deviceTemplateService from "@/services/deviceTemplateService";
import DeviceTemplateFormDialog from "@/components/dialogs/deviceTemplateFormDialog";
import DeleteConfirmDialog from "@/components/tables/DeleteConfirmDialog";
import DataTable from "@/components/tables/DataTable";
import { useQueryClient } from "@tanstack/react-query";
import useEntityList from "@/hooks/useEntityList";
import useDeleteEntity from "@/hooks/useDeleteEntity";
import useSearchPagination from "@/hooks/useSearchPagination";

const perPage = 10;

const DeviceTemplateList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // UI state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Query: Get all device templates
  const {
    data: templates = [],
    isLoading,
    isError,
  } = useEntityList(
    "deviceTemplates",
    deviceTemplateService.getAllDeviceTemplates
  );

  // Mutation: Delete template
  const deleteMutation = useDeleteEntity(
    deviceTemplateService.deleteDeviceTemplate,
    "deviceTemplates",
    "Mẫu thiết bị đã được xóa thành công"
  );

  // Filtering + pagination
  const {
    paginatedData: paginatedTemplates,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useSearchPagination(templates, ["name", "type", "brand"], perPage);

  // UI handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleAddTemplate = () => {
    setSelectedTemplate(null);
    setIsAddDialogOpen(true);
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setIsEditDialogOpen(true);
  };

  const handleTemplateSaved = () => {
    queryClient.invalidateQueries(["deviceTemplates"]);
    toast({
      title: "Thành công!",
      description: "Thông tin mẫu thiết bị đã được lưu.",
    });
  };

  const handleDeleteClick = (template) => {
    setSelectedTemplate(template);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedTemplate) {
      deleteMutation.mutate(selectedTemplate._id);
      setIsDeleteDialogOpen(false);
    }
  };

  const columns = [
    { key: "name", label: "Tên mẫu" },
    { key: "type", label: "Loại thiết bị" },
    { key: "brand", label: "Hãng" },
    {
      key: "image_url",
      label: "Hình ảnh",
      render: (template) =>
        template.image_url ? (
          <img
            src={template.image_url}
            alt={template.name}
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          "Không có"
        ),
    },
    {
      key: "active",
      label: "Trạng thái",
      render: (template) => (
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
            template.active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {template.active ? "Hoạt động" : "Không hoạt động"}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      title="Danh Sách Mẫu Thiết Bị"
      data={paginatedTemplates}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      onSearch={handleSearch}
      onAdd={handleAddTemplate}
      onEdit={handleEditTemplate}
      onDelete={handleDeleteClick}
      columns={columns}
      searchPlaceholder="Tìm kiếm theo tên, loại thiết bị hoặc hãng..."
      addButtonText="Thêm Mẫu Thiết Bị"
      isLoading={isLoading}
      formDialog={
        <>
          {isAddDialogOpen && (
            <DeviceTemplateFormDialog
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              onSave={handleTemplateSaved}
            />
          )}
          {isEditDialogOpen && selectedTemplate && (
            <DeviceTemplateFormDialog
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              template={selectedTemplate}
              onSave={handleTemplateSaved}
            />
          )}
        </>
      }
      deleteDialog={
        isDeleteDialogOpen &&
        selectedTemplate && (
          <DeleteConfirmDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
            serviceName={selectedTemplate.name}
          />
        )
      }
    />
  );
};

export default DeviceTemplateList;
