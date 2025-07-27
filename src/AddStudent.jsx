import { useState } from 'react';

function AddStudent() {
    const [formData, setFormData] = useState({
        reg_no: '',
        name: '',
        hostel: '',
        room_no: '',
        sra: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                setMessage(`✅ ${result.message}`);
                setFormData({ reg_no: '', name: '', hostel: '', room_no: '', sra: '' });
            } else {
                setMessage(`❌ Failed: ${result.error}`);
            }
        } catch (error) {
            console.error('Error adding student:', error);
            setMessage('❌ Error adding student.');
        }
    };

    return (
        <div className="add-student">
            <h3>Add New Student</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" name="reg_no" placeholder="Reg No" value={formData.reg_no} onChange={handleChange} required />
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <input type="text" name="hostel" placeholder="Hostel" value={formData.hostel} onChange={handleChange} required />
                <input type="text" name="room_no" placeholder="Room No" value={formData.room_no} onChange={handleChange} required />
                <input type="text" name="sra" placeholder="SRA" value={formData.sra} onChange={handleChange} required />
                <button type="submit">Add Student</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default AddStudent;
