import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { customerAPI } from "../services/api";
import "./CustomerList.css";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchCustomers = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 10,
          search: searchTerm || "", // Ensure searchTerm is a string
          city: cityFilter || "", // Ensure cityFilter is a string
        };
        console.log("Params:", params); // Log the params object

        const response = await customerAPI.getAll(params);
        console.log("API Response:", response); // Log the API response

        if (response.data && typeof response.data === "object") {
          setCustomers(response.data.data || []);
          setPagination(response.data.pagination || {});
          setError("");
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        console.error("Error fetching customers:", err); // Log the error
        setError("Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, cityFilter]
  ); // Dependencies for fetchCustomers

  useEffect(() => {
    fetchCustomers(currentPage);
  }, [fetchCustomers, currentPage]); // Dependencies for useEffect

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCityFilter = (e) => {
    setCityFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (customerId, customerName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${customerName}? This will also delete all their addresses.`
      )
    ) {
      return;
    }

    try {
      await customerAPI.delete(customerId);
      fetchCustomers(currentPage);
    } catch (err) {
      console.error("Error deleting customer:", err);
      setError("Failed to delete customer");
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  if (loading && customers.length === 0) {
    return <div className="loading-container">Loading customers...</div>;
  }

  return (
    <div className="customer-list-container">
      <div className="list-header">
        <h2>Customer Directory</h2>
        <Link to="/customers/new" className="btn-primary">
          Add New Customer
        </Link>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="filter-box">
          <input
            type="text"
            placeholder="Filter by city..."
            value={cityFilter}
            onChange={handleCityFilter}
            className="filter-input"
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {customers.length === 0 && !loading ? (
        <div className="no-data">
          <p>No customers found</p>
          <Link to="/customers/new" className="btn-primary">
            Create your first customer
          </Link>
        </div>
      ) : (
        <>
          <div className="customer-table-container">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Addresses</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="customer-name">
                        {customer.first_name} {customer.last_name}
                      </div>
                    </td>
                    <td>{customer.phone_number}</td>
                    <td>
                      <span className="address-count">
                        {customer.address_count} address
                        {customer.address_count !== 1 ? "es" : ""}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/customers/${customer.id}`}
                          className="btn-view"
                          title="View Details"
                        >
                          View
                        </Link>
                        <Link
                          to={`/customers/${customer.id}/edit`}
                          className="btn-edit"
                          title="Edit Customer"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(
                              customer.id,
                              `${customer.first_name} ${customer.last_name}`
                            )
                          }
                          className="btn-delete"
                          title="Delete Customer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>

              <div className="pagination-info">
                Page {pagination.page} of {pagination.totalPages}(
                {pagination.total} total customers)
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= pagination.totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerList;
