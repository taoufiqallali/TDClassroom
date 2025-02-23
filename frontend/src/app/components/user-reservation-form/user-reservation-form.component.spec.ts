import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReservationFormComponent } from './user-reservation-form.component';

describe('UserReservationFormComponent', () => {
  let component: UserReservationFormComponent;
  let fixture: ComponentFixture<UserReservationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserReservationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserReservationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
