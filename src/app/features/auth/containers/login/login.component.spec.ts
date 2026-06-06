import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthFacadeService } from '../../../../core/services/auth-facade.service';

describe('LoginComponent', () => {
  let mockAuthFacade: any;

  beforeEach(async () => {
    mockAuthFacade = { login: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: AuthFacadeService, useValue: mockAuthFacade },
        provideRouter([{ path: 'dashboard', component: LoginComponent }]),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    expect(fixture.componentInstance.loginForm.valid).toBe(false);
  });

  it('should require valid email', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const form = fixture.componentInstance.loginForm;
    form.controls.email.setValue('invalid');
    expect(form.controls.email.valid).toBe(false);
    form.controls.email.setValue('test@example.com');
    expect(form.controls.email.valid).toBe(true);
  });

  it('should require password', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const form = fixture.componentInstance.loginForm;
    form.controls.password.setValue('');
    expect(form.controls.password.valid).toBe(false);
    form.controls.password.setValue('pass');
    expect(form.controls.password.valid).toBe(true);
  });

  it('should not call login when form is invalid', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.componentInstance.onSubmit();
    expect(mockAuthFacade.login).not.toHaveBeenCalled();
  });

  it('should call login and navigate on success', () => {
    mockAuthFacade.login.mockReturnValue(of({}));
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;
    comp.loginForm.controls.email.setValue('a@b.com');
    comp.loginForm.controls.password.setValue('pass');
    comp.onSubmit();
    expect(mockAuthFacade.login).toHaveBeenCalledWith('a@b.com', 'pass');
  });

  it('should alert on error', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    mockAuthFacade.login.mockReturnValue(throwError(() => ({ error: { message: 'Invalid' } })));
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;
    comp.loginForm.controls.email.setValue('a@b.com');
    comp.loginForm.controls.password.setValue('pass');
    comp.onSubmit();
    expect(alertSpy).toHaveBeenCalledWith('Invalid');
    alertSpy.mockRestore();
  });
});
