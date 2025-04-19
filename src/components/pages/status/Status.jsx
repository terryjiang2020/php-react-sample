import React, { useState, useEffect } from 'react';
import './status.scss';

/**
 * Status component that displays information from the status API
 */
const Status = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/status');
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      setStatus(data);
      setLastRefresh(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Refresh status every 10 seconds
    const intervalId = setInterval(fetchStatus, 10000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading && !status) {
    return <div className="status-container">Loading status information...</div>;
  }

  if (error) {
    return (
      <div className="status-container error">
        <h2>Error fetching status</h2>
        <p>{error}</p>
        <button onClick={fetchStatus}>Retry</button>
      </div>
    );
  }

  return (
    <div className="status-container">
      <div className="status-header">
        <h2>System Status</h2>
        <div className="status-actions">
          <p>Last updated: {lastRefresh.toLocaleTimeString()}</p>
          <button onClick={fetchStatus}>Refresh</button>
        </div>
      </div>
      
      <div className={`status-indicator ${status?.status === 'ok' ? 'online' : 'offline'}`}>
        System Status: {status?.status === 'ok' ? 'Online' : 'Offline'}
      </div>
      
      <div className="status-section">
        <h3>Server Information</h3>
        <table>
          <tbody>
            {status?.server && Object.entries(status.server).map(([key, value]) => (
              <tr key={key}>
                <td className="label">{key.replace(/_/g, ' ')}</td>
                <td className="value">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="status-section">
        <h3>API Information</h3>
        <table>
          <tbody>
            <tr>
              <td className="label">Status</td>
              <td className="value">{status?.api?.status}</td>
            </tr>
            <tr>
              <td className="label">Framework</td>
              <td className="value">{status?.api?.framework}</td>
            </tr>
          </tbody>
        </table>
        
        <h4>Available Endpoints</h4>
        <table>
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Supported Methods</th>
            </tr>
          </thead>
          <tbody>
            {status?.api?.endpoints && Object.entries(status.api.endpoints).map(([endpoint, methods]) => (
              <tr key={endpoint}>
                <td>{endpoint}</td>
                <td>{methods.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Status;