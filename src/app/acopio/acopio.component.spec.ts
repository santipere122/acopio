import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcopioComponent } from './acopio.component';

describe('AcopioComponent', () => {
  let component: AcopioComponent;
  let fixture: ComponentFixture<AcopioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcopioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcopioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
