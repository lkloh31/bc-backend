import db from "#db/client";
import bcrypt from "bcrypt";

export async function createUser(name, email, password, location, created_at) {
  const sql = `
  INSERT INTO users
    (name, email, password, location, created_at)
  VALUES
    ($1, $2, $3, $4, $5)
  RETURNING *
  `;
  const hashedPassword = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [name, email, hashedPassword, location, created_at]);
  return user;
}

export async function getUserByEmailAndPassword(email, password) {
  const sql = `
  SELECT *
  FROM users
  WHERE email = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [email]);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}

export async function getUserById(id) {
  const sql = `
  SELECT *
  FROM users
  WHERE id = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}

export async function deleteUser(id) {
  const sql = `
    DELETE FROM users
    WHERE id = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}

export async function updateUser({ id, name, email, password }) {
  const sql = `
    UPDATE users
    SET name=$2, email=$3, password=$4
    WHERE id = $1
    RETURNING *
    `;

  let hashedPassword;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }
  const {
    rows: [user],
  } = await db.query(sql, [id, name, email, hashedPassword]);
  return user;
}
