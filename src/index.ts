import express from 'express';
import cors from 'cors';
import deviceRouter from './routes/device-router';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// server port
const PORT = process.env.PORT || 4000;

// server hostname
const HOSTNAME = process.env.HOSTNAME || 'http://localhost';

// express app initialize
const app = express();

// enable cors
app.use(cors({
	origin: ['http://localhost:4000']
}))

// enable json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// configuring swagger for documentation
const options = {
	definition: {
		openapi: '3.0.1',
		info: {
		title: 'TELCOM API',
		version: '1.0.0',
		description: `API created to manage devices and it's information`,
		},
		schemes: ["http"],
		servers: [{ url: "http://localhost:4000/" }],
	},
	apis: ['./src/routes/*.ts'],
};
const swaggerSpec = swaggerJsdoc(options);
console.log(swaggerSpec)

// routers injection
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/device', deviceRouter);

// root endpoint
app.get('/', (req, res) => {
	res.status(200).send('Welcome to TELCOM backend');
})

// standard response for any request
app.use((req, res) => {
	res.status(404);
})

// Inicia o sevidor
app.listen(PORT, () => {
	console.log(`Server running at: ${HOSTNAME}:${PORT}`);
})