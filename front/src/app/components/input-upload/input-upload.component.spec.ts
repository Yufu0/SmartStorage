import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputUploadComponent } from './input-upload.component';

describe('InputUploadComponent', () => {
  let component: InputUploadComponent;
  let fixture: ComponentFixture<InputUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
