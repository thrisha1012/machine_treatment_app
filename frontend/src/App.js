import React, { useState, useEffect } from 'react';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const App = () => {
    const [machineTypes, setMachineTypes] = useState([]);
    const [machineType, setMachineType] = useState('');
    const [treatment, setTreatment] = useState('');
    const [treatments, setTreatments] = useState([]);
    const [viewMode, setViewMode] = useState('');
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [updateTreatmentId, setUpdateTreatmentId] = useState(null);
    const [updateTreatment, setUpdateTreatment] = useState('');

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
            alert('Treatment saved successfully!');
        }
    };

    const handleUpdate = async (id) => {
        if (!updateTreatment) {
            alert('Treatment field is required.');
            return;
        }

        try {
            const response = await fetch(`/api/treatments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ treatment: updateTreatment }),
            });

            if (!response.ok) {
                throw new Error('Failed to update treatment.');
            }

            const data = await response.json();
            console.log('Updated:', data);
            alert('Treatment updated successfully!');
            fetchTreatments(machineType); // Refresh treatments after successful update
            setUpdateTreatment(''); // Clear update input field
            setUpdateTreatmentId(null); // Reset update treatment ID
        } catch (error) {
            alert('Failed to update treatment.');
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/treatments/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete treatment.');
            }

            alert('Treatment deleted successfully!');
            fetchTreatments(machineType); // Refresh treatments after successful delete
        } catch (error) {
            alert('Failed to delete treatment.');
        }
    };

    const handleCancel = () => {
        setMachineType('');
        setTreatment('');
        setViewMode(''); // Reset view mode when cancelling
    };

    const handleLogin = () => {
        setShowLoginForm(true);
    };

    const handleRegister = () => {
        setShowRegisterForm(true);
    };

    const closeLoginForm = () => {
        setShowLoginForm(false);
    };

    const closeRegisterForm = () => {
        setShowRegisterForm(false);
    };

    return (
        <div className="container mt-5">
            {/* <div className="user-controls">
                <button className="btn btn-outline-primary mr-2" onClick={handleLogin}>
                    Login
                </button>
                <button className="btn btn-outline-success" onClick={handleRegister}>
                    Register
                </button>
            </div> */}
            <div className="header">
                <h1 className="text-center mb-4 text-light">Machine Treatment App</h1>
            </div>
            {!viewMode && (
                <div className="form-group text-center">
                    <select
                        className="form-control"
                        value={machineType}
                        onChange={(e) => {
                            setMachineType(e.target.value);
                            setViewMode('');
                        }}
                        style={{ marginTop: '10px', marginBottom: '10px' }}
                    >
                        <option value="">Machine types</option>
                        {machineTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    <br />
                    <div className="button-group">
                        <button className="btn btn-primary" onClick={() => fetchTreatments(machineType)}>
                            View Treatments
                        </button>
                        <button className="btn btn-success" onClick={() => setViewMode('add')}>
                            Add Treatment
                        </button>
                    </div>
                </div>
            )}
            {viewMode === 'view' && (
                <div className="mt-4">
                    <h2 className="mb-3 text-center">Treatments for {machineType}</h2>
                    <div className="table-responsive">
                        <table className="table table-striped table-centered">
                            <thead>
                                <tr>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {treatments.map((treatment, index) => (
                                    <tr key={index}>
                                        <td>
                                            {updateTreatmentId === treatment._id ? (
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={updateTreatment}
                                                    onChange={(e) => setUpdateTreatment(e.target.value)}
                                                />
                                            ) : (
                                                treatment.treatment
                                            )}
                                        </td>
                                        <td>
                                            {updateTreatmentId === treatment._id ? (
                                                <button className="btn btn-primary" onClick={() => handleUpdate(treatment._id)}>
                                                    Save
                                                </button>
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                    className="text-warning cursor-pointer"
                                                    onClick={() => {
                                                        setUpdateTreatmentId(treatment._id);
                                                        setUpdateTreatment(treatment.treatment);
                                                    }}
                                                />
                                            )}
                                        </td>
                                        <td>
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                className="text-danger cursor-pointer"
                                                onClick={() => handleDelete(treatment._id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
                    <div className="button-group">
                        <button className="btn btn-primary" onClick={handleSave}>
                            Save
                        </button>
                        <button className="btn btn-secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button className="btn btn-secondary" onClick={() => setViewMode('')}>
                            Back
                        </button>
                    </div>
                </div>
            )}
            {showLoginForm && (
                <div className="overlay">
                    <div className="form-container">
                        <h2>Login Form</h2>
                        {/* Your login form JSX */}
                        <button className="btn btn-danger" onClick={closeLoginForm}>
                            Close
                        </button>
                    </div>
                </div>
            )}
            {showRegisterForm && (
                <div className="overlay">
                    <div className="form-container">
                        <h2>Register Form</h2>
                        {/* Your register form JSX */}
                        <button className="btn btn-danger" onClick={closeRegisterForm}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
