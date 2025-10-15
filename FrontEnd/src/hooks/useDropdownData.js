import useEntityList from "./useEntityList";
import customerService from "@/services/customerService";
import deviceTemplateService from "@/services/deviceTemplateService";
import employeeService from "@/services/employeeService";
import serviceService from "@/services/serviceService";

const useDropdownData = () => {
  const { data: customers = [], isLoading: isLoadingCustomers } = useEntityList(
    "customers",
    customerService.getAllCustomers
  );
  const { data: deviceTemplates = [], isLoading: isLoadingDeviceTemplates } =
    useEntityList(
      "deviceTemplates",
      deviceTemplateService.getAllDeviceTemplates
    );
  const { data: services = [], isLoading: isLoadingServices } = useEntityList(
    "services",
    serviceService.getAllServices
  );
  const { data: employees = [], isLoading: isLoadingEmployees } = useEntityList(
    "employees",
    employeeService.getAllEmployees
  );

  return {
    customers,
    deviceTemplates,
    services,
    employees,
    loading:
      isLoadingCustomers ||
      isLoadingDeviceTemplates ||
      isLoadingServices ||
      isLoadingEmployees,
  };
};

export default useDropdownData;
