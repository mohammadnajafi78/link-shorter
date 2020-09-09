import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsetComponent } from './subset.component';

describe('SubsetComponent', () => {
  let component: SubsetComponent;
  let fixture: ComponentFixture<SubsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
