const token = process.env.REACT_APP_DRONE_TOKEN || '';
const instance = process.env.REACT_APP_DRONE_SERVER
  || `${window.location.protocol}//${window.location.host}`;

export {
  token, instance
};
