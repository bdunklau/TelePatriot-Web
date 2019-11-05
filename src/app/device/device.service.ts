import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';

export type Devices = MediaDeviceInfo[];

@Injectable({
    providedIn: 'root'
})
export class DeviceService {
    $devicesUpdated: Observable<Promise<Devices>>;

    private deviceBroadcast = new ReplaySubject<Promise<Devices>>();

    constructor() {
        console.log('DeviceService: navigator = ', navigator);
        console.log('DeviceService: navigator.mediaDevices = ', navigator.mediaDevices);
        if (navigator && navigator.mediaDevices) {

            // NOTICE that ondevicechange is not supported on Safari on iOS !
            //      https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/ondevicechange
            // maybe this will come to our rescue:  https://simpl.info/getusermedia/sources/
            // OR DOES IT GET FIRED?  I see ondevicechange in the safari console when running from my phone!
            navigator.mediaDevices.ondevicechange = (_: Event) => { // FIXME never fires
                const options = this.getDeviceOptions();
                console.log('DeviceService: this.getDeviceOptions() = ', options);
                this.deviceBroadcast.next(this.getDeviceOptions());
            }
        }

        this.$devicesUpdated = this.deviceBroadcast.asObservable();
        console.log('DeviceService(2): this.getDeviceOptions() = ', this.getDeviceOptions());
        this.deviceBroadcast.next(this.getDeviceOptions());
    }

    private async isGrantedMediaPermissions() {
        var meth = "isGrantedMediaPermissions: "
        console.log(meth+'navigator[\'permissions\'] = ', navigator['permissions']);
        // TODO FIXME navigator['permissions'] is undefined for safari
        if (navigator && navigator['permissions']) {
            try {
                const result = await navigator['permissions'].query({ name: 'camera' });
                if (result) {
                    if (result.state === 'granted') {
                        console.log(meth+'return hardcoded true');
                        return true;
                    } else {
                        const isGranted = await new Promise<boolean>(resolve => {
                            result.onchange = (_: Event) => {
                                const granted = _.target['state'] === 'granted';
                                if (granted) {
                                    console.log(meth+'resolve(true)');
                                    resolve(true);
                                }
                            }
                        });

                        console.log(meth+'return isGranted = ', isGranted);
                        return isGranted;
                    }
                }
                console.log(meth+'result = await navigator... = ', result);
            } catch (e) {
                // This is only currently supported in Chrome.
                // https://stackoverflow.com/a/53155894/2410379
                return true;
            }
        }

        console.log(meth+'returning false at the very end');
        return false;
    }

    private async getDeviceOptions(): Promise<Devices> {
        const isGranted = await this.isGrantedMediaPermissions();
        console.log('isGranted = ', isGranted);
        const hack = true;
        if (navigator && navigator.mediaDevices && (isGranted || hack)) {
            let devices = await this.tryGetDevices();
            if (devices.every(d => !d.label)) {
                devices = await this.tryGetDevices();
            }
            return devices;
        }

        return null;
    }

    private async tryGetDevices() {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const devices = ['audioinput', 'audiooutput', 'videoinput'].reduce((options, kind) => {
            return options[kind] = mediaDevices.filter(device => device.kind === kind);
        }, [] as Devices);

        return devices;
    }
}
