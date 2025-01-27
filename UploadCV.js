import React, { useState } from "react";
import axios from "axios";

const UploadCv = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    remarks: ""
  });
  
  const [cv, setCv] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setCv(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.position);
    data.append("remarks", formData.position);
    data.append("cv", cv);

    try {
      const res = await axios.post("http://localhost:5000/upload", data);
      alert("CV uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload CV.");
    }
  };

  return (
    <div>
      <h2>Upload Your CV</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Phone:</label>
          <input type="number" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div>
          <label>Remarks:</label>
          <input type="text" name="remarks" value={formData.remarks} onChange={handleChange} required />
        </div>
        <div>
          <label>Upload CV:</label>
          <input type="file" name="cv" onChange={handleFileChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UploadCv;
