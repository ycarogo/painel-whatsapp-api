import { Component } from '@angular/core';
import { WhatsappApiService } from 'src/app/services/whatsapp-api.service';

@Component({
  selector: 'app-list-instances',
  templateUrl: './list-instances.component.html',
  styleUrls: ['./list-instances.component.scss']
})
export class ListInstancesComponent {
    title = 'Instancias';
    instances: any[] = [];
    filteredInstances: any[] = [];
    searchTerm = '';
    selectedFilter = 'all';

    constructor(private whatsappApiService: WhatsappApiService) {}

    ngOnInit(): void {
        this.loadInstances();
    }

    loadInstances(): void {
        this.whatsappApiService.getInstances().subscribe(
            (response) => {
                console.log('Instâncias carregadas:', response);
                this.instances = response.instances || []; // Ajuste conforme a estrutura da resposta da API
                this.filterInstances();
            },
            (error) => {
                console.error('Erro ao carregar instâncias:', error);
            }
        );
    }

    filterInstances(): void {
        let tempInstances = [...this.instances];

        if (this.selectedFilter !== 'all') {
            tempInstances = tempInstances.filter(instance => instance.status === this.selectedFilter);
        }

        if (this.searchTerm) {
            tempInstances = tempInstances.filter(instance =>
                instance.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                instance.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        this.filteredInstances = tempInstances;
    }
}
