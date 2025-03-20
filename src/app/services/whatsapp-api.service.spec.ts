import { TestBed } from '@angular/core/testing';

import { WhatsappApiService } from './whatsapp-api.service';

describe('WhatsappApiService', () => {
  let service: WhatsappApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhatsappApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
