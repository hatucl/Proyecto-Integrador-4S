import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentsDashboard } from './agents-dashboard';

describe('AgentsDashboard', () => {
  let component: AgentsDashboard;
  let fixture: ComponentFixture<AgentsDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentsDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentsDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
