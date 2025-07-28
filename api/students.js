import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  const { method, body } = req;

  try {
    if (method === 'GET') {
      const [rows] = await pool.query('SELECT * FROM students_table');
      return res.status(200).json(rows);
    }

    if (method === 'POST') {
      const { reg_no, name, hostel, room_no, sra } = body;
      if (!reg_no || !name || !hostel || !room_no || !sra) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      await pool.query(
        'INSERT INTO students_table (reg_no, name, hostel, room_no, sra) VALUES (?, ?, ?, ?, ?)',
        [reg_no, name, hostel, room_no, sra]
      );
      return res.status(200).json({ success: true, message: `Student ${name} added!` });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('DB error:', error);
    return res.status(500).json({ error: 'Database error' });
  }
}
