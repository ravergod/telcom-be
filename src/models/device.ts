import DeviceState from "./enums/device-state";

type Device = {
	id?: number,
	name: string,
	brand: string,
	state?: string,
	creationTime?: Date
}


export default Device;