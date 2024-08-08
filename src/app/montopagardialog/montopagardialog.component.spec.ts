import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MontopagardialogComponent } from './montopagardialog.component';

describe('MontopagardialogComponent', () => {
  let component: MontopagardialogComponent;
  let fixture: ComponentFixture<MontopagardialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MontopagardialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MontopagardialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
