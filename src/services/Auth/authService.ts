import { pool } from "../../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

const ACCESS_EXPIRES_IN = "30m";
const REFRESH_EXPIRES_IN = "30d";

function signTokens(user: { id: number; email: string; name: string }) {
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET!, { expiresIn: ACCESS_EXPIRES_IN });
    const refreshToken = jwt.sign({ if: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET!, { expiresIn: REFRESH_EXPIRES_IN });
    return { token, refreshToken };
}

export function refreshAuthToken(refreshToken: string) {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as jwt.JwtPayload & { id: number, email: string, name: string };
    const user = { id: decoded.id, email: decoded.email!, name: decoded.name! };
    return { ...signTokens(user), user };
}

dotenv.config();

export async function registerUser(email: string, password: string, name: string) {
    const isExist = await pool.query(
        `
        SELECT * FROM Users WHERE email = $1
        `, [email]
    );

    if (isExist.rows.length > 0) throw new Error("User already exists")

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const result = await pool.query( //posting the email and password after hashing it
            `INSERT INTO Users (
            email,
            password_hash,
            name) VALUES ($1, $2, $3) RETURNING id, email, name`, [email, hashedPassword, name]
        );
        const user = result.rows[0];

        const { token, refreshToken } = signTokens(user);
        return { success: true, token, refreshToken, user }
    } catch (err) {
        console.error("falied with err: ", err);

    }



}

export async function loginUser(email: string, password: string) {
    const isMailExists = await pool.query(
        `SELECT * FROM Users WHERE email = $1`, [email]
    );

    if (isMailExists.rows.length === 0) throw new Error("email not found");
    const user = isMailExists.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error("incorrect password");

    const { token, refreshToken } = signTokens({ id: user.id, email: user.email, name: user.name });

    return {
        success: true,
        token,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            name: user.name
        }
    }
}

export async function checkEmailInDB(email: string) {
    const isMailExists = await pool.query(
        `SELECT 1 FROM users WHERE email = $1`, [email]
    );

    return isMailExists.rows.length > 0;
}