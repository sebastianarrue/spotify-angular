import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthFacadeService } from './auth-facade.service';
import { AuthApiService } from './auth-api.service';
import { Router } from '@angular/router';

describe('AuthFacadeService', () => {
  let mockApi: any;
  let mockRouter: any;

  beforeEach(() => {
    mockApi = {
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
    };
    mockRouter = { navigate: vi.fn() };
    localStorage.clear();
  });

  function createService() {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthApiService, useValue: mockApi },
        { provide: Router, useValue: mockRouter },
        AuthFacadeService,
      ],
    });
    return TestBed.inject(AuthFacadeService);
  }

  it('should be created', () => {
    const service = createService();
    expect(service).toBeTruthy();
  });

  it('should have null currentUser when no localStorage', () => {
    const service = createService();
    expect(service.currentUser()).toBeNull();
  });

  it('should load user from localStorage', () => {
    const user = { id: 1, email: 'test@test.com', isAdmin: false };
    localStorage.setItem('spotify_user', JSON.stringify(user));
    const service = createService();
    expect(service.currentUser()).toEqual(user);
  });

  it('should handle invalid JSON gracefully', () => {
    localStorage.setItem('spotify_user', 'not-json');
    const service = createService();
    expect(service.currentUser()).toBeNull();
    expect(localStorage.getItem('spotify_user')).toBeNull();
  });

  describe('login', () => {
    it('should store user and update signal', () => {
      const service = createService();
      const user = { id: 1, email: 'a@b.com', isAdmin: false };
      mockApi.login.mockReturnValue(of({ message: 'ok', user }));

      service.login('a@b.com', 'pass').subscribe();
      expect(mockApi.login).toHaveBeenCalledWith('a@b.com', 'pass');
      expect(localStorage.getItem('spotify_user')).toBe(JSON.stringify(user));
      expect(service.currentUser()).toEqual(user);
    });
  });

  describe('signup', () => {
    it('should delegate to api', () => {
      const service = createService();
      mockApi.signup.mockReturnValue(of({ message: 'created' }));
      service.signup('a@b.com', 'pass').subscribe(res => {
        expect(res).toEqual({ message: 'created' });
      });
      expect(mockApi.signup).toHaveBeenCalledWith('a@b.com', 'pass');
    });
  });

  describe('logout', () => {
    it('should clear user and navigate to login', () => {
      const service = createService();
      localStorage.setItem('spotify_user', JSON.stringify({ id: 1, email: 'a@b.com', isAdmin: false }));
      mockApi.logout.mockReturnValue(of({}));

      service.logout().subscribe();
      expect(mockApi.logout).toHaveBeenCalled();
      expect(localStorage.getItem('spotify_user')).toBeNull();
      expect(service.currentUser()).toBeNull();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
