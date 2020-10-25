declare module 'miio' {
    interface DeviceConfig {
        address: string;
        token: string;
    }

    type Param = string | number;
    
    export interface Device {
        call: <R>(method: string, params: Param[]) => Promise<R>; 
    }

    export function device<D>(config: DeviceConfig): Promise<D>;
}