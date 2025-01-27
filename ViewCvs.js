import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewCvs = () => {
  const [cvs, setCvs] = useState([]);

  useEffect(() => {
    const fetchCvs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/cvs");
        setCvs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCvs();
  }, []);

  return (
    <div>
      <h2>Submitted CVs</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Remarks</th>
            <th>CV</th>
          </tr>
        </thead>
        <tbody>
          {cvs.map((cv) => (
            <tr key={cv._id}>
              <td>{cv.name}</td>
              <td>{cv.email}</td>
              <td>{cv.phone}</td>
              <td>{cv.remarks}</td>
              <td>
                <a href={`http://localhost:5000/${cv.cv}`} target="_blank" rel="noreferrer">
                  Download CV
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewCvs;
