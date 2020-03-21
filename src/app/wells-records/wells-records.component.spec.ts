import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WellsRecordsComponent } from './wells-records.component';

describe('WellsRecordsComponent', () => {
  let component: WellsRecordsComponent;
  let fixture: ComponentFixture<WellsRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WellsRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WellsRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
