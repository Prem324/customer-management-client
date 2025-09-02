import React, { useState, useEffect, useCallback } from "react";
import { addressAPI } from "../services/api";
import AddressForm from "./AddressForm";
import "./AddressList.css";

const AddressList = ({ customerId, customerName }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await addressAPI.getByCustomerId(customerId);
      setAddresses(response.data.data);
      setError("");
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (customerId) {
      fetchAddresses();
    }
  }, [customerId, fetchAddresses]);

  const handleDelete = async (addressId, addressCity) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the address in ${addressCity}?`
      )
    ) {
      return;
    }

    try {
      await addressAPI.delete(addressId);
      fetchAddresses();
    } catch (err) {
      console.error("Error deleting address:", err);
      setError("Failed to delete address");
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchAddresses();
  };

  const handleEditSuccess = () => {
    setEditingAddress(null);
    fetchAddresses();
  };

  if (loading) {
    return <div className="loading-container">Loading addresses...</div>;
  }

  return (
    <div className="address-list-container">
      <div className="address-header">
        <h3>Addresses for {customerName}</h3>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="btn-primary">
            Add Address
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddForm && (
        <AddressForm
          customerId={customerId}
          onSuccess={handleAddSuccess}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingAddress && (
        <AddressForm
          addressId={editingAddress}
          customerId={customerId}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditingAddress(null)}
        />
      )}

      {addresses.length === 0 && !showAddForm ? (
        <div className="no-addresses">
          <p>No addresses found for this customer</p>
          <button onClick={() => setShowAddForm(true)} className="btn-primary">
            Add First Address
          </button>
        </div>
      ) : (
        <div className="address-grid">
          {addresses.map((address) => (
            <div key={address.id} className="address-card">
              <div className="address-details">
                <h4>
                  {address.city}, {address.state}
                </h4>
                <p className="address-text">{address.address_details}</p>
                <p className="pin-code">PIN: {address.pin_code}</p>
              </div>
              <div className="address-actions">
                <button
                  onClick={() => setEditingAddress(address.id)}
                  className="btn-edit"
                  disabled={editingAddress === address.id}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address.id, address.city)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressList;
