/**
 * Device service class
 */

import DEVICE_STATES from "../common/types/device-states";
import db from "../lib/database";
import Device from "../models/device";

// Error handling is not the best right now. It just tells you there's an
// error and it has a message on it, that's all. I'm aware that this is also
// a point of improvement but again, time constraints.

class DeviceService {
	constructor(){}


	/**
	 * creates the device
	 * @param {Device} newDevice 
	 * @returns {Device} created device
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
			// this check for device_states should also be a separated function
			// checkStateExist() or something like that
			if (DEVICE_STATES.includes(newDevice.state)) {
				deviceState = newDevice.state;
			} else {
				throw new Error('The device state was not found');
			}
		}

		// doing raw queries feels much easier to me than calling
		// a whole bunch of functions, that's why I did this way
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

		// I've done with the * on purpose
		// * works faster than selecting the columns by name
		// But I'm also aware that this could be considered bad practice.
		// This choice was purely made thinking about performance
		// and the size of the tables that this application is talking to.
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

		// check if the device exists and it's state
		const deviceInfo = await this.getDeviceInfo(device.id);
		if (deviceInfo.message) return deviceInfo;

		// check state
		if (deviceInfo.status == 'in-use') throw new Error('Devices in use cannot be updated');

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

		// removing the ',' from values
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
	 * @returns {Device}
	 * @async
	 */
	async getByBrand(brand: string) {
		// brand has no validators because I left this for doing after.
		// one thing that if I had more time I would for sure do, is
		// put some validator to verify it's not and empty string
		// but really it depends on whoever is building this,
		// because if the user is querying for an empty brand
		// it wouldn't even do nothing because the server does not recognize that
		// in order to call this resource the brand must be fullfiled
		// ALSO, I'm not checking for numbers because you'll never know. Maybe
		// a company could be named for a number, who knows?
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
	 * @returns {Device}
	 * @async
	 */
	async getByState(deviceState: string) {
		// validation is happening before calling this function
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
		// validation is happening before calling this function
		const [[result]] = await db.raw(
			`SELECT * FROM
				devices
			WHERE id = ?`,
			[id]
		);

		return result;
	}

	/**
	 * delete a device
	 * @param {number} id
	 * @returns
	 * @async
	 */
	async deleteById(id: number) {
		// check if the device exists and it's state
		const deviceInfo = await this.getDeviceInfo(id);
		if (deviceInfo.message) return deviceInfo;
		
		// check state
		if (deviceInfo.status == 'in-use') throw new Error('Devices in use cannot be deleted');

		const [result] = await db.raw(
			`DELETE FROM devices
			WHERE id = ?`,
			[id]
		);

		if (result.affectedRows == 0) throw new Error(`The device was not deleted`);

		return { message: `The device with id ${id} was deleted` }
	}

	// function created to make the code a little bit clearer
	// what I mean by that is -> 9 lines are now 1 (lines 251 to 260)
	private async getDeviceInfo(id: number) {
		const [[deviceInfo]] = await db.raw(
			`SELECT
				d.name,
				ds.status_label AS status
			FROM devices d
			INNER JOIN device_status ds
			ON ds.id = d.device_status_id
			WHERE d.id = ?`,
			[id]
		);

		if (!deviceInfo) {
			const result = {
				message: 'NotFound',
				id
			}
			return result;
		}

		return deviceInfo;
	}
}

const deviceService = new DeviceService();
export default deviceService;