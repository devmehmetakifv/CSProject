import { Favorite } from '../models/Favorite';
import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

export class FavoriteService {
  private db = getFirestore();
  private favoritesCollection = collection(this.db, 'favorites');

  async addToFavorites(favorite: Omit<Favorite, 'id' | 'createdAt'>): Promise<Favorite> {
    try {
      const docRef = await addDoc(this.favoritesCollection, {
        ...favorite,
        createdAt: new Date()
      });
      
      return {
        ...favorite,
        id: docRef.id,
        createdAt: new Date()
      };
    } catch (error) {
      throw new Error('Favorilere eklenemedi: ' + (error as Error).message);
    }
  }

  async removeFromFavorites(favoriteId: string): Promise<void> {
    try {
      const favoriteRef = doc(this.db, 'favorites', favoriteId);
      await deleteDoc(favoriteRef);
    } catch (error) {
      throw new Error('Favorilerden çıkarılamadı: ' + (error as Error).message);
    }
  }

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    try {
      if (!userId) {
        console.warn('getUserFavorites: userId boş olamaz');
        return [];
      }

      try {
        const q = query(this.favoritesCollection, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Favorite));
      } catch (firestoreError: any) {
        // İzin hatalarını özel olarak ele al
        if (firestoreError.code === 'permission-denied') {
          console.warn('Favorites koleksiyonuna erişim izni yok. Boş dizi döndürülüyor.');
          return [];
        }
        throw firestoreError;
      }
    } catch (error) {
      console.error('Favoriler getirilemedi:', error);
      throw new Error('Favoriler getirilemedi: ' + (error as Error).message);
    }
  }

  async isJobFavorited(userId: string, jobId: string): Promise<boolean> {
    try {
      if (!userId || !jobId) {
        console.warn('isJobFavorited: userId ve jobId boş olamaz');
        return false;
      }
      
      try {
        const q = query(
          this.favoritesCollection,
          where('userId', '==', userId),
          where('jobId', '==', jobId)
        );
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
      } catch (firestoreError: any) {
        // İzin hatalarını özel olarak ele al
        if (firestoreError.code === 'permission-denied') {
          console.warn('Favorites koleksiyonuna erişim izni yok. False döndürülüyor.');
          return false;
        }
        throw firestoreError;
      }
    } catch (error) {
      console.error('Favori durumu kontrol edilemedi:', error);
      throw new Error('Favori durumu kontrol edilemedi: ' + (error as Error).message);
    }
  }
} 