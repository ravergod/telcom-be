// Database lib for creating the connection
// One thing that really bothers me is that I don't know for sure when/where/how and IF
// the connection is closed after doing the queries. It bothers me because they could pile up
// and start a problem within the database - it could reach the maximum of accepeted connections
// from the database, and then no more connections would be accepted from the database until
// it dumps the remaining connections
// So I'd say this is a point to be aware of

import knex from "knex";
import config from "../../knexfile";

const db = knex(config);

export default db;