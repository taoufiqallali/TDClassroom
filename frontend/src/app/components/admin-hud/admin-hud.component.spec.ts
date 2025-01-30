import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHUDComponent } from './admin-hud.component';

describe('AdminHUDComponent', () => {
  let component: AdminHUDComponent;
  let fixture: ComponentFixture<AdminHUDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHUDComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
