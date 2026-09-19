import React from "react";
import { Bell, Info } from "lucide-react";

export const Notifications: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            System notices, due date reminders, and reservation alerts.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-lg mb-1">No New Notifications</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          You're all caught up! Real-time notifications for returns, loans, and waitlists will show here.
        </p>
      </div>
    </div>
  );
};

export default Notifications;
