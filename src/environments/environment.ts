// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyC2hOku8c1EiFdnRKDVtwzN3H8VfiVUl2w",
    authDomain: "telepatriot-dev.firebaseapp.com",
    databaseURL: "https://telepatriot-dev.firebaseio.com",
    projectId: "telepatriot-dev",
    storageBucket: "telepatriot-dev.appspot.com",
    messagingSenderId: "739385355816",
    appId: "1:739385355816:web:20cafe521edcba41434f1d"
  }
};

const awesome_comment = {
  comment: "Here's the instructions for getting the firebaseConfig object:",
  instructions: "https://support.google.com/firebase/answer/7015592"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
