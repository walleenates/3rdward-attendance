import React, { useState } from "react";
import emailjs from "emailjs-com";
import './App.css';

const AttendanceForm = () => {
  const [name, setName] = useState(""); // Single name input
  const [names, setNames] = useState([]); // List of multiple names
  const [formData, setFormData] = useState({
    category: "",
    customCategory: "", // For custom category input
    recorder: "", // For recorder input
  });

  const [submitted, setSubmitted] = useState(false); // To track submission status
  const [recorderError, setRecorderError] = useState(""); // State for recorder error message

  // Allowed words for the recorder's name
  const allowedWords = [
    "Roy Cotejo", "Elias Concardas", "Archie Ruda", "Joshua Ejares",
    "Marigold", "Denyce", "Anievie", "Ezra Mae",
    "Steven Jan", "Levi", "Michael", "Delia",
    "Chelo Marie", "Remedios", "Maryhall", "Ana Maria",
    "Jecka", "Aeron"
  ]; // Add allowed names here

  const handleNameChange = (e) => setName(e.target.value);

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, category: value, customCategory: value === "Others" ? "" : formData.customCategory });
  };

  const handleCustomCategoryChange = (e) => {
    setFormData({ ...formData, customCategory: e.target.value });
  };

  const handleRecorderChange = (e) => {
    setFormData({ ...formData, recorder: e.target.value });
    setRecorderError(""); // Reset error message on input change
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

  const validateRecorder = () => {
    // Check if recorder is blank or not in allowed words
    if (formData.recorder.trim() === "" || !allowedWords.includes(formData.recorder)) {
      setRecorderError("You are not authorized!"); // Set error message if invalid
      return false; // Prevent submission if recorder is invalid
    }
    return true; // Valid recorder
  };

  const handleSubmit = () => {
    // Check if category is selected
    if (formData.category === "") {
      alert("Please select an auxiliary before submitting.");
      return; // Prevent submission if no category is selected
    }

    // Check if recorder is valid
    if (!validateRecorder()) {
      return; // Prevent submission if recorder is invalid
    }

    // Prepare the full data to send via email
    const totalNames = names.length; // Count the total number of names
    const fullData = {
      category: formData.category === "Others" ? formData.customCategory : formData.category, // Use custom category if selected
      names: names.join(", "),             // List of names, joined by comma
      date: new Date().toLocaleDateString(), // Current date
      total: totalNames,                   // Total number of names
      recorder: formData.recorder           // Recorder's name
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
      setFormData({ category: "", customCategory: "", recorder: "" });
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
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Show custom category input if "Others" is selected */}
          {formData.category === "Others" && (
            <div>
              <label>Custom Category:</label>
              <input
                type="text"
                value={formData.customCategory}
                onChange={handleCustomCategoryChange}
                required
              />
            </div>
          )}

          {/* Recorder input */}
          <div>
            <label>Recorded and Confirmed By:</label>
            <input
              type="text"
              value={formData.recorder}
              onChange={handleRecorderChange}
              required
            />
            {recorderError && <span className="error-message">{recorderError}</span>}
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
                  {n} <button className="delete-button" onClick={() => handleDeleteName(index)}>Delete</button>
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
