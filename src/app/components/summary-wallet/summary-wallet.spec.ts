import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { SummaryWallet } from './summary-wallet.component';
import { PortfolioService } from '../../services/portfolio';
import { AuthService } from '../../services/auth.service';

describe('SummaryWallet', () => {
  let component: SummaryWallet;
  let fixture: ComponentFixture<SummaryWallet>;

  beforeEach(async () => {
    const portfolioServiceStub = {
      getPortfolio: jasmine.createSpy('getPortfolio').and.returnValue(of({ data: [] })),
      getPortfolioUsers: jasmine.createSpy('getPortfolioUsers').and.returnValue(of(null)),
      getValueForUser: jasmine.createSpy('getValueForUser').and.returnValue(of({ data: [] })),
    };

    const authServiceStub = {
      getCurrentUsername: jasmine.createSpy('getCurrentUsername').and.returnValue(null),
    };

    await TestBed.configureTestingModule({
      imports: [SummaryWallet],
      providers: [
        { provide: PortfolioService, useValue: portfolioServiceStub },
        { provide: AuthService, useValue: authServiceStub },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryWallet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
