import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsModifyComponent } from './ads-modify.component';

describe('AdsModifyComponent', () => {
  let component: AdsModifyComponent;
  let fixture: ComponentFixture<AdsModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
