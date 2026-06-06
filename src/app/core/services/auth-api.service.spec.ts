import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthApiService } from './auth-api.service';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/user.model';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send a POST request to /auth/login with email and password', () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockResponse: AuthResponse = {
        message: 'Login successful',
        user: { id: 1, email, isAdmin: false },
      };

      service.login(email, password).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email, password });
      req.flush(mockResponse);
    });
  });

  describe('signup', () => {
    it('should send a POST request to /auth/signup with email and password', () => {
      const email = 'new@example.com';
      const password = 'secret';

      service.signup(email, password).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/signup`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email, password });
      req.flush({});
    });
  });

  describe('logout', () => {
    it('should send a POST request to /auth/logout with empty body', () => {
      service.logout().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush({});
    });
  });
});
