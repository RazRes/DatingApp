import { PaginationResult } from './../../types/pagination';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { EditableMemeber, Member, MemberParams, Photo } from '../../types/member';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {

  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  public editMode = signal(false);

  member = signal<Member | null>(null);

  getMembers(memberParams: MemberParams) {
    let params = new HttpParams();

    params = params.set('pageNumber', memberParams.pageNumber.toString());
    params = params.set('pageSize', memberParams.pageSize.toString());
    params = params.set('minAge', memberParams.minAge.toString());
    params = params.set('maxAge', memberParams.maxAge.toString());
    params = params.set('orderby', memberParams.orderBy.toString());
    if (memberParams.gender) params = params.set('gender', memberParams.gender.toString());

    return this.http.get<PaginationResult<Member>>(
      this.baseUrl + 'members',
      { params }
    ).pipe(
      tap(() => {
        localStorage.setItem('filters', JSON.stringify(memberParams))
      })
    );
  }


  getMember(id: string) {
    return this.http.get<Member>(this.baseUrl + 'members/' + id).pipe(
      tap(member => this.member.set(member))
    );
  }

  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos');
  }

  updateMember(member: EditableMemeber) {
    return this.http.put(this.baseUrl + 'members', member);
  }

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Photo>(this.baseUrl + 'members/add-photo', formData);
  }

  setMainPhoto(photoId: Photo) {
    return this.http.put(this.baseUrl + 'members/set-main-photo/' + photoId.id, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'members/delete-photo/' + photoId);
  }
}
