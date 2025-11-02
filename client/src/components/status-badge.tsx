import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  type?: "room" | "reservation" | "payment" | "hotel";
}

const statusConfig = {
  room: {
    available: { label: "Available", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    occupied: { label: "Occupied", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
    cleaning: { label: "Cleaning", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
    maintenance: { label: "Maintenance", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  },
  reservation: {
    pending: { label: "Pending", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" },
    confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
    checked_in: { label: "Checked In", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    checked_out: { label: "Checked Out", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  },
  payment: {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
    completed: { label: "Completed", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    failed: { label: "Failed", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
    refunded: { label: "Refunded", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  },
  hotel: {
    active: { label: "Active", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    suspended: { label: "Suspended", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
    trial: { label: "Trial", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  },
};

export function StatusBadge({ status, type = "reservation" }: StatusBadgeProps) {
  const config = statusConfig[type][status as keyof typeof statusConfig[typeof type]];
  
  if (!config) {
    return <Badge variant="secondary">{status}</Badge>;
  }

  return (
    <Badge className={`${config.color} rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1.5 w-fit`}>
      <Circle className="h-2 w-2 fill-current" />
      {config.label}
    </Badge>
  );
}
