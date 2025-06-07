export const SetDataApiStorage = async (apiKey: string) => {
  localStorage.setItem("apiKey", apiKey);
};

export const GetDataApiStorage = async () => {
  const apiKey = localStorage.getItem("apiKey");
  return { apiKey };
};

export const GetAllInstances = async () => {
  const { apiKey } = await GetDataApiStorage();
  if (!apiKey) {
    throw new Error("Credenciais da API não encontradas");
  }

  try {
    // Usando o proxy configurado no Vite
    const response = await fetch(`/api/instance/fetchInstances`, {
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Erro na API: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar instâncias:", error);
    throw error;
  }
};
