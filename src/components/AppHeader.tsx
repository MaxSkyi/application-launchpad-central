
import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  onSettingsClick: () => void;
  onAddApplicationClick: () => void;
}

export const AppHeader = ({ onSettingsClick, onAddApplicationClick }: AppHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Application Hub</h1>
        <p className="text-gray-600">Manage and launch your applications from one place</p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onSettingsClick}
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button onClick={onAddApplicationClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Application
        </Button>
      </div>
    </div>
  );
};
