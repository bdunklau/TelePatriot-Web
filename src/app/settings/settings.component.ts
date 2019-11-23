import {
    Component,
    OnInit,
    OnDestroy,
    EventEmitter,
    Input,
    Output,
    ViewChild
} from '@angular/core';
import { CameraComponent } from '../camera/camera.component';
import { DeviceSelectComponent } from './device-select/device-select.component';
import { DeviceService } from '../device/device.service';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { LogService } from '../log/log.service';

@Component({
    selector: 'app-settings',
    styleUrls: ['./settings.component.css'],
    templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, OnDestroy {
    /*private*/ devices: MediaDeviceInfo[] = [];
    private subscription: Subscription;
    private videoDeviceId: string;

    get hasAudioInputOptions(): boolean {
        return this.devices && this.devices.filter(d => d.kind === 'audioinput').length > 0;
    }
    get hasAudioOutputOptions(): boolean {
        return this.devices && this.devices.filter(d => d.kind === 'audiooutput').length > 0;
    }
    get hasVideoInputOptions(): boolean {
        return this.devices && this.devices.filter(d => d.kind === 'videoinput').length > 0;
    }

    // https://stackoverflow.com/a/56752507
    // query results available in ngOnInit
    @ViewChild('camera', {static: false}) camera: CameraComponent;
    @ViewChild('videoSelect', {static: false}) video: DeviceSelectComponent;

    @Input('isPreviewing') isPreviewing: boolean;
    @Output() settingsChanged = new EventEmitter<MediaDeviceInfo>();

    constructor(private log: LogService,
        private readonly deviceService: DeviceService) {
        console.log('SettingsComponent');
    }

    ngOnInit() {
        this.subscription =
            this.deviceService
                .$devicesUpdated
                .pipe(debounceTime(350))
                .subscribe(async deviceListPromise => {
                    this.devices = await deviceListPromise;
                    // this.devices = [InputDeviceInfo]
                    // just one element array on the MacBook
                    this.d('ngOnInit:  this.devices = '+ this.devices); // FIXME null on safari
                    this.handleDeviceAvailabilityChanges();
                });
    }

    ngOnDestroy() {
        this.d('ngOnDestroy()');
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    async onSettingsChanged(deviceInfo: MediaDeviceInfo) {
        if (this.isPreviewing) {
            this.d('onSettingsChanged(): this.isPreviewing='+this.isPreviewing);
            await this.showPreviewCamera();
        } else {
            this.d('onSettingsChanged(): this.settingsChanged.emit(deviceInfo);');
            this.settingsChanged.emit(deviceInfo);
        }
    }

    getDeviceInfo() {
        return this.camera.getDeviceInfo();
    }

    async showPreviewCamera() {
        this.d('showPreviewCamera()');
        this.isPreviewing = true;

        //   = DeviceSelectComponent   with  .localDevices = [InputDeviceInfo]
        this.d('this.video = '+ this.video);
        this.d('this.videoDeviceId = '+ this.videoDeviceId);

        if (this.videoDeviceId !== this.video.selectedId) {
            this.videoDeviceId = this.video.selectedId;
            const videoDevice = this.devices.find(d => d.deviceId === this.video.selectedId);
            await this.camera.initializePreview(videoDevice);
        }

        this.d('showPreviewCamera(): this.camera.tracks='+this.camera.tracks);
        return this.camera.tracks;
    }

    hidePreviewCamera() {
        this.d('hidePreviewCamera()');
        this.isPreviewing = false;
        this.camera.finalizePreview();
        return this.devices.find(d => d.deviceId === this.video.selectedId);
    }

    private handleDeviceAvailabilityChanges() {
        this.d('handleDeviceAvailabilityChanges(): this.devices='+this.devices+', this.video='+this.video);
        if (this.devices && this.devices.length && this.video && this.video.selectedId) {
            let videoDevice = this.devices.find(d => d.deviceId === this.video.selectedId);
            this.d('handleDeviceAvailabilityChanges(): videoDevice='+videoDevice);
            if (!videoDevice) {
                videoDevice = this.devices.find(d => d.kind === 'videoinput');
                this.d('handleDeviceAvailabilityChanges(): this.devices.find(d => d.kind === \'videoinput\')='+videoDevice+' (hopefully not undefined)');
                if (videoDevice) {
                    this.d('handleDeviceAvailabilityChanges(): this.video.selectedId = videoDevice.deviceId = '+videoDevice.deviceId);
                    this.video.selectedId = videoDevice.deviceId;
                    this.onSettingsChanged(videoDevice);
                }
            }
        }
    }

    d(msg: string) {
        this.log.d('SettingsComponent: '+msg);
    }
}
