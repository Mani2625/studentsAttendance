app.get('/api/attendance/status', (req, res) => {
    const { student_reg_no, date } = req.query;

    if (!student_reg_no || !date) {
        return res.status(400).json({ error: 'Missing student_reg_no or date' });
    }

    const query = `SELECT status FROM attendance WHERE student_reg_no = ? AND attendance_date = ?`;

    db.query(query, [student_reg_no, date], (err, results) => {
        if (err) {
            console.error('Error fetching attendance status:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
            res.json({ status: results[0].status });
        } else {
            res.json({ status: null });
        }
    });
});