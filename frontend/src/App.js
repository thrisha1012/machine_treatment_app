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
    const [updateTreatmentId, setUpdateTreatmentId] = useState(null);
    const [updateTreatment, setUpdateTreatment] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [showRegister, setShowRegister] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
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
            setViewMode('view'); 
        } catch (error) {
            console.error('Error fetching treatments:', error);
        }
    };

    const handleSave = async () => {
        if (!machineType || !treatment) {
            alert('Both fields are required.');
            return;
        }

        if (!isAuthenticated) {
            setViewMode('login');
            return;
        }

        try {
            const response = await fetch('/api/treatments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ machineType, treatment }),
            });

            if (!response.ok) {
                throw new Error('Failed to save treatment.');
            }

            setShowPopup(true);

            setTimeout(() => {
                setShowPopup(false);
            }, 3000);

            setTreatment('');

            setViewMode(''); // Go back to the initial view mode

        } catch (error) {
            alert('Failed to save treatment.');
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
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ treatment: updateTreatment }),
            });

            if (!response.ok) {
                throw new Error('Failed to update treatment.Check whether you have sign in.');
            }

            const data = await response.json();
            console.log('Updated:', data);
            alert('Treatment updated successfully!');
            fetchTreatments(machineType);
            setUpdateTreatment('');
            setUpdateTreatmentId(null);
        } catch (error) {
            alert('Failed to update treatment.');
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/treatments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete treatment.Check whether you have sign in.');
            }

            alert('Treatment deleted successfully!');
            fetchTreatments(machineType);
        } catch (error) {
            alert('Failed to delete treatment.');
        }
    };

    const handleCancel = () => {
        setMachineType('');
        setTreatment('');
        setViewMode(''); 
    };

    const login = async (email, password) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Failed to login.');
            }

            const data = await response.json();
            setUser(data.user);
            setIsAuthenticated(true);
            setViewMode('add');
        } catch (error) {
            alert('Failed to login.');
        }
    };

    const register = async (email, password) => {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Failed to register.');
            }

            const data = await response.json();
            alert('Registration successful! Please login.');
            setShowRegister(false);
            setViewMode('login');
        } catch (error) {
            alert('Failed to register.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="header">
                <h1 className="text-center mb-4 text-light">Machine Treatment App</h1>
            </div>
            {viewMode === '' && (
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
                        <button 
                            className="btn btn-primary" 
                            onClick={() => fetchTreatments(machineType)}
                            disabled={!machineType} // Disable button if no machine type selected
                        >
                            View Treatments
                        </button>
                        <button 
                            className="btn btn-success" 
                            onClick={() => {
                                if (isAuthenticated) {
                                    setViewMode('add');
                                } else {
                                    setViewMode('login');
                                }
                            }}
                            disabled={!machineType} // Disable button if no machine type selected
                        >
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
                
                        <button className="btn btn-secondary" onClick={() => setViewMode('')}>
                            Back
                        </button>
                    </div>
                </div>
            )}
            {viewMode === 'login' && !showRegister && (
                <div className="overlay">
                    <div className="form-container">
                        <h2>Login</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const email = e.target.email.value;
                            const password = e.target.password.value;
                            login(email, password);
                        }}>
                            <div className="form-group">
                                <label>Email:</label>
                                <input type="email" name="email" className="form-control" required />
                            </div>
                            <div className="form-group">
    <label>Password:</label>
    <input
        type="password"
        name="password"
        className="form-control"
        style={{ marginBottom: '10px' }} // Adding space below the input
        required
    />
</div>
<div className="text-center" style={{ marginTop: '10px' }}> {/* Adding space above the button */}
    <button type="submit" className="btn btn-primary">Login</button>
</div>

                        </form>
                        <hr />
                        <div className="text-center">
                            <p>If not registered, please <a href="#" onClick={() => setShowRegister(true)}>register</a>.</p>
                        </div>
                        <button className="btn btn-danger mt-3" onClick={handleCancel}>
                            Close
                        </button>
                    </div>
                </div>
            )}
            {showRegister && (
                <div className="overlay">
                    <div className="form-container">
                        <h2>Register</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const email = e.target.email.value;
                            const password = e.target.password.value;
                            register(email, password);
                        }}>
                            <div className="form-group">
                                <label>Email:</label>
                                <input type="email" name="email" className="form-control" required />
                            </div>
                            <div className="form-group">
    <label>Password:</label>
    <input
        type="password"
        name="password"
        className="form-control"
        style={{ marginBottom: '10px' }} // Adding space below the input
        required
    />
</div>
<div style={{ textAlign: 'center' }}>
    <button type="submit" className="btn btn-secondary">Register</button>
</div>

                        </form>
                        <button className="btn btn-danger mt-3" onClick={() => setShowRegister(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
