// write a function to create a users table in your database
import { Client } from "pg";

const client = new Client({
  connectionString:
    "type PostgreSQL coonection string here from Neon DB",
});

async function createUserTable() {
  await client
    .connect()
    .then(() => console.log("client is connected"))
    .catch(() => console.log("not connected"));

  const result = await client.query(`
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`);
  console.log(result);
}

createUserTable();

async function insertUserTable() {
  try {
    await client
      .connect()
      .then(() => console.log("client is connected"))
      .catch(() => console.log("not connected"));

    const insertQuery =
      "INSERT INTO users (name, email, password) VALUES ('testy_user','testy@example.com','testypass123')";
    const res = await client.query(insertQuery);
    console.log("Insertion Success", res);
  } catch (error) {
    console.log("error while inserting", error);
  } finally {
    await client.end(); // close the client connection
  }
}

insertUserTable();

// this way to insert data is not secure
// when you expose this functionality via HTTP, someone can do an SQL INJECTION to get
// access to your data/delete your data

// More secure way to store data in your tables
// is to update the code so you don't put user provided fileds in th esql string

async function insertUserTableSecurely(
  name: string,
  email: string,
  password: string
) {
  try {
    await client
      .connect()
      .then(() => console.log("client is connected"))
      .catch(() => console.log("not connected"));

    const insertQuery =
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)";

    const values = [name, email, password];
    const res = await client.query(insertQuery, values);
    console.log("Insertion Success", res);
  } catch (error) {
    console.log("error while inserting", error);
  } finally {
    await client.end(); // close the client connection
  }
}

insertUserTableSecurely("Test Singh","test12@email.com","testpass12345")

async function getUser(email: string) {
  try {
    await client
      .connect()
      .then(() => console.log("client is connected"))
      .catch(() => console.log("not connected"));

    const query = "SELECT * FROM users WHERE email = $1";

    const res = await client.query(query, [email]);
    // console.log("Insertion Success", res);

    if (res.rows.length > 0) {
      console.log("user found", res.rows[0]);
    } else {
      console.log("no user found with given email");
      return null;
    }
  } catch (error) {
    console.log("error while fetching user", error);
    throw error;
  } finally {
    await client.end(); // close the client connection
  }
}

getUser("testy@example.com").catch(console.error);
