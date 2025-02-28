// This is one of the places I would use the device-states-enum, on the state attribute
// It would look better and be better, but while working with the ORM I thought
// that this would affect the time constraint of the project since I was
// still learning about that.

type Device = {
	id?: number,
	name: string,
	brand: string,
	state?: string,
	creationTime?: Date
}

export default Device;