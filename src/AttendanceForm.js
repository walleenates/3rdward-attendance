import React, { useState } from "react";
import emailjs from "emailjs-com";
import './App.css';

const AttendanceForm = () => {
  // Checklist names for each auxiliary (including YSA names)
  const checklistNames = {
    "Elders Quorum": [],
    "Relief Society": [],
    "Young Men": [],
    "Young Women": [],
    "RS and EQ combine": [],
    "YM and YWM combine": [],
    "Primary": [],
    "YSA": [
      "Aeron", "Archie", "Carl Gula", "Pocholo", "Christine Baclaan",
      "Dennis Daniel", "Denyce Dabatos", "Diane Daniel", "Ezra",
      "Franzyn Dabatos", "Ian Rei", "Ivy Barros", "Joshua Ejares", 
      "Julito", "Kisha Daniel", "Kristine Caylan", "Laiza", "Laurence", 
      "Melody", "Marigold", "Rhyzel", "Shannen", "Trisha", "Vinz Pedrano", 
      "Walleen Gwapo", "Yana Riego"
    ]
  };

  const [name, setName] = useState(""); // Single name input for new names
  const [selectedNames, setSelectedNames] = useState([]); // List of selected names
  const [formData, setFormData] = useState({
    category: "",
    customCategory: "", // For custom category input
    recorder: "", // For recorder input
  });

  const [submitted, setSubmitted] = useState(false); // To track submission status
  const [recorderError, setRecorderError] = useState(""); // State for recorder error message

  // Allowed recorder names
  const allowedRecorders = [
    "Roy Cotejo", "Elias Concardas", "Archie Ruda", "Joshua Ejares",
    "Marigold", "Denyce", "Anievie", "Ezra Mae",
    "Steven Jan", "Levi", "Michael", "Delia",
    "Chelo Marie", "Remedios", "Maryhall", "Ana Maria",
    "Jecka", "Aeron"
  ];

  const handleNameChange = (e) => setName(e.target.value);

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, category: value, customCategory: value === "Others" ? "" : formData.customCategory });
    setSelectedNames([]); // Reset names if category is changed
  };

  const handleCustomCategoryChange = (e) => {
    setFormData({ ...formData, customCategory: e.target.value });
  };

  const handleRecorderChange = (e) => {
    setFormData({ ...formData, recorder: e.target.value });
    setRecorderError(""); // Reset error message on input change
  };

  // Handle selection from checklist
  const handleChecklistChange = (e, name) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedNames([...selectedNames, name]); // Add name if checked
    } else {
      setSelectedNames(selectedNames.filter(n => n !== name)); // Remove name if unchecked
    }
  };

  const handleAddName = (e) => {
    e.preventDefault();
    if (name.trim() !== "") {
      setSelectedNames([...selectedNames, name]); // Add new name to the selected list
      setName(""); // Reset input field
    }
  };

  // Function to delete a name from the selected names list
  const handleDeleteName = (nameToDelete) => {
    setSelectedNames(selectedNames.filter(n => n !== nameToDelete));
  };

  const validateRecorder = () => {
    if (formData.recorder.trim() === "" || !allowedRecorders.includes(formData.recorder)) {
      setRecorderError("You are not authorized!"); // Set error message if invalid
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (formData.category === "") {
      alert("Please select an auxiliary before submitting.");
      return;
    }

    if (!validateRecorder()) {
      return;
    }

    const totalNames = selectedNames.length;
    const fullData = {
      category: formData.category === "Others" ? formData.customCategory : formData.category,
      names: selectedNames.join(", "), // List of names
      date: new Date().toLocaleDateString(),
      total: totalNames,
      recorder: formData.recorder
    };

    const confirmation = window.confirm("Are you sure you want to submit the attendance?");
    if (confirmation) {
      const serviceID = "service_4nqmnnj";
      const templateID = "template_1yw0w9s";
      const userID = "r_Gc_TmxGbWOvqOYj";

      emailjs
        .send(serviceID, templateID, fullData, userID)
        .then((result) => {
          alert("Attendance sent successfully!");
          setSubmitted(true);
        })
        .catch((error) => {
          alert("Failed to send attendance: ", error.text);
        });

      setFormData({ category: "", customCategory: "", recorder: "" });
      setSelectedNames([]);
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
              <option value="YSA">YSA</option> {/* YSA names are now included */}
              <option value="Others">Others</option>
            </select>
          </div>

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

          {formData.category && formData.category !== "Others" && (
            <div>
              <h3>Select Names:</h3>
              {checklistNames[formData.category].map((name, index) => (
                <div key={index}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedNames.includes(name)}
                      onChange={(e) => handleChecklistChange(e, name)}
                    />
                    {name}
                  </label>
                </div>
              ))}
            </div>
          )}

          <div>
            <label>Add Additional Name:</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              disabled={!formData.category}
            />
            <button onClick={handleAddName} disabled={!formData.category}>
              Add Name
            </button>
          </div>

          <div>
            <h3>Selected Names:</h3>
            <ul>
              {selectedNames.map((n, index) => (
                <li key={index}>
                  {n}
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteName(n)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

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

          <div className="center-container">
            {selectedNames.length > 0 && (
              <button type="button" onClick={handleSubmit}>
                Submit Attendance
              </button>
            )}
          </div>
        </form>
      ) : (
        <h3>Attendance has been submitted!</h3>
      )}
    </div>
  );
};

export default AttendanceForm;
