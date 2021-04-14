export const GOOGLE_LIBRARIES = ['places'];

const publicMapsApiKey = 'AIzaSyBQ9mY-sMSNspUbqx7c_0IKWEOXQ8JIDKM'; // only for luca-app.de referrers

// optional alternative key added at build time
export const GOOGLE_MAPS_API_KEY =
  process.env.REACT_APP_GOOGLE_MAPS_API_KEY || publicMapsApiKey;
