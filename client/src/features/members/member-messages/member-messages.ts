import { PresenceService } from './../../../core/services/presence-service';
import { Component, effect, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MessageService } from '../../../core/services/message-service';
import { MemberService } from '../../../core/services/member-service';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-messages',
  imports: [DatePipe, TimeAgoPipe, FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css',
})
export class MemberMessages implements OnInit, OnDestroy {

  protected messageService = inject(MessageService)
  private memberService = inject(MemberService)
  protected presenceService = inject(PresenceService)
  private route = inject(ActivatedRoute)
  protected messageContent = '';
  @ViewChild('messageEndRef') messageEndRef!: ElementRef;

  constructor() {
    effect(() => {
      const currentMessages = this.messageService.messageThread()
      if (currentMessages.length) {
        this.scrollToBottom()
      }
    })
  }


  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe({
      next: params => {
        const otherUserId = params.get('id')
        if (!otherUserId) throw new Error('Cannot connect to hub')

        this.messageService.createHubConneciton(otherUserId);
      }
    })
  }


  sendMessage() {
    const recipientId = this.memberService.member()?.id
    if (!recipientId) return
    this.messageService.sendMessage(recipientId, this.messageContent)?.then(() => {
      this.messageContent = '';
    })
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messageEndRef) {
        this.messageEndRef.nativeElement.scrollIntoView({ behaviour: 'smooth' })
      }
    });
  }

    ngOnDestroy(): void {
      this.messageService.stopHubConnection();
    }
}
