import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute } from '@angular/router';
import { Member, Photo } from '../../../types/member';
import { ImageUpload } from "../../../shared/image-upload/image-upload";
import { AccountService } from '../../../core/services/account-service';
import { User } from '../../../types/user';
import { StarButton } from "../../../shared/star-button/star-button";
import { DeleteButton } from "../../../shared/delete-button/delete-button";

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  protected photos = signal(<Photo[]>[]);
  protected loading = signal(false);
  protected accountService = inject(AccountService);
  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.memberService.getMemberPhotos(memberId).subscribe(photos => this.photos.set(photos));

    }
  }

  onUploadImage(file :File){
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: (photo) => {
        this.memberService.editMode.set(false);
        this.photos.update(photos => [...photos, photo]);
        this.loading.set(false);
      },
      error: (e) => {
        console.log(e);
        
        this.loading.set(false);
      }
    });
  }

  setMainPhoto(photoId: Photo){
    this.memberService.setMainPhoto(photoId).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser ) currentUser.imageUrl = photoId.url;
        this.accountService.setCurrentUser(currentUser as User);
        this.memberService.member.update(member => ({
          ...member,
          imageUrl: photoId.url
        }) as Member)
      }
    });
    
  }

  deletePhoto(photoId: number){
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update(photos => photos.filter(p => p.id !== photoId));
      }
    });
  }

  // get photoMocks() {
  //   return Array.from({ length: 20 }, (_, i) => ({
  //     url: '/user.png'
  //   }));
  // }
}
