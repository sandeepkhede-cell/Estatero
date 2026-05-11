import { useState, useMemo } from 'react';
import { formatINR } from '../../utils/formatINR';

interface Props {
  propertyPrice: number;
}

function calcEmi(principal: number, annualRate: number, tenureYears: number): number {
  if (principal <= 0 || annualRate <= 0 || tenureYears <= 0) return 0;
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

const EmiCalculator = ({ propertyPrice }: Props) => {
  const defaultLoan = Math.round(propertyPrice * 0.8);

  const [loanAmount,  setLoanAmount]  = useState(defaultLoan);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure,      setTenure]      = useState(20);

  const emi         = useMemo(() => calcEmi(loanAmount, interestRate, tenure), [loanAmount, interestRate, tenure]);
  const totalPay    = emi * tenure * 12;
  const totalInterest = totalPay - loanAmount;

  const principalPct = totalPay > 0 ? (loanAmount / totalPay) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-bold text-on-surface flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-[18px] text-primary">calculate</span>
        EMI Calculator
      </h3>

      <div className="space-y-4">
        {/* Loan Amount */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Loan Amount</label>
            <span className="text-xs font-bold text-primary">{formatINR(loanAmount)}</span>
          </div>
          <input
            type="range"
            min={100000}
            max={propertyPrice}
            step={100000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full accent-primary h-1.5 rounded-full cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-on-surface-variant mt-0.5">
            <span>₹1L</span>
            <span>{formatINR(propertyPrice)}</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Interest Rate</label>
            <span className="text-xs font-bold text-primary">{interestRate.toFixed(1)}% p.a.</span>
          </div>
          <input
            type="range"
            min={5}
            max={20}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-primary h-1.5 rounded-full cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-on-surface-variant mt-0.5">
            <span>5%</span>
            <span>20%</span>
          </div>
        </div>

        {/* Tenure */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Tenure</label>
            <span className="text-xs font-bold text-primary">{tenure} yrs</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full accent-primary h-1.5 rounded-full cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-on-surface-variant mt-0.5">
            <span>1 yr</span>
            <span>30 yrs</span>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-4 p-3.5 rounded-xl bg-primary/5 border border-primary/15">
        <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">Monthly EMI</p>
        <p className="text-2xl font-bold text-primary">{formatINR(Math.round(emi))}</p>
      </div>

      {/* Breakdown bar */}
      <div className="mt-3">
        <div className="flex rounded-full overflow-hidden h-2">
          <div className="bg-primary transition-all" style={{ width: `${principalPct}%` }} />
          <div className="bg-amber-400 flex-1" />
        </div>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary flex-shrink-0" />
            <span className="text-[10px] text-on-surface-variant">Principal <span className="font-semibold text-on-surface">{formatINR(loanAmount)}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 flex-shrink-0" />
            <span className="text-[10px] text-on-surface-variant">Interest <span className="font-semibold text-on-surface">{formatINR(Math.round(totalInterest))}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmiCalculator;
