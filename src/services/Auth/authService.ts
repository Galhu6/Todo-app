import { pool } from "../../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export async function registerUser(email: string, password: string, name: string) {
    const isExist = await pool.query(
        `
        SELECT * FROM Users WHERE email = $1
        `, [email]
    );

    if (isExist.rows.length > 0) throw new Error("User alredy exists")

    const hashedPassword = await bcrypt.hash(password, 10) //not the correct syntax

    try {
        await pool.query( //posting the email and password after hashing it
            `INSERT INTO Users (
            email,
            password_hash,
            name) VALUES ($1, $2, $3)`, [email, hashedPassword, name]
        );
        return { success: true }
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

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "30m" }
    );

    return {
        success: true,
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name
        }
    }
}

