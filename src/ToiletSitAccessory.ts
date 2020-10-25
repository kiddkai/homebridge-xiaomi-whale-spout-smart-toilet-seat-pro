import { AccessoryPlugin, Logging, AccessoryConfig, API, Service} from 'homebridge';
import miio, { Device } from 'miio';

interface ToiletSitAccessoryConfig extends AccessoryConfig {
    token: string;
    ipAddress: string;
}

export class ToiletSitAccessory implements AccessoryPlugin {
    private log: Logging;
    private config: ToiletSitAccessoryConfig;
    private api: API;
    private informationService: Service;
    private selfCleanTriggerService: Service;
    private device: Device | null;
    private isRunningSelfClean: boolean;

    constructor(logger: Logging, config: AccessoryConfig, api: API) {
      this.log = logger;
      this.config = config as never;
      this.api = api;

      this.informationService = new api.hap.Service.AccessoryInformation()
        .setCharacteristic(api.hap.Characteristic.Manufacturer, 'Xiaomi')
        .setCharacteristic(api.hap.Characteristic.Model, 'Whale Spout Smart Toilet Seat Pro');

      this.selfCleanTriggerService = new api.hap.Service.Switch('Start Self Clean');
      this.selfCleanTriggerService.getCharacteristic(api.hap.Characteristic.ProgrammableSwitchEvent)
        .on('get', this.checkRunStatus)
        .on('set', this.runSelfCleaning);


      this.isRunningSelfClean = false;
      this.device = null;
    }

    getDevice = async () => {
      if (this.device) {
        return this.device;
      }

      const device = await miio.device<Device>({
        address: this.config.ipAddress,
        token: this.config.token,
      });

      this.device = device;
        
      return this.device;
    };

    runSelfCleaning = async (callback) => {
      if (this.isRunningSelfClean) {
        callback(null);
        return;
      }

      const device = await this.getDevice();
      await device.call('set_auto_clean', [1]);
      this.isRunningSelfClean = true;
      callback(null, false);

      setTimeout(() => {
        this.isRunningSelfClean = false;
      }, 5000);
    };

    checkRunStatus = (callback) => {
      callback(null, this.isRunningSelfClean);
    };
  
    getServices() {
      return [
        this.informationService,
        this.selfCleanTriggerService,
      ];
    }
}