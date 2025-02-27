import DeviceState from "./enums/device-state";

type Device = {
	id?: number,
	name: string,
	brand: string,
	state?: DeviceState,
	creationTime?: Date
}


export default Device;