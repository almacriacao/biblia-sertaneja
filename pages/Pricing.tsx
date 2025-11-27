
import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { APP_TEXT } from '../content';

interface PricingProps {
  onBack: () => void;
}

// --- STRIPE CONFIGURATION ---
// Replace these with your actual Stripe publishable key and price IDs
const STRIPE_PUBLISHABLE_KEY = "pk_test_..."; 
const PRICE_ID_MONTHLY = "price_monthly_id";
const PRICE_ID_ANNUAL = "price_annual_id";

export const Pricing: React.FC<PricingProps> = ({ onBack }) => {
  const t = APP_TEXT.pricing;
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleSubscribe = async () => {
    // ---------------------------------------------------------
    // STRIPE CHECKOUT LOGIC (MOCK)
    // ---------------------------------------------------------
    // In a real app, you would call your backend to create a Checkout Session,
    // then use stripe.redirectToCheckout({ sessionId }).
    
    console.log(`Initiating checkout for ${billingCycle} plan...`);
    console.log(`Using Stripe Key: ${STRIPE_PUBLISHABLE_KEY}`);
    console.log(`Price ID: ${billingCycle === 'monthly' ? PRICE_ID_MONTHLY : PRICE_ID_ANNUAL}`);

    alert("Simulação: Redirecionando para o Gateway de Pagamento Seguro (Stripe)...");
    
    // Example backend call:
    // const response = await fetch('/api/create-checkout-session', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ priceId: billingCycle === 'monthly' ? PRICE_ID_MONTHLY : PRICE_ID_ANNUAL })
    // });
    // const session = await response.json();
    // stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-gradient-to-b from-zinc-900 to-black text-white pb-32">
       {/* Header */}
       <div className="max-w-4xl mx-auto mb-8">
         <button onClick={onBack} className="text-zinc-400 hover:text-white flex items-center gap-2 mb-6">
            <Icon name="prev" className="w-5 h-5" />
            Voltar
         </button>
         
         <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black mb-4">{t.title}</h1>
            <p className="text-zinc-400 text-lg">{t.subtitle}</p>
         </div>
       </div>

       {/* Toggle */}
       <div className="flex justify-center mb-12">
          <div className="bg-zinc-800 p-1 rounded-full flex items-center relative">
             <button 
               onClick={() => setBillingCycle('monthly')}
               className={`px-6 py-2 rounded-full text-sm font-bold transition z-10 ${billingCycle === 'monthly' ? 'text-black' : 'text-zinc-400'}`}
             >
                {t.monthly}
             </button>
             <button 
               onClick={() => setBillingCycle('annual')}
               className={`px-6 py-2 rounded-full text-sm font-bold transition z-10 ${billingCycle === 'annual' ? 'text-black' : 'text-zinc-400'}`}
             >
                {t.annual}
             </button>
             
             {/* Slider Background */}
             <div className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-full transition-transform duration-300 ${billingCycle === 'annual' ? 'translate-x-full' : 'translate-x-0'}`} />
          </div>
          {billingCycle === 'annual' && (
             <span className="ml-3 self-center text-xs font-bold text-green-500 bg-green-900/20 px-2 py-1 rounded border border-green-900">
               {t.saveLabel}
             </span>
          )}
       </div>

       {/* Cards Container */}
       <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Free Tier */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 order-2 md:order-1">
             <h3 className="text-xl font-bold text-zinc-300 mb-2">Plano Gratuito</h3>
             <div className="text-3xl font-bold mb-6">R$ 0,00</div>
             
             <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-zinc-400">
                   <Icon name="check" className="w-5 h-5 text-zinc-600" />
                   {t.freeFeatures.limited}
                </li>
                <li className="flex items-center gap-3 text-zinc-400">
                   <Icon name="check" className="w-5 h-5 text-zinc-600" />
                   {t.freeFeatures.snippets}
                </li>
                <li className="flex items-center gap-3 text-zinc-400 line-through decoration-zinc-600">
                   <Icon name="close" className="w-5 h-5 text-zinc-600" />
                   {t.features.offline}
                </li>
                <li className="flex items-center gap-3 text-zinc-400 line-through decoration-zinc-600">
                   <Icon name="close" className="w-5 h-5 text-zinc-600" />
                   {t.features.playlists}
                </li>
             </ul>
             
             <button disabled className="w-full bg-zinc-800 text-zinc-500 font-bold py-4 rounded-xl cursor-not-allowed">
                Plano Atual
             </button>
          </div>

          {/* Premium Tier (Highlighted) */}
          <div className="bg-gradient-to-b from-green-900/40 to-black border-2 border-green-500 rounded-3xl p-8 relative overflow-hidden order-1 md:order-2 shadow-2xl shadow-green-900/20 transform md:scale-105">
             <div className="absolute top-0 right-0 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl">
                OFERTA DE LANÇAMENTO
             </div>

             <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Icon name="sparkles" className="w-6 h-6 text-green-400" />
                Premium
             </h3>
             
             <div className="mb-6">
                <div className="flex items-center gap-3">
                   <span className="text-zinc-500 line-through text-lg font-bold">{t.fullPrice}</span>
                   <span className="text-green-500 font-bold text-xs bg-green-900/30 px-2 py-0.5 rounded uppercase">Desconto Ativo</span>
                </div>
                {billingCycle === 'monthly' ? (
                    <div className="flex items-end gap-1">
                        <span className="text-5xl font-black text-white">{t.discountPrice}</span>
                        <span className="text-zinc-400 font-medium mb-1">/mês</span>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-end gap-1">
                            <span className="text-5xl font-black text-white">{t.annualPrice}</span>
                            <span className="text-zinc-400 font-medium mb-1">/ano</span>
                        </div>
                        <p className="text-green-400 text-sm font-bold mt-1">{t.annualInstallment}</p>
                    </div>
                )}
             </div>

             <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-white font-medium">
                   <div className="bg-green-500 rounded-full p-0.5"><Icon name="check" className="w-3 h-3 text-black" /></div>
                   {t.features.fullAccess}
                </li>
                <li className="flex items-center gap-3 text-white font-medium">
                   <div className="bg-green-500 rounded-full p-0.5"><Icon name="check" className="w-3 h-3 text-black" /></div>
                   {t.features.offline}
                </li>
                <li className="flex items-center gap-3 text-white font-medium">
                   <div className="bg-green-500 rounded-full p-0.5"><Icon name="check" className="w-3 h-3 text-black" /></div>
                   {t.features.playlists}
                </li>
                 <li className="flex items-center gap-3 text-white font-medium">
                   <div className="bg-green-500 rounded-full p-0.5"><Icon name="check" className="w-3 h-3 text-black" /></div>
                   {t.features.unlimited}
                </li>
                <li className="flex items-center gap-3 text-white font-medium">
                   <div className="bg-green-500 rounded-full p-0.5"><Icon name="check" className="w-3 h-3 text-black" /></div>
                   {t.features.sound}
                </li>
                <li className="flex items-center gap-3 text-white font-medium">
                   <div className="bg-green-500 rounded-full p-0.5"><Icon name="heart-filled" className="w-3 h-3 text-black" /></div>
                   {t.features.support}
                </li>
             </ul>

             <button 
               onClick={handleSubscribe}
               className="w-full bg-green-500 hover:bg-green-400 text-black font-black text-lg py-4 rounded-xl shadow-lg shadow-green-900/50 hover:shadow-green-500/30 transition transform hover:scale-[1.02] active:scale-95"
             >
                {t.cta}
             </button>
             <p className="text-center text-[10px] text-zinc-500 mt-4 flex items-center justify-center gap-1">
                <Icon name="lock" className="w-3 h-3" />
                {t.secure}
             </p>
          </div>

       </div>
    </div>
  );
};
