import { AuthViewModel } from '../viewmodels/AuthViewModel';
import { JobViewModel } from '../viewmodels/JobViewModel';
import { NotificationViewModel } from '../viewmodels/NotificationViewModel';
import { FavoriteViewModel } from '../viewmodels/FavoriteViewModel';

export class Store {
  authViewModel: AuthViewModel;
  jobViewModel: JobViewModel;
  notificationViewModel: NotificationViewModel;
  favoriteViewModel: FavoriteViewModel;

  constructor() {
    this.authViewModel = new AuthViewModel();
    this.jobViewModel = new JobViewModel();
    this.notificationViewModel = new NotificationViewModel();
    this.favoriteViewModel = new FavoriteViewModel();
  }
}

export const store = new Store(); 