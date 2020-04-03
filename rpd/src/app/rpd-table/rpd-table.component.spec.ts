import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpdTableComponent } from './rpd-table.component';

describe('RpdTableComponent', () => {
  let component: RpdTableComponent;
  let fixture: ComponentFixture<RpdTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpdTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpdTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
