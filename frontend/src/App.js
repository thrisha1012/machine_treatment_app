import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [machineTypes, setMachineTypes] = useState([]);
  const [selectedMachineType, setSelectedMachineType] = useState('');
  const [treatment, setTreatment] = useState('');

  useEffect(() => {
    // Fetch machine types from the API (or define them statically)
    setMachineTypes(['MachineType1', 'MachineType2', 'MachineType3']);
  }, []);

  const handleSave = async () => {
    if (!selectedMachineType || !treatment) {
      alert('Both fields are required.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/treatments', {
        machineType: selectedMachineType,
        treatment,
      });
      console.log('Saved:', response.data);
      alert('Treatment saved successfully!');
    } catch (error) {
      console.error('Error saving treatment:', error);
      alert('Failed to save treatment.');
    }
  };

  const handleCancel = () => {
    // Logic to handle cancel (reset form or navigate to another page)
    setSelectedMachineType('');
    setTreatment('');
  };

  return (
    <div className="App">
      <h1>Machine Treatment Form</h1>
      <div>
        <label>
          Machine Type:
          <select
            value={selectedMachineType}
            onChange={(e) => setSelectedMachineType(e.target.value)}
          >
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
          Name:
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
    </div>
  );
};

export default App;
