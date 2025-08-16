import { pool } from "../../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { logger } from "../../logger";

const ACCESS_EXPIRES_IN = "30m";
const REFRESH_EXPIRES_IN = "30d";

function signTokens(user: { id: number; email: string; name: string }) {
  const token = jwt.sign(
    { id: user.id, email: user.email.toLowerCase(), name: user.name },
    process.env.JWT_SECRET!,
    { expiresIn: ACCESS_EXPIRES_IN }
  );
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email.toLowerCase(), name: user.name },
    process.env.JWT_SECRET!,
    { expiresIn: REFRESH_EXPIRES_IN }
  );
  return { token, refreshToken };
}

export async function refreshAuthToken(refreshToken: string) {
  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_SECRET!
  ) as jwt.JwtPayload & { id: number; email: string; name: string };
  const dbRes = await pool.query(
    `SELECT whatsapp_number FROM users WHERE id = $1`,
    [decoded.id]
  );
  const user = {
    id: decoded.id,
    email: decoded.email!.toLowerCase(),
    name: decoded.name!,
    whatsappNumber: dbRes.rows[0]?.whatsapp_number || null,
  };
  return { ...signTokens(user), user };
}

dotenv.config();

export async function registerUser(
  email: string,
  password: string,
  name: string,
  whatsappNumber?: string
) {
  const isExist = await pool.query(
    `
        SELECT * FROM Users WHERE email = $1
        `,
    [email.toLowerCase()]
  );

  if (isExist.rows.length > 0) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      `INSERT INTO Users (
            email,
            password_hash,
            name,
            whatsapp_number) VALUES ($1, $2, $3, $4) RETURNING id, email, name, whatsapp_number`,
      [email.toLowerCase(), hashedPassword, name, whatsappNumber]
    );
    const user = result.rows[0];

    const { token, refreshToken } = signTokens(user);
    return {
      success: true,
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        whatsappNumber: user.whatsapp_number || null,
      },
    };
  } catch (err: any) {
    logger.error("falied with err: ", err);
  }
}

export async function loginUser(email: string, password: string) {
  const isMailExists = await pool.query(
    `SELECT * FROM Users WHERE email = $1`,
    [email.toLowerCase()]
  );

  if (isMailExists.rows.length === 0) throw new Error("email not found");
  const user = isMailExists.rows[0];

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error("incorrect password");

  const { token, refreshToken } = signTokens({
    id: user.id,
    email: user.email.toLowerCase(),
    name: user.name,
  });

  return {
    success: true,
    token,
    refreshToken,
    user: {
      id: user.id,
      email: user.email.toLowerCase(),
      name: user.name,
      whatsappNumber: user.whatsapp_number || null,
    },
  };
}

export async function updateWhatsappNumber(
  userId: number,
  whatsappNumber: string
) {
  await pool.query(`UPDATE users SET whatsapp_num ber = $1 WHERE id =$2`, [
    whatsappNumber,
    userId,
  ]);
}

export async function checkEmailInDB(email: string) {
  const isMailExists = await pool.query(
    `SELECT 1 FROM users WHERE email = $1`,
    [email.toLowerCase()]
  );

  return isMailExists.rows.length > 0;
}
