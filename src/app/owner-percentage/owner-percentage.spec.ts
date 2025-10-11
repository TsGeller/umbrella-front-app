import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerPercentage } from './owner-percentage.component';

describe('OwnerPercentage', () => {
  let component: OwnerPercentage;
  let fixture: ComponentFixture<OwnerPercentage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerPercentage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerPercentage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
