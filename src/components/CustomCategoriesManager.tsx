
import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface CustomCategoriesManagerProps {
  customCategories: string[];
  onUpdateCategories: (categories: string[]) => void;
}

export const CustomCategoriesManager = ({ 
  customCategories, 
  onUpdateCategories 
}: CustomCategoriesManagerProps) => {
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim();
    if (!trimmedCategory) {
      toast({
        title: "Validation Error",
        description: "Category name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (customCategories.includes(trimmedCategory)) {
      toast({
        title: "Validation Error",
        description: "Category already exists.",
        variant: "destructive",
      });
      return;
    }

    onUpdateCategories([...customCategories, trimmedCategory]);
    setNewCategory("");
    toast({
      title: "Category Added",
      description: `Category "${trimmedCategory}" has been added.`,
    });
  };

  const handleDeleteCategory = (index: number) => {
    const categoryName = customCategories[index];
    const updatedCategories = customCategories.filter((_, i) => i !== index);
    onUpdateCategories(updatedCategories);
    toast({
      title: "Category Deleted",
      description: `Category "${categoryName}" has been deleted.`,
      variant: "destructive",
    });
  };

  const handleEditCategory = (index: number) => {
    setEditingIndex(index);
    setEditingValue(customCategories[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;

    const trimmedValue = editingValue.trim();
    if (!trimmedValue) {
      toast({
        title: "Validation Error",
        description: "Category name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (customCategories.includes(trimmedValue) && customCategories[editingIndex] !== trimmedValue) {
      toast({
        title: "Validation Error",
        description: "Category already exists.",
        variant: "destructive",
      });
      return;
    }

    const updatedCategories = [...customCategories];
    updatedCategories[editingIndex] = trimmedValue;
    onUpdateCategories(updatedCategories);
    setEditingIndex(null);
    setEditingValue("");
    toast({
      title: "Category Updated",
      description: `Category has been updated to "${trimmedValue}".`,
    });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="new-category">Add Custom Category</Label>
        <div className="flex gap-2 mt-2">
          <Input
            id="new-category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddCategory();
              }
            }}
          />
          <Button onClick={handleAddCategory} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <Label>Custom Categories</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {customCategories.map((category, index) => (
            <div key={index} className="flex items-center gap-1">
              {editingIndex === index ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="h-8 w-32"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveEdit();
                      } else if (e.key === 'Escape') {
                        handleCancelEdit();
                      }
                    }}
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                    ✓
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                    ✕
                  </Button>
                </div>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {category}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleEditCategory(index)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleDeleteCategory(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          ))}
          {customCategories.length === 0 && (
            <p className="text-sm text-gray-500">No custom categories yet. Add your first category above.</p>
          )}
        </div>
      </div>
    </div>
  );
};
