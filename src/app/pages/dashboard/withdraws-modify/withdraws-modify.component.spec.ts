import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawsModifyComponent } from './withdraws-modify.component';

describe('WithdrawsModifyComponent', () => {
  let component: WithdrawsModifyComponent;
  let fixture: ComponentFixture<WithdrawsModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawsModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawsModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
