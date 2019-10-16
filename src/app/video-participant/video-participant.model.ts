export class VideoParticipant {

    val: any

    constructor(val: any) {
        this.val = val;
    }

    isConnected():boolean {
        console.log('this.val.connect_date = ', this.val.connect_date, '(want this to be not null)' );
        console.log('this.val.twilio_token = ', this.val.twilio_token, '(want one of these to be not null)' );
        console.log('this.val.twilio_token_record = ', this.val.twilio_token_record, '(want one of these to be not null)' );
        console.log('this.val.disconnect_date = ', this.val.disconnect_date, '(want this to be null)' );
        const ret = this.val.connect_date != null
              && (this.val.twilio_token != null || this.val.twilio_token_record != null)
              && this.val.disconnect_date == null;
        console.log('return ret = ', ret);
        return ret;
    }
}
