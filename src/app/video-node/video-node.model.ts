

// Generate model classes with ng cli like this:
// ng generate class video-event/video-event --type=model
export class VideoNode {
  // email_to_legislator: string;
  // email_to_legislator_body: string;
  // email_to_legislator_body_unevaluated: string;
  // email_to_legislator_subject: string;
  // email_to_legislator_subject_unevaluated: string;
  // email_to_participant_body: string;
  // email_to_participant_body_unevaluated: string;
  // email_to_participant_subject: string;
  // email_to_participant_subject_unevaluated: string;
  // leg_id: string;
  // legislator_chamber: string;
  // legislator_district: string;
  // legislator_email: string;
  // legislator_first_name: string;
  // legislator_full_name: string;
  // legislator_last_name: string;
  // legislator_name: string;
  // legislator_phone: string;
  // legislator_state: string;
  // legislator_state_abbrev: string;
  // node_create_date: string;
  // node_create_date_ms: number; // long
  // post_to_facebook: string;
  // post_to_twitter: string;
  // recording_completed: string;
  // // others?  publishing_completed ?
  // room_id: string;
  // sms_phone: string;
  // video_mission_description: string;
  // video_participants: [{
  //   email: string;
  //   name: string;
  //   present: boolean;
  //   start_date: string;
  //   start_date_ms: number; // long
  //   // others ??
  //   uid: string
  // }];
  // video_title: string;
  // video_type: string;
  // youtube_video_description: string;
  // youtube_video_description_unevaluated: string;

  val: any

  // snapshot.val() already has all these fields - DID I REALLY NEED TO DO ALL THIS?
  constructor(val: any) {
      this.val = val;

      // if (val.email_to_legislator) email_to_legislator = val.email_to_legislator;
      // if (val.email_to_legislator_body) email_to_legislator_body = val.email_to_legislator_body;
      // if (val.email_to_legislator_body_unevaluated) email_to_legislator_body_unevaluated = val.email_to_legislator_body_unevaluated;
      // if (val.email_to_legislator_subject) email_to_legislator_subject = val.email_to_legislator_subject;
      // if (val.email_to_legislator_subject_unevaluated) email_to_legislator_subject_unevaluated = val.email_to_legislator_subject_unevaluated;
      // if (val.email_to_participant_body) email_to_participant_body = val.email_to_participant_body;
      // if (val.email_to_participant_body_unevaluated) email_to_participant_body_unevaluated = val.email_to_participant_body_unevaluated;
      // if (val.email_to_participant_subject) email_to_participant_subject = val.email_to_participant_subject;
      // if (val.email_to_participant_subject_unevaluated) email_to_participant_subject_unevaluated = val.email_to_participant_subject_unevaluated;
      //
      // if (val.leg_id) leg_id = val.leg_id;
      // if (val.legislator_chamber) legislator_chamber = val.legislator_chamber;
      // if (val.legislator_district) legislator_district = val.legislator_district;
      // if (val.legislator_email) legislator_email = val.legislator_email;
      // if (val.legislator_first_name) legislator_first_name = val.legislator_first_name;
      // if (val.legislator_full_name) legislator_full_name = val.legislator_full_name;
      // if (val.legislator_last_name) legislator_last_name = val.legislator_last_name;
      // if (val.legislator_name) legislator_name = val.legislator_name;
      // if (val.legislator_phone) legislator_phone = val.legislator_phone;
      // if (val.legislator_state) legislator_state = val.legislator_state;
      // if (val.legislator_state_abbrev) legislator_state_abbrev = val.legislator_state_abbrev;
      // if (val.node_create_date) node_create_date = val.node_create_date;
      // if (val.node_create_date_ms) node_create_date_ms = val.node_create_date_ms;
      // if (val.post_to_facebook) post_to_facebook = val.post_to_facebook;
      // if (val.post_to_twitter) post_to_twitter = val.post_to_twitter;
      // if (val.recording_completed) recording_completed = val.recording_completed;
      // // others?  publishing_completed ?
      // if (val.room_id) room_id = val.room_id;
      // if (val.sms_phone) sms_phone = val.sms_phone;
      // if (val.video_mission_description) video_mission_description = val.video_mission_description;
      // if (val.video_participants) video_participants = constructVideoParticipants(val.video_participants);
      // if (val.video_title) video_title = val.video_title;
      // if (val.video_type) video_type = val.video_type;
      // if (val.youtube_video_description) youtube_video_description = val.youtube_video_description;
      // if (val.youtube_video_description_unevaluated) youtube_video_description_unevaluated = val.youtube_video_description_unevaluated;

  }

  // // TODO:
  // constructVideoParticipants(p: [{
  //     email: string;
  //     name: string;
  //     present: boolean;
  //     start_date: string;
  //     start_date_ms: number; // long
  //     // others ??
  //     uid: string
  //   }])
  // {
  //   return {} // complete using lodash
  // }


}
