import React, { useState, useEffect } from "react";
import { addressAPI } from "../services/api";
import "./AddressForm.css";

const AddressForm = ({ addressId, customerId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    address_details: "",
    city: "",
    state: "",
    pin_code: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  useEffect(() => {
    if (addressId) {
      setInitialLoading(true);
      addressAPI
        .getById(addressId)
        .then((response) => {
          setFormData(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching address:", error);
          setErrors({ general: "Failed to load address data" });
        })
        .finally(() => {
          setInitialLoading(false);
        });
    }
  }, [addressId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.address_details.trim()) {
      newErrors.address_details = "Address details are required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.pin_code.trim()) {
      newErrors.pin_code = "PIN code is required";
    } else if (!/^\d{6}$/.test(formData.pin_code)) {
      newErrors.pin_code = "PIN code must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (addressId) {
        await addressAPI.update(addressId, formData);
      } else {
        await addressAPI.create(customerId, formData);
      }
      onSuccess && onSuccess();
    } catch (error) {
      console.error("Error saving address:", error);
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else {
        setErrors({ general: "An error occurred while saving the address" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="address-form-container">
        <div className="loading-spinner">Loading address data...</div>
      </div>
    );
  }

  return (
    <div className="address-form-container">
      <form onSubmit={handleSubmit} className="address-form">
        <h3>{addressId ? "Edit Address" : "Add New Address"}</h3>

        {errors.general && (
          <div className="error-message general-error">{errors.general}</div>
        )}

        <div className="form-group">
          <label htmlFor="address_details">Address Details</label>
          <textarea
            id="address_details"
            name="address_details"
            value={formData.address_details}
            onChange={handleChange}
            className={errors.address_details ? "error" : ""}
            placeholder="Street address, building name, apartment number..."
            rows="3"
          />
          {errors.address_details && (
            <span className="error-message">{errors.address_details}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? "error" : ""}
              placeholder="Enter city"
            />
            {errors.city && (
              <span className="error-message">{errors.city}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={errors.state ? "error" : ""}
              placeholder="Enter state"
            />
            {errors.state && (
              <span className="error-message">{errors.state}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="pin_code">PIN Code</label>
          <input
            type="text"
            id="pin_code"
            name="pin_code"
            value={formData.pin_code}
            onChange={handleChange}
            className={errors.pin_code ? "error" : ""}
            placeholder="Enter 6-digit PIN code"
            maxLength="6"
          />
          {errors.pin_code && (
            <span className="error-message">{errors.pin_code}</span>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading
              ? "Saving..."
              : addressId
              ? "Update Address"
              : "Add Address"}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
