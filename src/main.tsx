import { createRoot } from 'react-dom/client'
import './index.css'

const App = () => {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Halo Business Finance
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Commercial Loan Marketplace - Website is now loading!
      </p>
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Our Services:</h2>
        <ul className="space-y-2">
          <li>• SBA Loans</li>
          <li>• Commercial Loans</li>
          <li>• Equipment Financing</li>
          <li>• Bridge Loans</li>
          <li>• Working Capital</li>
        </ul>
      </div>
      <div className="mt-8">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Get Free Consultation
        </button>
      </div>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<App />);