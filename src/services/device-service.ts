/**
 * Device service class
 */

import db from "../common/lib/database";
import Device from "../models/device";
import DeviceState from "../models/enums/device-state";


class DeviceService {
	constructor(){}


	/**
	 * creates the device
	 * @param newDevice 
	 * @returns 
	 * @async
	 */
	async create(newDevice: Device) {
		const [result] = await db.raw(
			`INSERT INTO 
				devices 
			SET
				name = ?,
				brand = ?,
				device_status_id = (
					SELECT id FROM device_status WHERE status_label = ?
				)`,
			[newDevice.name, newDevice.brand, "available"]
		);
		return result;
	}

	/**
	 * retrieve devices by brand
	 * @param {string} brand
	 */
	async getByBrand(brand: string) {
		const [result] = await db.raw(
			`SELECT * FROM
				devices
			WHERE brand = ?`,
			[brand]
		);

		return result;
	}

	/**
	 * retrieve devices by state
	 * @param {string} deviceState
	 * @returns
	 * @async
	 */
	async getByState(deviceState: string) {
		// const state = deviceState === DeviceState.AVAILABLE ? 
					//   deviceState === DeviceState.INACTIVE ?


		const [result] = await db.raw(
			`SELECT * FROM
				devices
			WHERE device_status_id = (
				SELECT id FROM
					device_status
				WHERE status_label = ?
			)`,
			[deviceState]
		);

		return result;
	}


	/**
	 * retrieve all devices
	 * @returns 
	 * @async
	 */
	async getAll() {
		const [result] = await db.raw(`SELECT * FROM devices`);
		return result;
	}

	/**
	 * retrieve a device by id
	 * @param {number} id
	 * @returns {Device}
	 * @async
	 */
	async getById(id: number) {
		const [[result]] = await db.raw(
			`SELECT * FROM
				devices
			WHERE id = ?`,
			[id]
		);

		return result;
	}
}

const deviceService = new DeviceService();
export default deviceService;