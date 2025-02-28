/**
 * Device service class
 */

import DEVICE_STATES from "../common/types/device-states";
import db from "../lib/database";
import Device from "../models/device";


class DeviceService {
	constructor(){}


	/**
	 * creates the device
	 * @param {Device} newDevice 
	 * @returns 
	 * @async
	 */
	async create(newDevice: Device) {
		// check if required parameters were supplied
		if (!newDevice.brand || !newDevice.name) {
			throw new Error('Missing brand or name from the request');
		}

		// default state if not provided is available
		let deviceState: string = 'available';

		// if newDevice.state exists, check for it's value
		if (newDevice.state && typeof newDevice.state == 'string') {
			if (DEVICE_STATES.includes(newDevice.state)) {
				deviceState = newDevice.state;
			} else {
				throw new Error('The device state was not found');
			}
		}

		const [result] = await db.raw(
			`INSERT INTO 
				devices 
			SET
				name = ?,
				brand = ?,
				device_status_id = (
					SELECT id FROM device_status WHERE status_label = ?
				)`,
			[newDevice.name, newDevice.brand, deviceState]
		);

		if (result.affectedRows == 0) throw new Error('No rows were affected');

		const [[createdDevice]] = await db.raw(
			`SELECT * FROM
				devices
			WHERE id = ?`,
			[result.insertId]
		);

		return createdDevice;
	}

	/**
	 * edit the device in the database
	 * @param {Device} device
	 * @returns {Device} edited device
	 * @async
	 */
	async edit(device: Device) {
		if (!device.id) throw new Error('The device id was not supplied');

		// check if the device exists
		const [[deviceName]] = await db.raw(
			`SELECT name FROM
				devices
			WHERE id = ?`,
			[device.id]
		);

		if (!deviceName) return { message: 'NotFound', id: device.id };

		if (device.creationTime !== undefined) throw new Error('Creation time cannot be updated');

		const updateStatement: string = 'UPDATE devices SET ';
		let values: string = '';
		const sqlArgs = [];

		if (device.name !== undefined) {
			if (typeof device.name == 'string' && device.name.trim().length > 0) {
				values += 'name=?,';
				sqlArgs.push(device.name);
			} else {
				throw new Error('The device name is invalid');
			}
		}

		if (device.brand !== undefined) {
			if (typeof device.brand == 'string' && device.brand.trim().length > 0) {
				values += 'brand=?,';
				sqlArgs.push(device.brand);
			} else {
				throw new Error('The device brand is invalid');
			}
		}

		if (device.state !== undefined) {
			if (typeof device.state == 'string' && device.state.trim().length > 0) {
				if (!DEVICE_STATES.includes(device.state)) {
					throw new Error('The device state does not exist');
				}
				values += 'device_status_id=(SELECT id FROM device_status WHERE status_label = ?),'
				sqlArgs.push(device.state);
			} else {
				throw new Error('The device state is invalid');
			}
		}

		values = values.substring(0, values.length-1);
		sqlArgs.push(device.id);

		const [result] = await db.raw(
			updateStatement + values + ' WHERE id=?',
			sqlArgs
		);

		if (result.affectedRows == 0) throw new Error('No rows were affected');

		const [[updatedDevice]] = await db.raw(
			`SELECT * FROM
				devices
			WHERE id = ?`,
			[device.id]
		);

		return updatedDevice;
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
	 * @returns {Device[]}
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