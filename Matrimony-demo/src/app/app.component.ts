import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Matrimony-demo';
  switchAudio = false;

  swtich(): void {
    this.switchAudio = !this.switchAudio;
  }
}
