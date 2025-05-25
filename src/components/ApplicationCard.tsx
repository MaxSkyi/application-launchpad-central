
import { Play, Trash2, Calendar, HardDrive, Tag } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
}

interface ApplicationCardProps {
  application: Application;
  viewMode: "grid" | "list";
  onLaunch: () => void;
  onDelete: () => void;
}

export const ApplicationCard = ({ application, viewMode, onLaunch, onDelete }: ApplicationCardProps) => {
  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <img
              src={application.icon}
              alt={application.name}
              className="w-12 h-12 rounded-lg object-cover bg-gray-200"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{application.name}</h3>
              <p className="text-gray-600 text-sm truncate">{application.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <HardDrive className="h-3 w-3" />
                  {application.size}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(application.dateAdded).toLocaleDateString()}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {application.category}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={onLaunch}>
                <Play className="h-4 w-4 mr-1" />
                Launch
              </Button>
              <Button size="sm" variant="outline" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <img
          src={application.icon}
          alt={application.name}
          className="w-16 h-16 mx-auto rounded-lg object-cover bg-gray-200 mb-3"
        />
        <h3 className="text-lg font-semibold text-gray-900 text-center truncate">
          {application.name}
        </h3>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2">
          {application.description}
        </p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              {application.size}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(application.dateAdded).toLocaleDateString()}
            </div>
          </div>
          
          <Badge variant="secondary" className="w-full justify-center text-xs">
            {application.category}
          </Badge>
          
          <div className="flex flex-wrap gap-1">
            {application.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="h-2 w-2 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1" onClick={onLaunch}>
            <Play className="h-4 w-4 mr-1" />
            Launch
          </Button>
          <Button size="sm" variant="outline" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
