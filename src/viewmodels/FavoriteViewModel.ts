import { makeAutoObservable } from 'mobx';
import { FavoriteService } from '../services/FavoriteService';
import { Favorite } from '../models/Favorite';

export class FavoriteViewModel {
  favorites: Favorite[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private favoriteService: FavoriteService) {
    makeAutoObservable(this);
  }

  async fetchUserFavorites(userId: string) {
    try {
      this.loading = true;
      this.error = null;
      this.favorites = await this.favoriteService.getUserFavorites(userId);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Favoriler yüklenirken bir hata oluştu';
    } finally {
      this.loading = false;
    }
  }

  async addToFavorites(favorite: Omit<Favorite, 'id' | 'createdAt'>) {
    try {
      this.error = null;
      const newFavorite = await this.favoriteService.addToFavorites(favorite);
      this.favorites.push(newFavorite);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Favorilere eklenirken bir hata oluştu';
    }
  }

  async removeFromFavorites(favoriteId: string) {
    try {
      this.error = null;
      await this.favoriteService.removeFromFavorites(favoriteId);
      this.favorites = this.favorites.filter(f => f.id !== favoriteId);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Favorilerden çıkarılırken bir hata oluştu';
    }
  }

  async isJobFavorited(userId: string, jobId: string): Promise<boolean> {
    try {
      this.error = null;
      return await this.favoriteService.isJobFavorited(userId, jobId);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Favori durumu kontrol edilirken bir hata oluştu';
      return false;
    }
  }

  clearError() {
    this.error = null;
  }
} 