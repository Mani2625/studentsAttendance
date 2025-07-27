// src/Filters.js
function Filters({ filterStatus, setFilterStatus }) {
    return (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
            <button
                className={filterStatus === 'All' ? 'active' : ''}
                onClick={() => setFilterStatus('All')}
            >
                All
            </button>
            <button
                className={filterStatus === 'Present' ? 'active' : ''}
                onClick={() => setFilterStatus('Present')}
            >
                Present
            </button>
            <button
                className={filterStatus === 'Absent' ? 'active' : ''}
                onClick={() => setFilterStatus('Absent')}
            >
                Absent
            </button>
        </div>
    );
}

export default Filters;
