
import { AddApplicationModal } from "@/components/AddApplicationModal";
import { FunctionalSettingsModal } from "@/components/FunctionalSettingsModal";
import { EditApplicationModal } from "@/components/EditApplicationModal";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";

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

interface ApplicationModalsProps {
  isAddModalOpen: boolean;
  onAddModalOpenChange: (open: boolean) => void;
  onAddApplication: (newApp: any) => void;
  isSettingsOpen: boolean;
  onSettingsOpenChange: (open: boolean) => void;
  editingApplication: Application | null;
  onEditingApplicationChange: (app: Application | null) => void;
  onUpdateApplication: (id: string, updates: Partial<Application>) => void;
  deletingApplication: Application | null;
  onDeletingApplicationChange: (app: Application | null) => void;
  onConfirmDelete: (app: Application) => void;
}

export const ApplicationModals = ({
  isAddModalOpen,
  onAddModalOpenChange,
  onAddApplication,
  isSettingsOpen,
  onSettingsOpenChange,
  editingApplication,
  onEditingApplicationChange,
  onUpdateApplication,
  deletingApplication,
  onDeletingApplicationChange,
  onConfirmDelete,
}: ApplicationModalsProps) => {
  return (
    <>
      <AddApplicationModal
        open={isAddModalOpen}
        onOpenChange={onAddModalOpenChange}
        onAddApplication={onAddApplication}
      />

      <FunctionalSettingsModal
        open={isSettingsOpen}
        onOpenChange={onSettingsOpenChange}
      />

      <EditApplicationModal
        open={!!editingApplication}
        onOpenChange={() => onEditingApplicationChange(null)}
        application={editingApplication}
        onUpdateApplication={onUpdateApplication}
      />

      <ConfirmDeleteDialog
        open={!!deletingApplication}
        onOpenChange={() => onDeletingApplicationChange(null)}
        applicationName={deletingApplication?.name || ""}
        onConfirm={() => deletingApplication && onConfirmDelete(deletingApplication)}
      />
    </>
  );
};
