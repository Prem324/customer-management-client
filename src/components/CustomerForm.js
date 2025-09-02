import React, { useState, useEffect } from "react";
import { customerAPI } from "../services/api";
import "./CustomerForm.css";

const CustomerForm = ({ customerId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  useEffect(() => {
    if (customerId) {
      setInitialLoading(true);
      customerAPI
        .getById(customerId)
        .then((response) => {
          setFormData(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching customer:", error);
          setErrors({ general: "Failed to load customer data" });
        })
        .finally(() => {
          setInitialLoading(false);
        });
    }
  }, [customerId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone_number.replace(/\D/g, ""))) {
      newErrors.phone_number = "Phone number must be 10 digits";
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
      if (customerId) {
        await customerAPI.update(customerId, formData);
      } else {
        await customerAPI.create(formData);
      }
      onSuccess && onSuccess();
    } catch (error) {
      console.error("Error saving customer:", error);
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else {
        setErrors({ general: "An error occurred while saving the customer" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="customer-form-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="customer-form-container">
      <form onSubmit={handleSubmit} className="customer-form">
        <h2>{customerId ? "Edit Customer" : "Create New Customer"}</h2>

        {errors.general && (
          <div className="error-message general-error">{errors.general}</div>
        )}

        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={errors.first_name ? "error" : ""}
            placeholder="Enter first name"
          />
          {errors.first_name && (
            <span className="error-message">{errors.first_name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={errors.last_name ? "error" : ""}
            placeholder="Enter last name"
          />
          {errors.last_name && (
            <span className="error-message">{errors.last_name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone_number">Phone Number</label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className={errors.phone_number ? "error" : ""}
            placeholder="Enter 10-digit phone number"
          />
          {errors.phone_number && (
            <span className="error-message">{errors.phone_number}</span>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading
              ? "Saving..."
              : customerId
              ? "Update Customer"
              : "Create Customer"}
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

export default CustomerForm;
