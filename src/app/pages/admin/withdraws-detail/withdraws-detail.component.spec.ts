import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawsDetailComponent } from './withdraws-detail.component';

describe('WithdrawsDetailComponent', () => {
  let component: WithdrawsDetailComponent;
  let fixture: ComponentFixture<WithdrawsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
