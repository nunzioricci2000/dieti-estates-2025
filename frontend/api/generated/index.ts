/** Generate by swagger-axios-codegen */
// @ts-nocheck
/* eslint-disable */

/** Generate by swagger-axios-codegen */
/* eslint-disable */
// @ts-nocheck
import axiosStatic from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface IRequestOptions extends AxiosRequestConfig {
  /**
   * show loading status
   */
  loading?: boolean;
  /**
   * display error message
   */
  showError?: boolean;
  /**
   * indicates whether Authorization credentials are required for the request
   * @default true
   */
  withAuthorization?: boolean;
}

export interface IRequestConfig {
  method?: any;
  headers?: any;
  url?: any;
  data?: any;
  params?: any;
}

// Add options interface
export interface ServiceOptions {
  axios?: AxiosInstance;
  /** only in axios interceptor config*/
  loading: boolean;
  showError: boolean;
}

// Add default options
export const serviceOptions: ServiceOptions = {};

// Instance selector
export function axios(configs: IRequestConfig, resolve: (p: any) => void, reject: (p: any) => void): Promise<any> {
  if (serviceOptions.axios) {
    return serviceOptions.axios
      .request(configs)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  } else {
    throw new Error('please inject yourself instance like axios  ');
  }
}

export function getConfigs(method: string, contentType: string, url: string, options: any): IRequestConfig {
  const configs: IRequestConfig = {
    loading: serviceOptions.loading,
    showError: serviceOptions.showError,
    ...options,
    method,
    url
  };
  configs.headers = {
    ...options.headers,
    'Content-Type': contentType
  };
  return configs;
}

export const basePath = '';

export interface IList<T> extends Array<T> {}
export interface List<T> extends Array<T> {}
export interface IDictionary<TValue> {
  [key: string]: TValue;
}
export interface Dictionary<TValue> extends IDictionary<TValue> {}

export interface IListResult<T> {
  items?: T[];
}

export class ListResultDto<T> implements IListResult<T> {
  items?: T[];
}

export interface IPagedResult<T> extends IListResult<T> {
  totalCount?: number;
  items?: T[];
}

export class PagedResultDto<T = any> implements IPagedResult<T> {
  totalCount?: number;
  items?: T[];
}

// customer definition
// empty

