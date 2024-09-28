import React, { useState } from "react";
import emailjs from "emailjs-com";
import './App.css';

const AttendanceForm = () => {
  const [name, setName] = useState(""); // Single name input
  const [names, setNames] = useState([]); // List of multiple names
  const [formData, setFormData] = useState({
    category: "",
  });

  const [submitted, setSubmitted] = useState(false); // To track submission status

  const handleNameChange = (e) => setName(e.target.value);

  const handleCategoryChange = (e) => {
    setFormData({ ...formData, category: e.target.value });
  };

  const handleAddName = (e) => {
    e.preventDefault();
    if (name.trim() !== "") {
      setNames([...names, name]); // Add name to the list
      setName(""); // Reset input field
    }
  };

  const handleDeleteName = (index) => {
    setNames(names.filter((_, i) => i !== index)); // Remove name by index
  };

  const handleSubmit = () => {
    // Check if category is selected
    if (formData.category === "") {
      alert("Please select an auxiliary before submitting.");
      return; // Prevent submission if no category is selected
    }

    // Prepare the full data to send via email
    const totalNames = names.length; // Count the total number of names
    const fullData = {
      category: formData.category,         // Category selected
      names: names.join(", "),             // List of names, joined by comma
      date: new Date().toLocaleDateString(), // Current date
      total: totalNames                     // Total number of names
    };

    const confirmation = window.confirm("Are you sure you want to submit the attendance?");

    if (confirmation) {
      // EmailJS configuration
      const serviceID = "service_4nqmnnj";
      const templateID = "template_1yw0w9s";
      const userID = "r_Gc_TmxGbWOvqOYj";

      emailjs
        .send(serviceID, templateID, fullData, userID)
        .then((result) => {
          alert("Attendance sent successfully!");
          setSubmitted(true); // Mark as submitted
        })
        .catch((error) => {
          alert("Failed to send attendance: ", error.text);
        });

      // Reset form after submission
      setFormData({ category: "" });
      setNames([]);
    }
  };

  return (
    <div className="attendance-form">
      <h2>Attendance Form</h2>
      {!submitted ? (
        <form>
          <div>
            <label>Auxiliary:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Select Auxiliary</option>
              <option value="Elders Quorum">Elders Quorum</option>
              <option value="Relief Society">Relief Society</option>
              <option value="Young Men">Young Men</option>
              <option value="Young Women">Young Women</option>
              <option value="RS and EQ combine">RS and EQ combine</option>
              <option value="YM and YWM combine">YM and YWM combine</option>
              <option value="Primary">Primary</option>
            </select>
          </div>
          
          {/* Disable the name input if no category is selected */}
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              disabled={!formData.category} // Disable if no category is selected
              required
            />
            <button onClick={handleAddName} disabled={!formData.category}>
              Add Name
            </button>
          </div>
          
          <div>
            <h3>Added Names:</h3>
            <ul>
            {names.map((n, index) => (
  <li key={index}>
    {n} 
    <button className="delete-button" onClick={() => handleDeleteName(index)}>
      Delete
    </button>
  </li>
))}
            </ul>
          </div>

          {/* "Submit Attendance" button */}
          {names.length > 0 && (
            <button type="button" onClick={handleSubmit}>
              Submit Attendance
            </button>
          )}
        </form>
      ) : (
        <h3>Attendance has been submitted!</h3>
      )}
    </div>
  );
};

export default AttendanceForm;
