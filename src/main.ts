import 'zone.js/dist/zone';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { VoiceService } from './voice.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `

    <div class="container">
      <h1>{{name}}</h1>
      <p (click)="listen()"><button (click)="listen()" class="btn btn-primary btn-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-mic"
        viewBox="0 0 16 16"
      >
        <path
          d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"
        />
        <path
          d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"
        />
      </svg>
    </button> {{description}}</p>
      <div *ngIf="voice.speech" class="alert alert-primary" role="alert">{{voice.speech}}</div>
      <textarea (click)="listen()" class="form-control" [(ngModel)]="message"></textarea>
      <pre *ngIf="voice.messages.length" class="alert alert-primary" role="alert">{{ voice.messages | json}}</pre>
    </div>
  `,
})
export class App implements OnInit, OnDestroy {
  name = 'Hey Sammy';
  description = 'Say hey Sammy followed by some words.';
  speech = '';
  transcript = '';
  get message() {
    return this.voice.messages[this.voice.messages.length - 1];
  }
  set message(msg: string) {}
  constructor(public voice: VoiceService) {}

  ngOnInit() {
    this.voice.command('hey Sammy');
  }

  ngOnDestroy() {
    this.stop();
  }

  listen() {
    this.voice.command('hey Sammy');
  }

  stop() {
    this.voice.stop();
  }
}

bootstrapApplication(App);
