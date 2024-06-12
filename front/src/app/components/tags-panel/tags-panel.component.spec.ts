import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsPanelComponent } from './tags-panel.component';

describe('TagsPanelComponent', () => {
  let component: TagsPanelComponent;
  let fixture: ComponentFixture<TagsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagsPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TagsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
