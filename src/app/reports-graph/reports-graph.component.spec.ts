import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsGraphComponent } from './reports-graph.component';

describe('ReportsGraphComponent', () => {
  let component: ReportsGraphComponent;
  let fixture: ComponentFixture<ReportsGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
