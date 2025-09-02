import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { customerAPI } from '../services/api';
import AddressList from '../components/AddressList';
import './CustomerDetailPage.css';

const CustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await customerAPI.getById(id);
        setCustomer(response.data.data);
        setError('');
      } catch (err) {
        console.error('Error fetching customer:', err);
        setError('Customer not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${customer.first_name} ${customer.last_name}? This will also delete all their addresses.`)) {
      return;
    }

    try {
      await customerAPI.delete(id);
      navigate('/customers');
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError('Failed to delete customer');
    }
  };

  if (loading) {
    return <div className="loading-container">Loading customer details...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/customers" className="btn-primary">
          Back to Customers
        </Link>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="error-container">
        <h2>Customer Not Found</h2>
        <p>The customer you're looking for doesn't exist.</p>
        <Link to="/customers" className="btn-primary">
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className="customer-detail-container">
      <div className="customer-header">
        <div className="customer-info">
          <h1>{customer.first_name} {customer.last_name}</h1>
          <p className="phone-number">{customer.phone_number}</p>
          <p className="created-date">
            Customer since: {new Date(customer.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="customer-actions">
          <Link to={`/customers/${customer.id}/edit`} className="btn-edit">
            Edit Customer
          </Link>
          <button onClick={handleDelete} className="btn-delete">
            Delete Customer
          </button>
        </div>
      </div>

      <div className="breadcrumb">
        <Link to="/customers">Customers</Link>
        <span> / </span>
        <span>{customer.first_name} {customer.last_name}</span>
      </div>

      <AddressList 
        customerId={customer.id} 
        customerName={`${customer.first_name} ${customer.last_name}`}
      />
    </div>
  );
};

export default CustomerDetailPage;