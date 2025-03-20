import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WhatsappApiService {
    private baseUrl = environment.apiUrl; 
    private apikey =  environment.apikey;
    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'apikey': `${this.apikey}`,
            'Accept': 'application/json'
        });
    }

    // --- Rotas de Instâncias ---

    // Criar uma nova instância
    createInstance(): Observable<any> {
        const url = `${this.baseUrl}/instances`;
        return this.http.post(url, {}, { headers: this.getHeaders() });
    }

    // Listar todas as instâncias
    getInstances(): Observable<any> {
        const url = `${this.baseUrl}/instance/fetchInstances`;
        return this.http.get(url, { headers: this.getHeaders() });
    }

    // Obter detalhes de uma instância específica
    getInstance(instanceId: string): Observable<any> {
        const url = `${this.baseUrl}/instances/${instanceId}`;
        return this.http.get(url, { headers: this.getHeaders() });
    }

    // Deletar uma instância
    deleteInstance(instanceId: string): Observable<any> {
        const url = `${this.baseUrl}/instances/${instanceId}`;
        return this.http.delete(url, { headers: this.getHeaders() });
    }

    // --- Rotas de Conexão ---

    // Obter QR Code para conexão
    getQrCode(instanceId: string): Observable<any> {
        const url = `${this.baseUrl}/instances/${instanceId}/client/qrcode`;
        return this.http.get(url, { headers: this.getHeaders() });
    }

    // Verificar status da conexão
    getConnectionStatus(instanceId: string): Observable<any> {
        const url = `${this.baseUrl}/instances/${instanceId}/client/status`;
        return this.http.get(url, { headers: this.getHeaders() });
    }

    // --- Rotas de Mensagens ---

    // Enviar uma mensagem
    sendMessage(instanceId: string, chatId: string, message: string): Observable<any> {
        const url = `${this.baseUrl}/instances/${instanceId}/client/action/send-message`;
        const body = { chatId, message };
        return this.http.post(url, body, { headers: this.getHeaders() });
    }

    // --- Rotas de Webhook ---

    // Configurar um webhook
    setWebhook(instanceId: string, webhookUrl: string): Observable<any> {
        const url = `${this.baseUrl}/instances/${instanceId}/client/webhook`;
        const body = { url: webhookUrl };
        return this.http.post(url, body, { headers: this.getHeaders() });
    }

    // Obter configuração atual do webhook
    getWebhook(instanceId: string): Observable<any> {
        const url = `${this.baseUrl}/instances/${instanceId}/client/webhook`;
        return this.http.get(url, { headers: this.getHeaders() });
    }

    // --- Rotas de Eventos (Exemplo) ---

    // Exemplo de evento: Receber mensagens (via webhook, simulado aqui)
    simulateWebhookEvent(instanceId: string): Observable<any> {
        const url = `${this.baseUrl}/instances/${instanceId}/client/events`;
        return this.http.get(url, { headers: this.getHeaders() });
    }
}