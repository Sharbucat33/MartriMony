import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import MicrophonePlugin from 'wavesurfer.js/src/plugin/microphone';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnDestroy, AfterViewInit {
  isRecording = false;
  audioUrl: string | null = null;
  mediaRecorder!: MediaRecorder;
  audioChunks: Blob[] = [];
  timer = 0;
  maxDuration = 30;
  intervalId: any;
  wavesurfer!: WaveSurfer;
  currentTime = 0;
  audio!: HTMLAudioElement;
  stopPlaying = false;
  isplaying = false;
  recordedAudioDuration = 30;
  // dummyWaveBars = [30, 45, 60, 45, 30, 45, 60, 45, 30];  // dummy waves on inital load

  ngAfterViewInit() {
    this.initWaveSurfer();
  }

  /**
   * @method initWaveSurfer
   * @description initalize the wavesurfer to use
   */
  initWaveSurfer() {
    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: '#bbb',
      progressColor: '#c2185b',
      height: 48,
      responsive: true,
      barWidth: 3,
      barRadius: 4,
      barHeight: 7,
      cursorWidth: 0,
      // microphoneplugin is used to dynamically populate the waves while recording
      plugins: [MicrophonePlugin.create({})],
    });

    this.wavesurfer.on('audioprocess', (time: number) => {
      this.currentTime = Math.floor(time);
      // to get the recorded audio duration
      this.recordedAudioDuration = this.wavesurfer.getDuration();
    });

    // Also update when user seeks
    this.wavesurfer.on('seek', () => {
      this.currentTime = Math.floor(this.wavesurfer.getCurrentTime());
    });

    // Reset timer when playback ends
    this.wavesurfer.on('finish', () => {
      this.currentTime = 0;
      this.isplaying = false;
    });
  }

  /**
   * @method startRecording()
   * @description used to initalize and load the audio turn the microphone
   */
  async startRecording() {
    this.audioChunks = [];
    this.timer = 0;
    this.isRecording = true;
    this.audioUrl = null;
    this.wavesurfer.empty();
    this.wavesurfer.microphone.start();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      this.audioUrl = URL.createObjectURL(audioBlob);
      this.audio = new Audio(this.audioUrl);
      this.isRecording = false;
      stream.getTracks().forEach((track) => track.stop());
      this.wavesurfer.load(this.audioUrl!);
    };
    this.mediaRecorder.start();
    this.intervalId = setInterval(() => {
      this.timer++;
      if (this.timer >= this.maxDuration) {
        this.stopRecording();
        this.recordedAudioDuration = 30;
      }
    }, 1000);
  }

  /**
   * @method stopRecording()
   * @description used to stop recording during recording the audio
   */
  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.stopPlaying = true;
      this.mediaRecorder.stop();
      clearInterval(this.intervalId);
      this.wavesurfer.microphone.stop();
    }
  }

  /**
   * @method playAudio()
   * @description this method is used to play or pause the audio after recorded and update the time accordingly
   */
  playAudio() {
    if (this.audioUrl) {
      this.wavesurfer.playPause();
      this.audio.ontimeupdate = () => {
        this.timer = Math.floor(this.audio.currentTime);
      };
      this.isplaying = this.wavesurfer?.isPlaying();

      this.wavesurfer.on('audioprocess', (time: number) => {
        this.currentTime = Math.floor(time);
      });
      this.audio.onended = () => {
        this.isplaying = false;
        this.stopPlaying = false;
      };
    }
  }

  /**
   * @method reset()
   * @description used to reset the microphone, audio, waves, variable set to false
   */
  reset() {
    this.audioUrl = null;
    this.timer = 0;
    this.recordedAudioDuration = 30;
    this.wavesurfer.empty();
    this.stopPlaying = false;
    if (this.wavesurfer.microphone) {
      this.wavesurfer.microphone.stop();
    }
    // this.wavesurfer?.destroy();
    this.audioChunks = [];
    this.isplaying = false;
  }

  /**
   * @method submit()
   */
  submit() {
    // Handle submit logic here
    alert('Audio submitted!');
  }

  /**
   * @method formattedTimer()
   * @description to dynamically run the timer during voice recording
   */
  get formattedTimer(): string {
    const time = this.isRecording ? this.timer : this.currentTime;
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  /**
   * @method formattedAudioDuration
   * @description after recording to show the actual recorded duration in the UI
   */
  get formattedAudioDuration(): string {
    const min = Math.floor(this.recordedAudioDuration / 60);
    const sec = Math.floor(this.recordedAudioDuration % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  /**
   * @method OnDestroy()
   * @description to clear the timeout and destory the waves
   */
  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
    }
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
    }
  }
}
