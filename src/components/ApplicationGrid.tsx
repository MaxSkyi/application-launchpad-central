
import { Folder } from "lucide-react";
import { ApplicationCard } from "@/components/ApplicationCard";

interface Application {
  id: string;
  name: string;
  description: string;
  icon: string;
  size: string;
  dateAdded: string;
  category: string;
  tags: string[];
  executable: string;
  fileName?: string;
}

interface ApplicationGridProps {
  applications: Application[];
  viewMode: "grid" | "list";
  onLaunchApp: (app: Application) => void;
  onEditApp: (app: Application) => void;
  onDeleteApp: (app: Application) => void;
  totalApplications: number;
}

export const ApplicationGrid = ({
  applications,
  viewMode,
  onLaunchApp,
  onEditApp,
  onDeleteApp,
  totalApplications,
}: ApplicationGridProps) => {
  if (applications.length > 0) {
    return (
      <div className={
        viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
      }>
        {applications.map(app => (
          <ApplicationCard
            key={app.id}
            application={app}
            viewMode={viewMode}
            onLaunch={() => onLaunchApp(app)}
            onEdit={() => onEditApp(app)}
            onDelete={() => onDeleteApp(app)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
      <p className="text-gray-600">
        {totalApplications === 0 
          ? "Get started by adding your first application." 
          : "Try adjusting your search or add a new application."
        }
      </p>
    </div>
  );
};
