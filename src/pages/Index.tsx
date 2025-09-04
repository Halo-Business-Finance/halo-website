import React from "react";

const Index = () => {
  return (
    <div style={{padding: '20px', minHeight: '100vh', backgroundColor: '#f8f9fa'}}>
      <h1 style={{color: '#333', marginBottom: '20px'}}>Halo Business Finance</h1>
      <p style={{color: '#666', fontSize: '18px'}}>SBA Loans, Commercial Financing & Bridge Loans</p>
      <div style={{marginTop: '30px'}}>
        <button style={{
          backgroundColor: '#007bff', 
          color: 'white', 
          padding: '12px 24px', 
          border: 'none', 
          borderRadius: '6px',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Index;
