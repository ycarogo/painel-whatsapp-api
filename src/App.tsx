import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Search, Settings, Plus, Database } from "lucide-react";
import type { Instance } from "./lib/utils";
import {
  GetAllInstances,
  GetDataApiStorage,
  SetDataApiStorage,
} from "./services/api";
import { InstanceCard } from "./components/InstanceCard";
import { ConfApiKeyForm } from "./components/ConfApiKeyForm";

function App() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [filteredInstances, setFilteredInstances] = useState<Instance[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("TODOS");
  const [apiKey, setApiKey] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchInstances = async () => {
    try {
      const { apiKey } = await GetDataApiStorage();

      if (!apiKey) {
        setIsConfigured(false);
        setShowConfig(true);
        setErrorMessage("Configure a chave da API para continuar");
        return;
      }
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

    if (statusFilter !== "TODOS") {
      filtered = filtered.filter(
        (instance) => instance.connectionStatus === statusFilter
      );
    }

    setFilteredInstances(filtered);
  }, [instances, searchTerm, statusFilter]);

  const handleConnect = () => {
    if (apiKey) {
      SetDataApiStorage(apiKey);
      setShowConfig(false);
      fetchInstances();
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
              Configure a chave da API para continuar
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ConfApiKeyForm
              apiKey={apiKey}
              setApiKey={setApiKey}
              handleConnect={handleConnect}
            />
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
                    <ConfApiKeyForm
                      apiKey={apiKey}
                      setApiKey={setApiKey}
                      handleConnect={handleConnect}
                    />
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
                <SelectItem value="TODOS" className="text-white">
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
              return (
                <InstanceCard
                  key={instance.id}
                  instance={instance}
                  handleInstanceAction={handleInstanceAction}
                />
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
