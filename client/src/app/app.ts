import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private http = inject(HttpClient);

  protected readonly title = 'Dating app';
  protected members = signal<any>([]);


  async ngOnInit() {
    this.members.set(await this.getMembers());
  }

  async getMembers() {
    try {
      return firstValueFrom(this.http.get('https://localhost:5001/api/members'));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

}
