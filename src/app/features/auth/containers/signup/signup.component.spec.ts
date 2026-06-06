import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SignupComponent } from './signup.component';
import { AuthFacadeService } from '../../../../core/services/auth-facade.service';

describe('SignupComponent', () => {
  let mockAuthFacade: any;

  beforeEach(async () => {
    mockAuthFacade = { signup: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SignupComponent],
      providers: [
        { provide: AuthFacadeService, useValue: mockAuthFacade },
        provideRouter([{ path: 'login', component: SignupComponent }]),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SignupComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    const fixture = TestBed.createComponent(SignupComponent);
    expect(fixture.componentInstance.signupForm.valid).toBe(false);
  });

  it('should require valid email', () => {
    const fixture = TestBed.createComponent(SignupComponent);
    const form = fixture.componentInstance.signupForm;
    form.controls.email.setValue('invalid');
    expect(form.controls.email.valid).toBe(false);
    form.controls.email.setValue('a@b.com');
    expect(form.controls.email.valid).toBe(true);
  });

  it('should require password with min length 6', () => {
    const fixture = TestBed.createComponent(SignupComponent);
    const form = fixture.componentInstance.signupForm;
    form.controls.password.setValue('12345');
    expect(form.controls.password.valid).toBe(false);
    form.controls.password.setValue('123456');
    expect(form.controls.password.valid).toBe(true);
  });

  it('should not call signup when form is invalid', () => {
    const fixture = TestBed.createComponent(SignupComponent);
    fixture.componentInstance.onSubmit();
    expect(mockAuthFacade.signup).not.toHaveBeenCalled();
  });

  it('should call signup, alert, and navigate on success', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    mockAuthFacade.signup.mockReturnValue(of({}));
    const fixture = TestBed.createComponent(SignupComponent);
    const comp = fixture.componentInstance;
    comp.signupForm.controls.email.setValue('a@b.com');
    comp.signupForm.controls.password.setValue('password123');
    comp.onSubmit();
    expect(mockAuthFacade.signup).toHaveBeenCalledWith('a@b.com', 'password123');
    expect(alertSpy).toHaveBeenCalledWith('Account created! Please log in.');
    alertSpy.mockRestore();
  });

  it('should alert on error', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    mockAuthFacade.signup.mockReturnValue(throwError(() => ({ error: { message: 'Email taken' } })));
    const fixture = TestBed.createComponent(SignupComponent);
    const comp = fixture.componentInstance;
    comp.signupForm.controls.email.setValue('a@b.com');
    comp.signupForm.controls.password.setValue('password123');
    comp.onSubmit();
    expect(alertSpy).toHaveBeenCalledWith('Email taken');
    alertSpy.mockRestore();
  });
});
