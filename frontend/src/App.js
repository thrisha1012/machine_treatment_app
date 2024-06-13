import React, { useState, useEffect } from 'react';

const App = () => {
    const [machineTypes, setMachineTypes] = useState([]);
    const [machineType, setMachineType] = useState('');
    const [treatment, setTreatment] = useState('');
    const [treatments, setTreatments] = useState([]);
    const [viewTreatmentsMode, setViewTreatmentsMode] = useState(false);

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
            setViewTreatmentsMode(true); // Switch to view treatments mode
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
        } catch (error) {
            console.error('Error saving treatment:', error);
            alert('Failed to save treatment.');
        }
    };

    const handleCancel = () => {
        setMachineType('');
        setTreatment('');
    };

    return (
        <div className="App">
            <h1>Machine Treatment App</h1>
            <div className="form-group">
                <label>Select Machine Type:</label>
                <select
                    className="form-control"
                    value={machineType}
                    onChange={(e) => {
                        setMachineType(e.target.value);
                        setViewTreatmentsMode(false); // Reset view treatments mode
                    }}
                >
                    <option value="">Select a machine type</option>
                    {machineTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>
            {!viewTreatmentsMode && (
                <div className="button-group">
                    <button className="btn btn-primary" onClick={() => fetchTreatments(machineType)}>
                        View Treatments
                    </button>
                    <button className="btn btn-success" onClick={() => setViewTreatmentsMode(true)}>
                        Add Treatment
                    </button>
                </div>
            )}
            {viewTreatmentsMode && (
                <div className="treatments">
                    <h2>All Treatments for {machineType}</h2>
                    <ul>
                        {treatments.map((treatment, index) => (
                            <li key={index}>
                                <strong>{treatment.machineType}: </strong>
                                {treatment.treatment}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {viewTreatmentsMode && (
                <div className="add-treatment-form">
                    <h2>Add Treatment</h2>
                    <div>
                        <label>
                            Treatment:
                            <input
                                type="text"
                                className="form-control"
                                value={treatment}
                                onChange={(e) => setTreatment(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="button-group">
                        <button className="btn btn-primary" onClick={handleSave}>
                            Save
                        </button>
                        <button className="btn btn-secondary" onClick={() => setViewTreatmentsMode(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
