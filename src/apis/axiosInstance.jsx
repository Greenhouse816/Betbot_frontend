import axios from "axios";

const instance = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: `${__BASEURL__}`,
  headers: {
    "Accept": "*/**",
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Content-Type, Authorization',
    'Access-Control-Allow-Methods': '*',
    "Cross-Origin-Resource-Policy": '*',
  },
});

export default instance;
