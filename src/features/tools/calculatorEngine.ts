export interface CalculationResult {
    grossRevenue: number;       // (Price * Qty)
    transportCost: number;      // (Distance * Rate)
    laborCost: number;          // (Qty * Loading Rate)
    totalExpenses: number;      // (Transport + Labor)
    netProfit: number;          // (Revenue - Expenses)
    profitMargin: number;       // Percentage (Net / Revenue * 100)
    isProfitable: boolean;      // True if Net > 0
}

/**
 * Calculates detailed financial breakdown for agricultural logistics.
 * 
 * @param price - Price per unit (Note: ensure unit consistency before calling, e.g. price per kg)
 * @param quantity - Quantity in kg
 * @param distance - Distance in km
 * @param vehicleRate - Transport rate in ₹/km
 * @returns CalculationResult object or null if inputs are invalid/zero
 */
export const calculateReturns = (
    price: number,
    quantity: number,
    distance: number,
    vehicleRate: number
): CalculationResult | null => {
    // Validation: If any critical input is 0 or missing, return null to avoid false zeros
    if (!price || !quantity || !distance || !vehicleRate) {
        return null;
    }

    // Logic Constants
    const LOADING_RATE_PER_KG = 2.50;

    // 1. Gross Revenue (Price * Qty)
    // NOTE: Input price is assumed to be per KG for this calculation.
    // If the UI allows Quintal, it must be converted to kg price OR total revenue calculated accordingly.
    // We will assume 'price' passed here is per KG for simplicity, or the caller handles the conversion.
    // Let's document that input 'price' is implicitly expected to be normalized to 'per kg' OR 
    // simply simplistic Price * Quantity if the user inputs are aligned.
    // Given the prompt "Revenue = Price * Qty", we follow that directly.
    const grossRevenue = price * quantity;

    // 2. Transport Cost (Distance * Rate)
    const transportCost = distance * vehicleRate;

    // 3. Labor Cost (Qty * Loading Rate)
    const laborCost = quantity * LOADING_RATE_PER_KG;

    // 4. Total Expenses
    const totalExpenses = transportCost + laborCost;

    // 5. Net Profit
    const netProfit = grossRevenue - totalExpenses;

    // 6. Profit Margin
    // Prevent division by zero
    const profitMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

    // 7. Profitability Flag
    const isProfitable = netProfit > 0;

    return {
        grossRevenue,
        transportCost,
        laborCost,
        totalExpenses,
        netProfit,
        profitMargin,
        isProfitable
    };
};
