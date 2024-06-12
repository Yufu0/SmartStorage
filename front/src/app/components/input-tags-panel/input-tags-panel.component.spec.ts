import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTagsPanelComponent } from './input-tags-panel.component';

describe('InputTagsPanelComponent', () => {
  let component: InputTagsPanelComponent;
  let fixture: ComponentFixture<InputTagsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTagsPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputTagsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
