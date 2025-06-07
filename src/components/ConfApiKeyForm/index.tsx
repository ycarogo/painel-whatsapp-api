import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const ConfApiKeyForm = ({
  apiKey,
  setApiKey,
  handleConnect,
}: {
  apiKey: string;
  setApiKey: (apiKey: string) => void;
  handleConnect: () => void;
}) => {
  return (
    <>
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
        disabled={!apiKey}
      >
        Conectar
      </Button>
    </>
  );
};
