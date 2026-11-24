// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mockDB: true,
  firebase: {
    apiKey: import.meta.env.NG_APP_FIREBASE_DEV_API_KEY,
    // REPLACE WITH CONFIG
  },
};
