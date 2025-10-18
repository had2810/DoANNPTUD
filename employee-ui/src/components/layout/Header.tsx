import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  title: string;
  onToggleSidebar: () => void;
}

const Header = ({ title, onToggleSidebar }: HeaderProps) => {
  return (
    <div className="h-16 border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded hover:bg-muted mr-2"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-[200px] pl-8 h-9 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>

        <button className="relative p-2 rounded-full hover:bg-muted">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </div>
  );
};

export default Header;
