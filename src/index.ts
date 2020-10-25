import { API } from 'homebridge';

import { PLATFORM_NAME } from './settings';
import { ToiletSitAccessory } from './ToiletSitAccessory'; 

/**
 * This method registers the platform with Homebridge
 */
export = (api: API) => {
  api.registerAccessory(PLATFORM_NAME, ToiletSitAccessory);
};
