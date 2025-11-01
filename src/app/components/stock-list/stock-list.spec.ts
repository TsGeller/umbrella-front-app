import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockList } from './stock-list.component';

describe('StockList', () => {
  let component: StockList;
  let fixture: ComponentFixture<StockList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
