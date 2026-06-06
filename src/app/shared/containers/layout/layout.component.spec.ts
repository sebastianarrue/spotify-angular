import { TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { provideRouter } from '@angular/router';

describe('LayoutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
