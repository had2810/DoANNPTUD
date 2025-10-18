import Index from "@/pages/Index";

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
