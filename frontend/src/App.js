// App.js

import React, { useState, useEffect } from 'react';

const App = () => {
    const [machineTypes, setMachineTypes] = useState([]);
    const [machineType, setMachineType] = useState('');
    const [treatment, setTreatment] = useState('');
    const [treatments, setTreatments] = useState([]);

    useEffect(() => {
        // Fetch machine types from API or define statically
        setMachineTypes(['MRI Machine (Magnetic Resonance Imaging)', 'CT Scanner (Computed Tomography)', 'Ultrasound Machine','X-Ray Machine','ECG Machine (Electrocardiogram)','Ventilator','Dialysis Machine','Infusion Pump','Anesthesia Machine','Defibrillator','Endoscope','Dialysis Machine','Patient Monitor']);

        // Fetch treatments for default machine type on component mount
        if (machineTypes.length > 0) {
            fetchTreatments(machineTypes[0]); // Fetch treatments for the first machine type by default
        }
    }, []); // Empty dependency array ensures useEffect runs only on component mount

    const fetchTreatments = async (type) => {
        try {
            const response = await fetch(`/api/treatments/${type}`);
            if (!response.ok) {
                throw new Error('Failed to fetch treatments.');
            }
            const data = await response.json();
            setTreatments(data);
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
            <h1>Machine Treatment Form</h1>
            <div>
                <label>
                    Machine Type:
                    <select value={machineType} onChange={(e) => {
                        setMachineType(e.target.value);
                        fetchTreatments(e.target.value); // Fetch treatments for selected machine type
                    }}>
                        <option value="">Select a machine type</option>
                        {machineTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Treatment:
                    <input
                        type="text"
                        value={treatment}
                        onChange={(e) => setTreatment(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <button onClick={handleSave}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
            </div>
            <div>
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
        </div>
    );
};

export default App;
