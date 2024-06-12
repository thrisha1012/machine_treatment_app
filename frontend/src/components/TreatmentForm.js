import React, { useState } from 'react';
import axios from 'axios';

const TreatmentForm = () => {
  const [machineType, setMachineType] = useState('');
  const [treatment, setTreatment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/treatments', {
        machineType,
        treatment,
      });
      setSubmitted(true);
      console.log(response.data);
    } catch (error) {
      console.error('There was an error submitting the treatment!', error);
    }
  };

  return (
    <div className="container">
      <h1>Machine Treatment Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="machineType">Select Machine Type:</label>
        <select
          id="machineType"
          value={machineType}
          onChange={(e) => setMachineType(e.target.value)}
          required
        >
          <option value="">Select a machine</option>
          <option value="Machine A">Machine A</option>
          <option value="Machine B">Machine B</option>
          <option value="Machine C">Machine C</option>
        </select>

        <label htmlFor="treatment">Provide Treatment:</label>
        <textarea
          id="treatment"
          value={treatment}
          onChange={(e) => setTreatment(e.target.value)}
          rows="4"
          cols="50"
          required
        ></textarea>

        <button type="submit">Submit</button>
      </form>
      {submitted && <p>Thank you for submitting the treatment!</p>}
    </div>
  );
};

export default TreatmentForm;
