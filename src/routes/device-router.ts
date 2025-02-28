import express from 'express';
import deviceService from '../services/device-service';
import Device from '../models/device';


const deviceRouter = express.Router();

/**
 * @openapi
 * /create:
 *   post:
 *     summary: Creates a device on the database
 *     description: Creates a device
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               brand:
 *                 type: string
 *     responses:
 *       201:
 *         description: the created device information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 brand:
 *                   type: string
 *       500:
 *         description: server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
deviceRouter.post('/create', async (req, res) => {
	const device: Device = req.body;
	try {
		const response = await deviceService.create(device);

		res.status(201).json(response);
	} catch (e) {
		res.status(500).json({
			message: 'Something went wrong',
			error: (e instanceof Error) ? e.message : 'Uknown error'
		});
	}
})


/**
 * @openapi
 * /get-by-id/{id}:
 *   get:
 *     summary: Retrieve a device by id
 *     description: Retrieve a device by it's id on the system
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: device's identification number
 *         schema:
 *           type: integer
 */
deviceRouter.get('/get-by-id/:id', async (req, res) => {
	const id: number = +req.params.id;

	try {
		const response = await deviceService.getById(id);
		res.status(200).json(response);
	} catch (e) {
		res.status(500).json({
			message: 'Something went wrong',
			error: (e instanceof Error) ? e.message : 'Uknown error'
		});
	}
})


/**
 * Route responsible for retrieving devices by it's brand
 */
deviceRouter.get('/get-by-brand/:brand', async (req, res) => {
	const brand: string = req.params.brand;

	try {
		const response = await deviceService.getByBrand(brand);
		res.status(200).json(response);
	} catch (e) {
		res.status(500).json({
			message: 'Something went wrong',
			error: (e instanceof Error) ? e.message : 'Uknown error'
		});
	}
	
})

/**
 * Route responsible for retrieving devices by it's state
 */
deviceRouter.get('/get-by-state/:state', async (req, res) => {
	const deviceState = req.params.state;

	
	try {
		const response = await deviceService.getByState(deviceState);
		res.status(200).json(response);
	} catch (e) {
		res.status(500).json({
			message: 'Something went wrong',
			error: (e instanceof Error) ? e.message : 'Uknown error'
		});
	}
})

/**
 * @openapi
 * /get-all:
 *   get:
 *     summary: Retrieve all the devices
 *     description: Retrieve all devices registered in the database
 */
deviceRouter.get('/get-all', async (req, res) => {

	
	try {
		const response = await deviceService.getAll();
		res.status(200).json(response);
	} catch (e) {
		res.status(500).json({
			message: 'Something went wrong',
			error: (e instanceof Error) ? e.message : 'Uknown error'
		});
	}
})

export default deviceRouter;