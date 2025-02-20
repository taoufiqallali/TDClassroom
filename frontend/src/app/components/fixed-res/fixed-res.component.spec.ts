import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedResComponent } from './fixed-res.component';

describe('FixedResComponent', () => {
  let component: FixedResComponent;
  let fixture: ComponentFixture<FixedResComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedResComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedResComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
