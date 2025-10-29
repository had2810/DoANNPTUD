import Index from "@/pages/employee/Index";

const EmployeeLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        <Index />
      </div>
    </div>
  );
};

export default EmployeeLayout;
// ...existing code from src/employee-ui/src/components/EmployeeLayout.tsx
