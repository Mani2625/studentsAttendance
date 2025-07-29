import { useState } from 'react';

function AddStudent() {
    const [formData, setFormData] = useState({
        reg_no: '',
        name: '',
        hostel: '',
        room_no: '',
        sra: ''
    });

    const [singleAddMessage, setSingleAddMessage] = useState('');
    const [bulkAddMessage, setBulkAddMessage] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSingleAddMessage('Adding...');

        try {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                setSingleAddMessage(`✅ ${result.message}`);
                setFormData({ reg_no: '', name: '', hostel: '', room_no: '', sra: '' });
            } else {
                setSingleAddMessage(`❌ Failed: ${result.error}`);
            }
        } catch (error) {
            console.error('Error adding student:', error);
            setSingleAddMessage('❌ Error adding student.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setBulkAddMessage('Processing file...');
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const content = event.target.result;
                let students;

                if (file.name.endsWith('.csv')) {
                    students = parseCSV(content);
                } else if (file.name.endsWith('.json')) {
                    students = JSON.parse(content);
                } else {
                    throw new Error('Unsupported file type. Please use .csv or .json');
                }

                if (!Array.isArray(students) || students.length === 0) {
                    throw new Error('File is empty or not in the correct format.');
                }

                setBulkAddMessage(`Uploading ${students.length} students...`);
                const response = await fetch('/api/students', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(students)
                });

                const result = await response.json();
                if (response.ok) {
                    setBulkAddMessage(`✅ ${result.message}`);
                } else {
                    setBulkAddMessage(`❌ Upload failed: ${result.error}`);
                }

            } catch (error) {
                console.error('Error processing file:', error);
                setBulkAddMessage(`❌ Error: ${error.message}`);
            }
        };

        reader.readAsText(file);
        e.target.value = null; // Reset file input
    };

    const parseCSV = (csvText) => {
        const lines = csvText.trim().split(/\r?\n/);
        const headers = lines[0].split(',').map(h => h.trim());
        return lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index].trim();
                return obj;
            }, {});
        });
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
            {singleAddMessage && <p>{singleAddMessage}</p>}

            <hr style={{ margin: '40px 0' }} />

            <h3>Add Multiple Students from File</h3>
            <p>Upload a .csv or .json file. <br/>CSV must have a header row: <code>reg_no,name,hostel,room_no,sra</code></p>
            <div className="file-upload">
                <input
                    type="file"
                    accept=".csv, .json"
                    onChange={handleFileChange}
                />
            </div>
            {bulkAddMessage && <p>{bulkAddMessage}</p>}
        </div>
    );
}

export default AddStudent;
