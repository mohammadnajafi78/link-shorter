import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationModifyComponent } from './notification-modify.component';

describe('NotificationModifyComponent', () => {
  let component: NotificationModifyComponent;
  let fixture: ComponentFixture<NotificationModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
