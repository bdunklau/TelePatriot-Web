import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { createLocalTracks, LocalTrack, LocalVideoTrack } from 'twilio-video';
import { LogService } from '../log/log.service';


@Component({
    selector: 'app-camera',
    styleUrls: ['./camera.component.css'],
    templateUrl: './camera.component.html',
})
export class CameraComponent implements AfterViewInit {

    // https://stackoverflow.com/a/56752507
    // query results available in ngOnInit
    @ViewChild('preview', {static: false}) previewElement: ElementRef;

    get tracks(): LocalTrack[] {
        return this.localTracks;
    }

    isInitializing: boolean = true;
    deviceInfo: MediaDeviceInfo;

    videoTrack: LocalVideoTrack;
    localTracks: LocalTrack[] = [];

    constructor(private log: LogService,
        private readonly renderer: Renderer2) { }

    async ngAfterViewInit() {
        this.d('ngAfterViewInit(): this.previewElement && this.previewElement.nativeElement = '+(this.previewElement && this.previewElement.nativeElement));
        if (this.previewElement && this.previewElement.nativeElement) {
            await this.initializeDevice();
        }
    }

    initializePreview(deviceInfo?: MediaDeviceInfo) {
        this.d('initializePreview(): deviceInfo='+deviceInfo);
        this.deviceInfo = deviceInfo;
        if (deviceInfo) {
            this.initializeDevice(deviceInfo.kind, deviceInfo.deviceId);
        } else {
            this.initializeDevice();
        }
    }

    getDeviceInfo() {
        return this.deviceInfo;
    }

    finalizePreview() {
        this.d('finalizePreview(): this.videoTrack='+this.videoTrack);
        try {
            if (this.videoTrack) {
                this.d('finalizePreview(): this.videoTrack.detach()');
                this.videoTrack.detach().forEach(element => {
                    this.d('finalizePreview(): element.remove()')
                    element.remove()
                  }
                );
            }
        } catch (e) {
            console.error(e);
            this.d('finalizePreview(): ERROR: '+e);
        }
    }

    // we are calling this func twice - why?
    private async initializeDevice(kind?: MediaDeviceKind, deviceId?: string) {
        this.d('initializeDevice(): kind='+kind+', deviceId='+deviceId);
        try {
            this.isInitializing = true;

            this.finalizePreview();

            this.localTracks = kind && deviceId
                ? await this.initializeTracks(kind, deviceId)
                : await this.initializeTracks();

            this.d('initializeDevice(): this.localTracks='+this.localTracks);

            this.videoTrack = this.localTracks.find(t => t.kind === 'video') as LocalVideoTrack;
            this.d('initializeDevice(): this.videoTrack='+this.videoTrack);
            const videoElement = this.videoTrack.attach();
            // console.log('videoElement = ', videoElement);
            // this.d('initializeDevice(): videoElement='+videoElement);
            // this.renderer.setStyle(videoElement, 'mute', 'true');
            this.renderer.setStyle(videoElement, 'height', '100%');
            this.renderer.setStyle(videoElement, 'width', '100%');
            this.d('initializeDevice(): this.renderer.appendChild(...) SEEN TWICE?');
            this.renderer.appendChild(this.previewElement.nativeElement, videoElement);
        } finally {
            this.isInitializing = false;
        }
    }

    private initializeTracks(kind?: MediaDeviceKind, deviceId?: string) {
        this.d('initializeTracks(): kind='+kind+', deviceId='+deviceId);
        if (kind) {
            switch (kind) {
                case 'audioinput':
                    this.d('initializeTracks(): createLocalTracks({ audio: { deviceId }, video: true });');
                    return createLocalTracks({ audio: { deviceId }, video: true });
                case 'videoinput':
                    this.d('initializeTracks(): createLocalTracks({ audio: true, video: { deviceId } });');
                    return createLocalTracks({ audio: true, video: { deviceId } });
            }
        }

        this.d('initializeTracks(): createLocalTracks({ audio: true, video: true });');
        return createLocalTracks({ audio: true, video: true });
    }


    d(msg:string) {
        this.log.d('CameraComponent: '+msg);
    }
}
