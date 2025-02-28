import express from 'express';
import deviceService from '../services/device-service';
import Device from '../models/device';
import DEVICE_STATES from '../common/types/device-states';


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
 *                 id:
 *                   type: number
 *                 name:
 *                   type: string
 *                 brand:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   example: 01/01/2025
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
 * 
 */
deviceRouter.post('/create', async (req, res) => {
	const device: Device = req.body;
	try {
		const response = await deviceService.create(device);
		// If I had more time, one of the things I would do is to normalize the response
		// already checking for HTTP Status Codes and to already have those
		// behaviors configured, instead of repeating all over the place.
		// This would take more time
		res.status(201).json(response);
	} catch (e) {
		// the same thing for the error responses and HTTP Status Codes of failing requests
		// I put that as 500 always but at least I'm trying to provide a little
		// more info so whoever is calling would at least know what is going on
		res.status(500).json({
			message: 'Something went wrong',
			error: (e instanceof Error) ? e.message : 'Uknown error'
		});
	}
})


/**
 * @openapi
 * /edit:
 *   put:
 *     summary: Edits the device record
 *     description: Edits the device record partially in the database, createdAt and id are not editable
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
 *                 id:
 *                   type: number
 *                 name:
 *                   type: string
 *                 brand:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   example: 01/01/2025
 * 
 */
deviceRouter.put('/edit', async (req, res) => {
	const device: Device = req.body;
	
	try {
		const response = await deviceService.edit(device);
		if (response?.message) {
			res.status(404).json(response);
			return;
		}
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
 *     description: Retrieve a device by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: device's identification number
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: a device object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 name:
 *                   type: string
 *                 brand:
 *                   type: string
 *                 state:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   example: 01/01/2025
 * 
 */
deviceRouter.get('/get-by-id/:id', async (req, res) => {
	const id: number = +req.params.id;

	try {
		// this validation should be a function, it repeats itself
		// I am fully aware of that, but because of time constraints I did not do it
		// but this is strongly a point of improvement
		if (isNaN(id)) throw new Error('The id provided is in an invalid format');

		const response = await deviceService.getById(id);
		if (!response) res.status(404).json({
			message: `The device for id: ${id} was not found`
		})
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
 * /get-by-brand/{brand}:
 *   get:
 *     summary: Retrieve a device by brand
 *     description: Retrieve a device by it's brand
 *     parameters:
 *       - in: path
 *         name: brand
 *         required: true
 *         description: device's brand
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a device object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 name:
 *                   type: string
 *                 brand:
 *                   type: string
 *                 state:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   example: 01/01/2025
 * 
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
 * @openapi
 * /get-by-state/{state}:
 *   get:
 *     summary: Retrieve a device by state
 *     description: Retrieve a device by it's state
 *     parameters:
 *       - in: path
 *         name: state
 *         required: true
 *         description: device's state
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: a device object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 name:
 *                   type: string
 *                 brand:
 *                   type: string
 *                 state:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   example: 01/01/2025
 * 
 */
deviceRouter.get('/get-by-state/:state', async (req, res) => {
	const deviceState: string = req.params.state;
	
	// the reason I've put this validation here is because if
	// the state does not exist I don't even wanna let the server try
	// the request. It would cost a whole bunch of processing and also it would
	// hit the DB and then AFTER that it would tell you that it doesn't exist
	// so I think that doing this and not letting it call another other function
	// is better than letting the server use CPU for nothing
	if (!DEVICE_STATES.includes(deviceState)) {
		res.status(400).json({
			message: 'The provided device state does not exist'
		});
		return;
	}

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
 *     responses:
 *       200:
 *         description: an array of devices or empty array if nothing is found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   name:
 *                     type: string
 *                   brand:
 *                     type: string
 *                   state:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     example: 01/01/2025
 * 
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

/**
 * @openapi
 * /delete/{id}
 *   delete:
 */
deviceRouter.delete('/delete/:id', async (req, res) => {
	const id: number = +req.params.id;

	try {
		// should be a function as said previously
		if (isNaN(id)) throw new Error('The id provided is in an invalid format');
		const response = await deviceService.deleteById(id);
		res.status(200).json(response);
	} catch (e) {
		res.status(500).json({
			message: 'Something went wrong',
			error: (e instanceof Error) ? e.message : 'Uknown error'
		});
	}
});

export default deviceRouter;