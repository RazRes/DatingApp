import { Component, input, output } from '@angular/core';
import { MemberService } from '../../core/services/member-service';
import { Photo } from '../../types/member';

@Component({
  selector: 'app-star-button',
  imports: [],
  templateUrl: './star-button.html',
  styleUrl: './star-button.css',
})
export class StarButton {
  
  public isDisabled = input<boolean>(false);
  public attributeFill = input<string>('currentColor');
  public textYellow = input<boolean>(false);
  public textWhite = input<boolean>(false);
  public isClicked = output<void>();

  onClick(){
    this.isClicked.emit();
  }
}
