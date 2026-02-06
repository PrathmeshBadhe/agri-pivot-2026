import { useState } from 'react'
import './App.css'
import PriceChart from './components/PriceChart'

function App() {
  const [commodity, setCommodity] = useState('Onion')

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-green-700 mb-2">Agri-Pivot AI</h1>
          <p className="text-gray-600 text-lg">Industry-Grade Price Forecasting</p>
        </header>

        <main>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Live Market Prediction</h2>
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="p-2 border rounded-md bg-gray-50 font-medium"
            >
              <option value="Onion">Onion</option>
              <option value="Potato">Potato</option>
              <option value="Tomato">Tomato</option>
            </select>
          </div>

          <PriceChart commodity={commodity} />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-800">Seasonality</h3>
              <p className="text-sm text-blue-600">Model detects yearly cycles automatically.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-bold text-green-800">Holiday Impact</h3>
              <p className="text-sm text-green-600">Indian holidays adjusted for market closures.</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-bold text-purple-800">Confidence Logic</h3>
              <p className="text-sm text-purple-600">95% Confidence Intervals provided.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
