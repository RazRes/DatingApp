import { LoginCreds, RegisterCreds } from './../../types/user';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../types/user';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);
  public baseUrl = environment.apiUrl;
  private likesService = inject(LikesService);

  register(creds: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + 'account/register', creds).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  public login(creds: LoginCreds) {
    return this.http.post<User>(this.baseUrl + 'account/login', creds).pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user))
    this.currentUser.set(user)
    this.likesService.getLikeIds();
  }

  public logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('filters');
    this.currentUser.set(null);
    this.likesService.likeIds.set([]);
  }

}
