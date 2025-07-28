import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
};

export default async function handler(req, res) {
  const db = await mysql.createConnection(dbConfig);

  if (req.method === 'GET') {
    try {
      const [rows] = await db.query('SELECT * FROM students_table');
      res.status(200).json(rows);
    } catch (err) {
      console.error('Error fetching students:', err);
      res.status(500).json({ error: 'Database error' });
    }
  } else if (req.method === 'POST') {
    const { reg_no, name, hostel, room_no, sra } = req.body;

    if (!reg_no || !name || !hostel || !room_no || !sra) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      await db.query(
        'INSERT INTO students_table (reg_no, name, hostel, room_no, sra) VALUES (?, ?, ?, ?, ?)',
        [reg_no, name, hostel, room_no, sra]
      );
      res.status(200).json({ success: true, message: `Student ${name} added!` });
    } catch (err) {
      console.error('Error adding student:', err);
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }

  await db.end();
}
