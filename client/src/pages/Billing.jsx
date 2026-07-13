import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Check, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for exploring core functionalities.',
    features: [
      '20 AI diagnostic runs / month',
      'Up to 3 active projects',
      'Basic Kanban sprints Board',
      'Local JSON file sync logs'
    ],
    limit: 20
  },
  {
    name: 'Pro',
    price: '$49',
    period: 'month',
    desc: 'Designed for production builders and agencies.',
    features: [
      '100 AI diagnostic runs / month',
      'Unlimited projects',
      'Advanced priority Kanban board',
      'Full Team & Role delegations',
      'Automated email generator tools'
    ],
    limit: 100,
    recommended: true
  },
  {
    name: 'Enterprise',
    price: '$499',
    period: 'month',
    desc: 'Custom metrics, unlimited scale, dedicated LLM keys.',
    features: [
      'Unlimited AI operations / month',
      'Custom LLM connection endpoints',
      'Dedicated staging environments',
      'SLA response times < 1 hour',
      'Dedicated account engineer'
    ],
    limit: 9999
  }
];

const Billing = () => {
  const { user, upgradePlan } = useContext(AuthContext);
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleUpgrade = async (planName) => {
    if (user?.plan === planName) return;
    setLoadingPlan(planName);
    try {
      await upgradePlan(planName);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      <div>
        <h2 className="text-xl font-bold">Billing & Subscriptions</h2>
        <p className="text-xs text-[#a1a1aa] mt-1">Upgrade your tier constraints to unlock higher AI run allocations.</p>
      </div>

      {/* Subscription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = user?.plan === plan.name;
          return (
            <div 
              key={plan.name}
              className={`
                p-6 rounded-3xl border flex flex-col justify-between relative
                ${plan.recommended 
                  ? 'border-indigo-600 bg-indigo-600/5 shadow-xl shadow-indigo-600/5' 
                  : 'border-[#27272a]/20 glass'
                }
              `}
            >
              {plan.recommended && (
                <span className="absolute top-4 right-4 text-[9px] bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Recommended
                </span>
              )}

              <div>
                <h3 className="text-base font-bold">{plan.name} Plan</h3>
                <p className="text-[11px] text-[#a1a1aa] mt-1 min-h-[32px]">{plan.desc}</p>
                
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-xs text-[#a1a1aa]">/{plan.period}</span>
                </div>

                <ul className="mt-6 space-y-3.5 border-t border-[#27272a]/10 pt-6">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button
                  disabled={isCurrent || loadingPlan !== null}
                  onClick={() => handleUpgrade(plan.name)}
                  className={`
                    w-full py-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition
                    ${isCurrent 
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default' 
                      : plan.recommended
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg'
                        : 'bg-[#27272a] hover:bg-[#27272a]/80 text-white'
                    }
                  `}
                >
                  {loadingPlan === plan.name ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : isCurrent ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Active Subscription</span>
                    </>
                  ) : (
                    <span>Subscribe to {plan.name}</span>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Billing;
