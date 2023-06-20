import { NgZone, Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  subscription = new Subscription();
  done = false;
  speech: string = '';
  transcript = '';
  messages: string[] = [];
  constructor(private ngZone: NgZone) {}

  listen(locale = 'en-US'): Observable<string> {
    return new Observable((observer) => {
      const SpeechRecognition: any =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const speechRecognition: any = new SpeechRecognition();
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = locale;

      speechRecognition.onresult = (speechRecognitionEvent: any) => {
        let speech = '';

        [...speechRecognitionEvent.results].forEach((result, index) => {
          if (index >= speechRecognitionEvent.resultIndex) {
            if (result.isFinal) {
              this.done = true;
              this.ngZone.run(() => observer.next(result[0].transcript.trim()));
            } else {
              this.done = false;
              speech += result[0].transcript;
              this.ngZone.run(() => observer.next(speech.trim()));
            }
          }
        });
      };

      speechRecognition.start();

      return () => speechRecognition.abort();
    });
  }

  command(keyword: string) {
    let matched = false;
    this.subscription = this.listen().subscribe((speech) => {
      if (speech.startsWith(keyword) && this.done) {
        const msg = speech.replace(keyword, '');
        if (msg) {
          this.messages.push(msg);
          this.transcript += msg;
        } else {
          matched = true;
        }
      }
      if (matched === true && !speech.includes(keyword) && this.done) {
        this.messages.push(speech);
        this.transcript += speech;
        matched = false;
      }
      this.speech = speech;
      if (this.done) {
        const comp = this;
        setTimeout(function (): any {
          comp.speech = '';
        }, 15000);
      }
    });
  }

  record() {
    this.subscription = this.listen().subscribe((transcript) => {
      if (transcript !== '' && this.done) {
        this.transcript = this.transcript + ' ' + transcript;
      } else {
        this.speech = transcript;
      }
    });
  }

  stop() {
    this.subscription.unsubscribe();
  }
}
