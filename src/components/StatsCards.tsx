
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

interface StatsCardsProps {
  applications: Application[];
}

export const StatsCards = ({ applications }: StatsCardsProps) => {
  // Calculate total size
  const totalSize = applications.reduce((total, app) => {
    const sizeNum = parseInt(app.size.replace(/[^\d]/g, ''));
    return total + sizeNum;
  }, 0);

  // Get last added date
  const lastAdded = applications.length > 0 
    ? new Date(Math.max(...applications.map(app => new Date(app.dateAdded).getTime())))
    : null;

  const formatLastAdded = () => {
    if (!lastAdded) return "Never";
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastAdded.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return lastAdded.toLocaleDateString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{applications.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{new Set(applications.map(app => app.category)).size}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Size</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSize} MB</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Last Added</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatLastAdded()}</div>
        </CardContent>
      </Card>
    </div>
  );
};
