import { statusConfig, type Instance } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Square } from "lucide-react";
import { Play } from "lucide-react";
import { Trash2 } from "lucide-react";

export const InstanceCard = ({
  instance,
  handleInstanceAction,
}: {
  instance: Instance;
  handleInstanceAction: (
    instanceId: number,
    action: "start" | "stop" | "delete"
  ) => void;
}) => {
  const statusInfo =
    statusConfig[instance.connectionStatus as keyof typeof statusConfig];
  return (
    <Card
      key={instance.id}
      className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusInfo.color} rounded-full border-2 border-gray-800`}
              />
            </div>
            <div>
              <h3 className="font-medium text-white truncate max-w-80">
                {instance.name}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <Badge
            variant="secondary"
            className={`${statusInfo.bgColor} ${statusInfo.textColor} text-xs`}
          >
            {statusInfo.label}
          </Badge>
          {instance.createdAt && (
            <span className="text-xs text-gray-500">
              {new Date(instance.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <Separator className="bg-gray-700 mb-3" />

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={() =>
              handleInstanceAction(
                instance.id,
                instance.connectionStatus === "ONLINE" ? "stop" : "start"
              )
            }
          >
            {instance.connectionStatus === "ONLINE" ? (
              <Square className="w-3 h-3 mr-1" />
            ) : (
              <Play className="w-3 h-3 mr-1" />
            )}
            {instance.connectionStatus === "ONLINE" ? "Parar" : "Iniciar"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            onClick={() => handleInstanceAction(instance.id, "delete")}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
