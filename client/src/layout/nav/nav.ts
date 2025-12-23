import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../theme';
import { BusyService } from '../../core/services/busy-service';
import { HasRole } from '../../shared/directive/has-role';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive, HasRole],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit {


  protected accountService = inject(AccountService);
  private toast = inject(ToastService);
  private router = inject(Router);
  protected creds: any = {};
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  protected themes = themes;
  protected busyService = inject(BusyService);


  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());

  }

  handleTheme(theme: string) {
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const elem = document.activeElement as HTMLDivElement;
    if(elem){
      elem.blur();
    }
  }

  login() {
    this.accountService.login(this.creds).subscribe({
      next: () => {
        this.creds = {}
        this.toast.success('Logged in successfully')
        this.router.navigateByUrl('/members');

      },
      error: error => {
        this.toast.error(error.error)
      }
    })
  }

  logout() {
    this.accountService.logout();
    this.toast.success('Logged out')
    this.router.navigateByUrl('/');

  }

}
