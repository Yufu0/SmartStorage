import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderRagComponent } from './slider-rag.component';

describe('SliderRagComponent', () => {
  let component: SliderRagComponent;
  let fixture: ComponentFixture<SliderRagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderRagComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SliderRagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
