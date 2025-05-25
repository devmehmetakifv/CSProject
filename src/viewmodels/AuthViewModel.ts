import { makeAutoObservable } from 'mobx';
import { User } from '../models/User';
import { AuthService } from '../services/AuthService';

export class AuthViewModel {
  private authService: AuthService;
  user: User | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.authService = new AuthService();
  }

  async login(email: string, password: string) {
    try {
      this.loading = true;
      this.error = null;
      this.user = await this.authService.login(email, password);
    } catch (error) {
      this.error = (error as Error).message;
    } finally {
      this.loading = false;
    }
  }

  async register(email: string, password: string, displayName: string, userType: User['userType']) {
    try {
      this.loading = true;
      this.error = null;
      this.user = await this.authService.register(email, password, displayName, userType);
    } catch (error) {
      this.error = (error as Error).message;
    } finally {
      this.loading = false;
    }
  }

  async logout() {
    try {
      this.loading = true;
      this.error = null;
      await this.authService.logout();
      this.user = null;
    } catch (error) {
      this.error = (error as Error).message;
    } finally {
      this.loading = false;
    }
  }

  setUser(user: User | null) {
    this.user = user;
  }

  clearError() {
    this.error = null;
  }
} 