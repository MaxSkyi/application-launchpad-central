
import { useState, useEffect } from "react";
import { Edit, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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

interface EditApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: Application | null;
  onUpdateApplication: (id: string, updates: Partial<Application>) => void;
}

const categories = ["Development", "Graphics", "Analytics", "Media", "Utilities", "Games", "Productivity"];

export const EditApplicationModal = ({ 
  open, 
  onOpenChange, 
  application,
  onUpdateApplication 
}: EditApplicationModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    tags: "",
    executable: "",
  });

  useEffect(() => {
    if (application) {
      setFormData({
        name: application.name,
        description: application.description,
        category: application.category,
        tags: application.tags.join(", "),
        executable: application.executable,
      });
    }
  }, [application]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!application) return;

    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Application name is required.",
        variant: "destructive",
      });
      return;
    }

    const tagsArray = formData.tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const updates = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      tags: tagsArray,
      executable: formData.executable.trim(),
    };

    onUpdateApplication(application.id, updates);
    onOpenChange(false);
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !application) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      onUpdateApplication(application.id, { icon: imageUrl });
      toast({
        title: "Icon Updated",
        description: "Application icon has been updated successfully.",
      });
    };
    reader.readAsDataURL(file);
  };

  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Application
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Application Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter application name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter application description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
            <Input
              id="edit-tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g., coding, editor, productivity"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-executable">Executable Path</Label>
            <Input
              id="edit-executable"
              value={formData.executable}
              onChange={(e) => setFormData(prev => ({ ...prev, executable: e.target.value }))}
              placeholder="Path to executable file"
            />
          </div>

          <div className="space-y-2">
            <Label>Application Icon</Label>
            <div className="flex items-center gap-4">
              <img
                src={application.icon}
                alt={application.name}
                className="w-12 h-12 rounded-lg object-cover bg-gray-200"
              />
              <Button type="button" variant="outline" asChild>
                <label htmlFor="edit-icon" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Change Icon
                </label>
              </Button>
              <input
                id="edit-icon"
                type="file"
                accept="image/*"
                onChange={handleIconUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