export class AuthService {
  /**
   * signup
   */
  static authSignup(
    params: {
      /** requestBody */
      body?: SignupRequestDTO;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<AuthResponseDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/auth/signup';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * login
   */
  static authLogin(
    params: {
      /** requestBody */
      body?: LoginRequestDTO;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/auth/login';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * re-authenticate
   */
  static authReAuthenticate(
    params: {
      /** requestBody */
      body?: PasswordDTO;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<AuthResponseDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/auth/re-authenticate';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}

export class AdminService {
  /**
   * create admin
   */
  static createAdmin(
    params: {
      /** requestBody */
      body?: SignupRequestDTO;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UserDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/admins';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * change admin password
   */
  static changeAdminPassword(
    params: {
      /** requestBody */
      body?: PasswordDTO;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UserDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/admins/me/password';

      const configs: IRequestConfig = getConfigs('patch', 'application/json', url, options);

      /** 适配移动开发（iOS13 等版本），只有 POST、PUT 等请求允许带body */

      console.warn('适配移动开发（iOS13 等版本），只有 POST、PUT 等请求允许带body');

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}

export class AgentService {
  /**
   * create agent
   */
  static createAgent(
    params: {
      /** requestBody */
      body?: SignupRequestDTO;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UserDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/agents';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}

export class AdvertisementService {
  /**
   * advertisement metrics
   */
  static getAdvertisementsMetrics(
    params: {
      /** This is available only for agents */
      include: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<AdvertisementsMetricsDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/advertisements';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { include: params['include'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   * new advertisement
   */
  static createAdvertisement(
    params: {
      /**  */
      address: string;
      /**  */
      city: string;
      /**  */
      latitude: string;
      /**  */
      longitude: string;
      /**  */
      images: [];
      /**  */
      description: string;
      /**  */
      dimensions: number;
      /**  */
      numberOfRooms: number;
      /**  */
      energyClass: string;
      /**  */
      additionalServices: [];
      /**  */
      kind: string;
      /**  */
      price: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<AdvertisementDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/advertisements';

      const configs: IRequestConfig = getConfigs('post', 'multipart/form-data', url, options);

      let data = undefined;
      data = new FormData();
      if (params['address']) {
        if (Object.prototype.toString.call(params['address']) === '[object Array]') {
          for (const item of params['address']) {
            data.append('address', item as any);
          }
        } else {
          data.append('address', params['address'] as any);
        }
      }

      if (params['city']) {
        if (Object.prototype.toString.call(params['city']) === '[object Array]') {
          for (const item of params['city']) {
            data.append('city', item as any);
          }
        } else {
          data.append('city', params['city'] as any);
        }
      }

      if (params['latitude']) {
        if (Object.prototype.toString.call(params['latitude']) === '[object Array]') {
          for (const item of params['latitude']) {
            data.append('latitude', item as any);
          }
        } else {
          data.append('latitude', params['latitude'] as any);
        }
      }

      if (params['longitude']) {
        if (Object.prototype.toString.call(params['longitude']) === '[object Array]') {
          for (const item of params['longitude']) {
            data.append('longitude', item as any);
          }
        } else {
          data.append('longitude', params['longitude'] as any);
        }
      }

      if (params['images']) {
        if (Object.prototype.toString.call(params['images']) === '[object Array]') {
          for (const item of params['images']) {
            data.append('images', item as any);
          }
        } else {
          data.append('images', params['images'] as any);
        }
      }

      if (params['description']) {
        if (Object.prototype.toString.call(params['description']) === '[object Array]') {
          for (const item of params['description']) {
            data.append('description', item as any);
          }
        } else {
          data.append('description', params['description'] as any);
        }
      }

      if (params['dimensions']) {
        if (Object.prototype.toString.call(params['dimensions']) === '[object Array]') {
          for (const item of params['dimensions']) {
            data.append('dimensions', item as any);
          }
        } else {
          data.append('dimensions', params['dimensions'] as any);
        }
      }

      if (params['numberOfRooms']) {
        if (Object.prototype.toString.call(params['numberOfRooms']) === '[object Array]') {
          for (const item of params['numberOfRooms']) {
            data.append('numberOfRooms', item as any);
          }
        } else {
          data.append('numberOfRooms', params['numberOfRooms'] as any);
        }
      }

      if (params['energyClass']) {
        if (Object.prototype.toString.call(params['energyClass']) === '[object Array]') {
          for (const item of params['energyClass']) {
            data.append('energyClass', item as any);
          }
        } else {
          data.append('energyClass', params['energyClass'] as any);
        }
      }

      if (params['additionalServices']) {
        if (Object.prototype.toString.call(params['additionalServices']) === '[object Array]') {
          for (const item of params['additionalServices']) {
            data.append('additionalServices', item as any);
          }
        } else {
          data.append('additionalServices', params['additionalServices'] as any);
        }
      }

      if (params['kind']) {
        if (Object.prototype.toString.call(params['kind']) === '[object Array]') {
          for (const item of params['kind']) {
            data.append('kind', item as any);
          }
        } else {
          data.append('kind', params['kind'] as any);
        }
      }

      if (params['price']) {
        if (Object.prototype.toString.call(params['price']) === '[object Array]') {
          for (const item of params['price']) {
            data.append('price', item as any);
          }
        } else {
          data.append('price', params['price'] as any);
        }
      }

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * set ad as taken
   */
  static setAdvertisementTaken(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/advertisements/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('patch', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}

export class OfferService {
  /**
   * new offer
   */
  static createAdvertisementOffer(
    params: {
      /**  */
      id: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SendEmailDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/advertisements/{id}/offers';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}

/** SignupRequestDTO */
export interface SignupRequestDTO {
  /**  */
  username: string;

  /**  */
  email: string;

  /**  */
  password: string;
}

/** AuthResponseDTO */
export interface AuthResponseDTO {
  /**  */
  token: string;
}

/** LoginRequestDTO */
export interface LoginRequestDTO {
  /**  */
  email: string;

  /**  */
  password: string;
}

/** UserDTO */
export interface UserDTO {
  /**  */
  username: string;

  /**  */
  email: string;
}

/** PasswordDTO */
export interface PasswordDTO {
  /**  */
  password: string;
}

/** AdvertisementDTO */
export interface AdvertisementDTO {
  /** ID */
  id: number;

  /**  */
  address: string;

  /**  */
  city: string;

  /**  */
  coordinates: object;

  /**  */
  images: string[];

  /**  */
  description: string;

  /**  */
  dimensions: number;

  /**  */
  numberOfRooms: number;

  /**  */
  energyClass: string;

  /**  */
  additionalServices: string[];

  /**  */
  nearbyPOIs: string[];

  /**  */
  kind: EnumAdvertisementDTOKind;

  /**  */
  price: number;
}

/** AdvertisementsMetricsDTO */
export interface AdvertisementsMetricsDTO {
  /**  */
  totalVisitsRequested: number;

  /**  */
  totalViews: number;

  /**  */
  advertisements: object[];
}

/** SendEmailDTO */
export interface SendEmailDTO {
  /**  */
  agent: UserDTO;

  /**  */
  advertisement: AdvertisementDTO;
}
export enum EnumAdvertisementDTOKind {
  'sale' = 'sale',
  'rent' = 'rent'
}
