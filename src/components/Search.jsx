import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoSearch } from 'react-icons/io5';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [saltData, setSaltData] = useState([]);
  const [formOptions, setFormOptions] = useState([]);
  const [strengthOptions, setStrengthOptions] = useState([]);
  const [packingOptions, setPackingOptions] = useState([]);
  const [saltSuggestions, setSaltSuggestions] = useState([]);
  const [selectedSalt, setSelectedSalt] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedStrength, setSelectedStrength] = useState(null);
  const [selectedPacking, setSelectedPacking] = useState(null);

  // const strengthOption = ['100mg', '500mg'];
  // const packingOption = ['5 strips', '10 strips'];

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm.trim()) {
        const response = await axios.get(
          `https://backend.cappsule.co.in/api/v1/new_search?q=${searchTerm}&pharmacyIds=1,2,3`
        );
        setSaltSuggestions(response.data.data.saltSuggestions);
      } else {
        setSaltSuggestions([]);
      }
    };
    fetchData();
  }, [searchTerm]);

  useEffect(() => {
    const salt = saltData.length > 0 ? saltData[0] : null;
    if (salt) {
      setFormOptions(salt.available_forms);
      setSelectedForm(salt.most_common.form);
      setSelectedStrength(salt.most_common.strength);
      setSelectedPacking(salt.most_common.packing);
      setStrengthOptions(
        Object.keys(salt.salt_forms_json[salt.most_common.form] || {})
      );
      setPackingOptions(
        Object.keys(
          salt.salt_forms_json[salt.most_common.form][
            salt.most_common.strength
          ] || {}
        )
      );
    }
  }, [saltData]);

  const handleFormChange = (form) => {
    setSelectedForm(form);
    const salt = saltData.length > 0 ? saltData[0] : null;
    if (salt) {
      setStrengthOptions(Object.keys(salt.salt_forms_json[form] || {}));
      setSelectedStrength('');
      setSelectedPacking('');
    }
  };

  const handleStrengthChange = (strength) => {
    setSelectedStrength(strength);
    const salt = saltData.length > 0 ? saltData[0] : null;
    if (salt) {
      setPackingOptions(
        Object.keys(salt.salt_forms_json[selectedForm][strength] || {})
      );
      setSelectedPacking('');
    }
  };

  const handlePackingChange = (packing) => {
    setSelectedPacking(packing);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSaltClick = (salt) => {
    setSelectedSalt(salt);
    setSelectedForm(salt.available_forms[0]);
    setSelectedStrength(salt.most_common.Strength);
    setSelectedPacking(salt.most_common.Packing);
  };

  const handleFormClick = (form) => {
    setSelectedForm(form);
    setSelectedStrength(null);
    setSelectedPacking(null);
  };

  const handleStrengthClick = (strength) => {
    setSelectedStrength(strength);
    setSelectedPacking(null);
  };

  const handlePackingClick = (packing) => {
    setSelectedPacking(packing);
  };

  const getLowerPrice = (formData, strength, packing) => {
    const salt = saltData.length > 0 ? saltData[0] : null;
    if (salt) {
      const packingData =
        salt.salt_forms_json[selectedForm][selectedStrength][selectedPacking];
      if (packingData) {
        const prices = packingData
          .flatMap((product) => product.map((p) => p.selling_price))
          .filter((p) => p !== null);
        const lowestPrice = Math.min(...prices);
        return `From &#8377;${lowestPrice}`;
        // const pricbb+bes = Object.values(packingData)
        //   .flatMap((products) => products)
        //   .map((product) => product.selling_price);
        // return `From ${Math.min(...prices)}`;
      }
    }
    return 'No stores selling this product near you';
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-center mt-5 justify-content-center mt-5">
          <div className="col-md-10">
            <h1 className="fs-2 text-center mb-5">
              Cappsule Web Development Test
            </h1>
            <div className="input-group d-flex justify-content-center align-items-center">
              <input
                className="search-input py-3 position-relative border-0 rounded-pill"
                type="text"
                name="search-input"
                value={searchTerm}
                placeholder="Type your medicine name here"
                onChange={handleSearchChange}
              />
              <IoSearch className="icon position-absolute fs-3 text-black-50 ms-3 " />
              <div className="input-group-append">
                <button
                  className="search-btn py-3 position-absolute border-0 bg-transparent fw-bold"
                  type=""
                >
                  Search
                </button>
              </div>
            </div>
            <hr className="mt-5 fw-bold text-black-50 " />
          </div>
        </div>
        <div className="row justify-content-center mt-5">
          <div className="col-md-8">
            {saltSuggestions.map((salt) => (
              <div key={salt.id} className="card mb-3">
                <div className="card-body">
                  <h5
                    className="card-title"
                    onClick={() => handleSaltClick(salt)}
                  >
                    {salt.salt}
                  </h5>
                  {selectedSalt === salt && (
                    <>
                      <div className="form-group">
                        <label>Form:</label>
                        <div className="btn-group btn-group-toggle">
                          {salt.available_forms.map((form, index) => (
                            <label
                              key={index}
                              className={`btn btn-secondary ${
                                selectedForm === form ? 'active' : ''
                              }`}
                            >
                              <input
                                type="radio"
                                name="form"
                                value=""
                                checked={selectedForm === form}
                                onChange={() => handleFormClick(form)}
                              />
                              <button
                                type="button"
                                key={form}
                                className={`btn btn-secondary ${
                                  form === 'Tablet' ? 'active' : ''
                                }`}
                                onClick={() => handleFormChange(form)}
                              >
                                Tablet
                              </button>
                              <button
                                type="button"
                                className={`btn btn-outline-primary ${
                                  form === 'Injection' ? 'active' : ''
                                }`}
                                onClick={() => setSelectedForm('Injection')}
                              >
                                Injection
                              </button>
                              {''}
                              {form}
                            </label>
                          ))}
                        </div>
                      </div>
                      {selectedForm && (
                        <>
                          <div className="form-group">
                            <label for="">Strength:</label>
                            <div className="btn-group btn-group-toggle">
                              {Object.keys(
                                salt.salt_forms_json[selectedForm] || {}
                              ).map((strength, index) => (
                                <label
                                  key={index}
                                  className={`btn btn-secondary ${
                                    selectedStrength === strength
                                      ? 'active'
                                      : ''
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="strength"
                                    checked={selectedStrength === strength}
                                    onChange={handleStrengthClick(strength)}
                                  />
                                  <button
                                    key={strength}
                                    type="button"
                                    className={`btn btn-outline-primary ${
                                      selectedStrength === strength
                                        ? 'active'
                                        : ''
                                    }`}
                                    onClick={() =>
                                      handleStrengthChange(strength)
                                    }
                                  ></button>
                                  {strength}
                                </label>
                              ))}
                            </div>
                          </div>
                          {selectedStrength && (
                            <div className="form-group">
                              <label for="">Packing:</label>
                              <div className="btn-group btn-group-toggle">
                                {Object.keys(
                                  salt.salt_forms_json[selectedForm][
                                    selectedStrength
                                  ]
                                ).map((packing, index) => (
                                  <label
                                    key={index}
                                    className={`btn btn-secondary ${
                                      selectedPacking === packing
                                        ? 'active'
                                        : ''
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name="packing"
                                      checked={selectedPacking === packing}
                                      onChange={() =>
                                        handlePackingClick(packing)
                                      }
                                    />{' '}
                                    <button
                                      key={packing}
                                      type="button"
                                      className={`btn btn-outline-primary ${
                                        selectedPacking === packing
                                          ? 'active'
                                          : ''
                                      }`}
                                      onClick={() =>
                                        handlePackingChange(packing)
                                      }
                                    ></button>
                                    {packing}
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                          {selectedPacking && (
                            <p>
                              Price:{''}
                              {getLowerPrice(
                                salt.salt_forms_json[selectedForm],
                                selectedStrength,
                                selectedPacking
                              )}
                            </p>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* <div className="row">
          <div className="col-md-8">
            <div className="mb-3">
              <label for="" className="form-label">
                Form:
              </label>
              <div className="btn-group" role="group">
                {formOptions.map((form) => (
                  <button
                    key={form}
                    type="button"
                    className={`btn btn-outline-primary ${
                      selectedForm === form ? 'active' : ''
                    }`}
                    onClick={() => handleFormChange(form)}
                  >
                    {form}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label for="" className="form-label">
                Strength:
              </label>
              <div className="btn-group" role="group">
                {strengthOptions.map((strength) => (
                  <button
                    key="strength"
                    type="button"
                    className={`btn btn-outline-primary ${
                      selectedStrength === strength ? 'active' : ''
                    }`}
                    onClick={() => handleStrengthChange(strength)}
                  >
                    {strength}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label for="" className="form-label">
                Packaging
              </label>
              <div className="btn-group" role="group">
                {packingOptions.map((packing) => (
                  <button
                    key={packing}
                    type="button"
                    className={`btn btn-outline-primary ${
                      selectedPacking === packing ? 'active' : ''
                    }`}
                    onClick={() => handlePackingChange(packing)}
                  >
                    {packing}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div> */}
        <div className="row justify-content-center mt-5 justify-content-center mt-5 text-center">
          <div className="col-md-10">
            <div className="bottom-text position-relative ">
              <p className="position-absolute text-center text-black-50 fw-bold fs-5">
                "Find medicines with amazing discounts"
              </p>
            </div>
          </div>
        </div>
        <div className="row justify-content-center mb-5">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  {selectedForm} {selectedStrength} | {selectedPacking}
                </h5>
                <p className="card-text">
                  {selectedPacking &&
                    getLowerPrice(
                      saltSuggestions[0].salt_forms_json[selectedForm],
                      selectedStrength,
                      selectedPacking
                    )}
                </p>
              </div>
            </div>
          </div>
        </div>{' '}
      </div>
    </>
  );
};

export default Search;
