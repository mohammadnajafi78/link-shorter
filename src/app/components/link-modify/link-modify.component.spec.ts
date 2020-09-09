import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkModifyComponent } from './link-modify.component';

describe('LinkModifyComponent', () => {
  let component: LinkModifyComponent;
  let fixture: ComponentFixture<LinkModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
