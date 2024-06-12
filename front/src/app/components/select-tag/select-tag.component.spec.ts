import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTagComponent } from './select-tag.component';

describe('SelectTagComponent', () => {
  let component: SelectTagComponent;
  let fixture: ComponentFixture<SelectTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectTagComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
