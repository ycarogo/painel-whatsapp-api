import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Settings,
  Play,
  Square,
  Trash2,
  Plus,
  Database,
  Bot,
  Globe,
  MessageSquare,
} from "lucide-react";
import type { Instance } from "./lib/utils";
import { mockInstances } from "./mockInstances";
import {
  GetAllInstances,
  GetDataApiStorage,
  SetDataApiStorage,
} from "./services/api";

const statusConfig = {
  ONLINE: {
    label: "Conectado",
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
  },
  OFFLINE: {
    label: "Desconectado",
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
  },
  ERROR: {
    label: "Erro",
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
  },
  CONNECTING: {
    label: "Conectando",
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
  },
};

const typeIcons = {
  whatsapp: MessageSquare,
  web: Globe,
  facebook: MessageSquare,
  telegram: Bot,
  api: Database,
};

function App() {
  const [instances, setInstances] = useState<Instance[]>(mockInstances);
  const [filteredInstances, setFilteredInstances] =
    useState<Instance[]>(mockInstances);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ONLINE");
  const [apiUrl, setApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchInstances = async () => {
    try {
      const { apiUrl, apiKey } = await GetDataApiStorage();

      if (!apiUrl || !apiKey) {
        setIsConfigured(false);
        setShowConfig(true);
        setErrorMessage("Configure a URL e chave da API para continuar");
        return;
      }

      setApiUrl(apiUrl);
      setApiKey(apiKey);
      setIsConfigured(true);
      setErrorMessage(null);

      const instances = await GetAllInstances();
      console.log("instances", instances);
      setInstances(instances);
      setFilteredInstances(instances);
    } catch (error) {
      console.error("Erro ao buscar instâncias:", error);
      setIsConfigured(false);
      setShowConfig(true);
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao buscar instâncias"
      );
    }
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  useEffect(() => {
    let filtered = instances;

    if (searchTerm) {
      filtered = filtered.filter(
        (instance) =>
          instance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          instance.id
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "ONLINE") {
      filtered = filtered.filter(
        (instance) => instance.connectionStatus === statusFilter
      );
    }

    setFilteredInstances(filtered);
  }, [instances, searchTerm, statusFilter]);

  const handleConnect = () => {
    if (apiUrl && apiKey) {
      console.log("apiUrl", apiUrl);
      console.log("apiKey", apiKey);
      SetDataApiStorage(apiUrl, apiKey);
      setIsConfigured(true);
      setShowConfig(false);
    }
  };

  const handleInstanceAction = (
    instanceId: number,
    action: "start" | "stop" | "delete"
  ) => {
    setInstances((prev) =>
      prev.map((instance) => {
        if (instance.id === instanceId) {
          if (action === "start") {
            return { ...instance, status: "connecting" as const };
          } else if (action === "stop") {
            return { ...instance, status: "disconnected" as const };
          }
        }
        return instance;
      })
    );

    if (action === "delete") {
      setInstances((prev) =>
        prev.filter((instance) => instance.id !== instanceId)
      );
    }
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold text-white">
              Configuração da API
            </h1>
            <p className="text-gray-400">
              Configure a URL e chave da API para continuar
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiUrl" className="text-white">
                URL da API
              </Label>
              <Input
                id="apiUrl"
                placeholder="https://api.exemplo.com"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-white">
                Chave da API
              </Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Sua chave da API"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Button
              onClick={handleConnect}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!apiUrl || !apiKey}
            >
              Conectar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white w-full h-full">
      <div className="flex">
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Instâncias</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {filteredInstances.length} / {instances.length}
              </span>
              <Dialog open={showConfig} onOpenChange={setShowConfig}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configurar
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Configurações da API
                    </DialogTitle>
                  </DialogHeader>
                  {errorMessage && (
                    <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-3 rounded-md text-sm mb-4">
                      {errorMessage}
                    </div>
                  )}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newApiUrl" className="text-white">
                        URL da API
                      </Label>
                      <Input
                        id="newApiUrl"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newApiKey" className="text-white">
                        Chave da API
                      </Label>
                      <Input
                        id="newApiKey"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <Button
                      onClick={() => setShowConfig(false)}
                      className="w-full"
                    >
                      Salvar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Instância
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="ONLINE" className="text-white">
                  Todos os status
                </SelectItem>
                <SelectItem value="ONLINE" className="text-white">
                  Conectado
                </SelectItem>
                <SelectItem value="OFFLINE" className="text-white">
                  Desconectado
                </SelectItem>
                <SelectItem value="ERROR" className="text-white">
                  Erro
                </SelectItem>
                <SelectItem value="CONNECTING" className="text-white">
                  Conectando
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Instances Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredInstances.map((instance) => {
              const statusInfo =
                statusConfig[
                  instance.connectionStatus as keyof typeof statusConfig
                ];

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
                          <h3 className="font-medium text-white truncate max-w-32">
                            {instance.name}
                          </h3>
                          <p className="text-xs text-gray-400 truncate max-w-32">
                            {instance.id}
                          </p>
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
                          {instance.createdAt}
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
                            instance.connectionStatus === "ONLINE"
                              ? "stop"
                              : "start"
                          )
                        }
                      >
                        {instance.connectionStatus === "ONLINE" ? (
                          <Square className="w-3 h-3 mr-1" />
                        ) : (
                          <Play className="w-3 h-3 mr-1" />
                        )}
                        {instance.connectionStatus === "ONLINE"
                          ? "Parar"
                          : "Iniciar"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        onClick={() =>
                          handleInstanceAction(instance.id, "delete")
                        }
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredInstances.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Nenhuma instância encontrada
              </h3>
              <p className="text-gray-400 mb-4">
                {searchTerm || statusFilter !== "ONLINE"
                  ? "Tente ajustar os filtros de busca"
                  : "Crie sua primeira instância para começar"}
              </p>
              {!searchTerm && statusFilter === "ONLINE" && (
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Instância
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
