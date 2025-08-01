import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryWallet } from './summary-wallet';

describe('SummaryWallet', () => {
  let component: SummaryWallet;
  let fixture: ComponentFixture<SummaryWallet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryWallet]
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
