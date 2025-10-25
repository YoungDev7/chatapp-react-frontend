declare module 'sockjs-client' {
  export default class SockJS {
    constructor(url: string);
  }
}

import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthInterceptor?: boolean;
    _retry?: boolean;
  }
}