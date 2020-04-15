import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewRpdComponent } from './add-new-rpd.component';

describe('AddNewRpdComponent', () => {
  let component: AddNewRpdComponent;
  let fixture: ComponentFixture<AddNewRpdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewRpdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewRpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
