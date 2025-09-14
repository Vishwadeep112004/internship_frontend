import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [biomass, setBiomass] = useState('');

  const featureMapping = {
    "Pyrolysis Temperature (°C)": "pyrolusis",
    "BET Surface Area (m²/g)": "BET",
    "ICE Content (%)": "ICE",
    "Reversible Charge (mAh/g)": "Rch",
    "Cycle Number": "Cycle N",
    "Retention Ratio (%)": "Retention ratio",
    "H Charge (mAh/g)": "H charge",
    "H Capacity (mAh/g)": "H capacity"
  };

  const [features, setFeatures] = useState(
    Object.fromEntries(Object.values(featureMapping).map(k => [k, '']))
  );

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const biomassOptions = [
    "Macadamia nutshell", "Pine pollen", "Wheat straw", "Pistachio shell",
    "Switchgrass", "Walnut shell", "Blue-green algae", "Cedarwood bark",
    "Chlorella vulgaris", "Waste bagasse", "Jackfruit rag", "Sorghum stalk",
    "Walnut shell", "Waste coffee", "Spartina alterniflora", "Eucalyptus",
    "Wood block", "Oatmeal", "Date palm seed", "Miscanthus",
    "Fir wood", "Rice husk", "Ash wood", "Sugarcane bagasse",
    "Olive stone", "Kapok fiber", "Apple pomace", "Corn cob",
    "Cherry petal", "Silver willow blossom", "Beech wood", "Macadamia shell",
    "Corn straw pith", "Almond shell", "Coconut endocarp", "Corn silk",
    "Cotton", "Scrap wood", "Sycamore fruit", "Pine wood", "Tamarind fruits",
    "Lotus seedpod", "Poplar wood", "Mangosteen shell", "Argan shell",
    "Kelp algae", "Maple tree", "Lotus stem", "Walnut shell", "Waste cork",
    "Oak leave", "Soybean root", "Pinecone", "Rice husk", "Dandelion",
    "Spinifex", "Ginkgo leave", "Water caltrop", "Lyche seed", "Buckwheat hulls",
    "Shaddock peel"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeatures(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await axios.post(
        'https://internship-backend-ivo5.onrender.com/api/predict/',
        { Biomass: biomass, ...features }
      );
      setResult(response.data.Reversible_capacity);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Predict Reversible Capacity</h1>
      <form className="app-form" onSubmit={handleSubmit}>
        <label className="app-label">
          Biomass:
          <select
            className="app-select"
            value={biomass}
            onChange={(e) => setBiomass(e.target.value)}
            required
          >
            <option value="">Select biomass</option>
            {biomassOptions.map((b, idx) => (
              <option key={idx} value={b}>{b}</option>
            ))}
          </select>
        </label>

        {Object.entries(featureMapping).map(([label, key]) => (
          <div key={key} className="feature-input">
            <label className="app-label">
              {label}:
              <br />
              <input
                className="app-input"
                type="number"
                name={key}
                value={features[key]}
                onChange={handleChange}
                required
                step="any"
              />
            </label>
          </div>
        ))}

        {!loading && (
          <button type="submit" className="app-button">
            Predict
          </button>
        )}
      </form>

      {loading && <div className="loader">Loading...</div>}
      {result && !loading && (
        <h2 className="app-result">Predicted Reversible Capacity: {result}</h2>
      )}
      {error && !loading && <h2 className="app-error">Error: {error}</h2>}
    </div>
  );
}

export default App;
