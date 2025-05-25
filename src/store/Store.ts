import { AuthViewModel } from '../viewmodels/AuthViewModel';
import { JobViewModel } from '../viewmodels/JobViewModel';
import { NotificationViewModel } from '../viewmodels/NotificationViewModel';
import { FavoriteViewModel } from '../viewmodels/FavoriteViewModel';
import { NotificationService } from '../services/NotificationService';
import { FavoriteService } from '../services/FavoriteService';

export class Store {
  authViewModel: AuthViewModel;
  jobViewModel: JobViewModel;
  notificationViewModel: NotificationViewModel;
  favoriteViewModel: FavoriteViewModel;

  constructor() {
    const notificationService = new NotificationService();
    const favoriteService = new FavoriteService();
    
    this.authViewModel = new AuthViewModel();
    this.jobViewModel = new JobViewModel();
    this.notificationViewModel = new NotificationViewModel(notificationService);
    this.favoriteViewModel = new FavoriteViewModel(favoriteService);
  }

  // Admin için bildirimleri devre dışı bırakan yardımcı metot
  isNotificationEnabledForUser(userType?: string): boolean {
    return userType !== 'admin';
  }
}

export const store = new Store(); 