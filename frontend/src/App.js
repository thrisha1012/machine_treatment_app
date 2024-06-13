import React, { useState, useEffect } from 'react';

const App = () => {
    const [machineTypes, setMachineTypes] = useState([]);
    const [machineType, setMachineType] = useState('');
    const [treatment, setTreatment] = useState('');
    const [treatments, setTreatments] = useState([]);
    const [viewMode, setViewMode] = useState(''); // State to track view or add treatment mode

    useEffect(() => {
        // Fetch machine types from API or define statically
        setMachineTypes([
            'MRI Machine (Magnetic Resonance Imaging)',
            'CT Scanner (Computed Tomography)',
            'Ultrasound Machine',
            'X-Ray Machine',
            'ECG Machine (Electrocardiogram)',
            'Ventilator',
            'Dialysis Machine',
            'Infusion Pump',
            'Anesthesia Machine',
            'Defibrillator',
            'Endoscope',
            'Patient Monitor',
        ]);
    }, []);

    const fetchTreatments = async (type) => {
        try {
            const response = await fetch(`/api/treatments/${type}`);
            if (!response.ok) {
                throw new Error('Failed to fetch treatments.');
            }
            const data = await response.json();
            setTreatments(data);
            setViewMode('view'); // Switch to view treatments mode
        } catch (error) {
            console.error('Error fetching treatments:', error);
        }
    };

    const handleSave = async () => {
        if (!machineType || !treatment) {
            alert('Both fields are required.');
            return;
        }

        try {
            const response = await fetch('/api/treatments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ machineType, treatment }),
            });

            if (!response.ok) {
                throw new Error('Failed to save treatment.');
            }

            const data = await response.json();
            console.log('Saved:', data);
            alert('Treatment saved successfully!');
            fetchTreatments(machineType); // Refresh treatments after successful save
            setTreatment(''); // Clear treatment input field
        } catch (error) {
            console.error('Error saving treatment:', error);
            alert('Failed to save treatment.');
        }
    };

    const handleCancel = () => {
        setMachineType('');
        setTreatment('');
        setViewMode(''); // Reset view mode when cancelling
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Machine Treatment App</h1>
            {!viewMode && (
                <div className="form-group">
                    <label>Select Machine Type:</label>
                    <select
                        className="form-control"
                        value={machineType}
                        onChange={(e) => {
                            setMachineType(e.target.value);
                            setViewMode('');
                        }}
                    >
                        <option value="">Select a machine type</option>
                        {machineTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    <button className="btn btn-primary mt-3" onClick={() => fetchTreatments(machineType)}>
                        View Treatments
                    </button>
                    <button className="btn btn-success ml-2 mt-3" onClick={() => setViewMode('add')}>
                        Add Treatment
                    </button>
                </div>
            )}
            {viewMode === 'view' && (
                <div className="mt-4">
                    <h2 className="mb-3">All Treatments for {machineType}</h2>
                    <ul className="list-group">
                        {treatments.map((treatment, index) => (
                            <li key={index} className="list-group-item">
                                <strong>{treatment.machineType}: </strong>
                                {treatment.treatment}
                            </li>
                        ))}
                    </ul>
                    <button className="btn btn-secondary mt-3" onClick={() => setViewMode('')}>
                        Back
                    </button>
                </div>
            )}
            {viewMode === 'add' && (
                <div className="add-treatment-form mt-4">
                    <h2 className="mb-3">Add Treatment for {machineType}</h2>
                    <div className="form-group">
                        <label>Treatment:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={treatment}
                            onChange={(e) => setTreatment(e.target.value)}
                        />
                    </div>
                    <div className="button-group mt-3">
                        <button className="btn btn-primary mr-2" onClick={handleSave}>
                            Save
                        </button>
                        <button className="btn btn-secondary mr-2" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button className="btn btn-secondary" onClick={() => setViewMode('')}>
                            Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
