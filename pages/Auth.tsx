
import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { User, ChristianFaith } from '../types';
import { APP_TEXT } from '../content';

interface AuthProps {
  onSuccess: (user: User) => void;
  onBack: () => void;
  initialMode?: 'login' | 'register';
}

export const Auth: React.FC<AuthProps> = ({ onSuccess, onBack, initialMode = 'login' }) => {
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const t = APP_TEXT.auth;

  // --- STATE FOR REGISTRATION FLOW ---
  // Steps: 1-Email, 2-Password, 3-Demographics, 4-Name, 5-Faith
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 5;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'prefer_not_say'>('female');
  const [faith, setFaith] = useState<ChristianFaith>('evangelical');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // --- HANDLERS ---

  const handleNextStep = () => {
    // Validation Logic per step
    if (step === 1 && !email.includes('@')) return alert("Digite um e-mail válido");
    if (step === 2 && password.length < 6) return alert("A senha deve ter no mínimo 6 caracteres");
    if (step === 3 && !birthdate) return alert("Informe sua data de nascimento");
    if (step === 4 && !name) return alert("Informe seu nome");
    
    // If not last step, advance
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      // Final step submit
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    // Simulate API Call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const isTrial = isRegister;
    const trialEnds = isRegister ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined;

    const mockUser: User = {
      id: `user-${Date.now()}`,
      name: name || 'Usuário Sertanejo',
      email: email,
      isPremium: isRegister ? true : false,
      isTrial: isTrial,
      trialEndsAt: trialEnds,
      avatarUrl: `https://ui-avatars.com/api/?name=${name || 'User'}&background=22c55e&color=fff`,
      birthdate: isRegister ? birthdate : undefined,
      gender: isRegister ? gender : undefined,
      faith: isRegister ? faith : 'evangelical'
    };

    setLoading(false);
    onSuccess(mockUser);
  };

  // --- RENDER LOGIN VIEW (Simple Form) ---
  if (!isRegister) {
    return (
      <div className="h-screen w-full bg-black flex flex-col relative overflow-hidden">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 z-20 text-zinc-400 hover:text-white flex items-center gap-2"
        >
          <Icon name="prev" className="w-5 h-5" />
        </button>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-bold text-white mb-2 text-center">{t.loginTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 mt-8">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">{t.inputEmail}</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-4 text-white focus:border-white focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">{t.inputPassword}</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-4 text-white focus:border-white focus:outline-none font-medium"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3.5 rounded-full mt-4 flex items-center justify-center"
              >
                {loading ? "Entrando..." : t.actionLogin}
              </button>
            </form>
            <div className="mt-8 text-center">
              <button onClick={() => setIsRegister(true)} className="text-white font-bold text-sm border border-zinc-700 rounded-full px-6 py-2">
                Não tem conta? Cadastre-se
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER REGISTRATION VIEW (Stepper) ---
  return (
    <div className="h-screen w-full bg-black flex flex-col relative">
      
      {/* Header with Progress */}
      <div className="flex items-center justify-between px-4 py-4 pt-6">
        <button onClick={handlePrevStep} className="p-2 bg-black text-white rounded-full">
          <Icon name="prev" className="w-6 h-6" />
        </button>
        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
           Criar conta
        </div>
        <div className="w-8"></div> {/* Spacer for center alignment */}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-zinc-900">
         <div 
            className="h-full bg-green-500 transition-all duration-300 ease-out"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
         ></div>
      </div>

      {/* Step Content */}
      <div className="flex-1 px-6 pt-8 flex flex-col">
        
        {/* STEP 1: EMAIL */}
        {step === 1 && (
          <div className="animate-in slide-in-from-right duration-300">
            <h1 className="text-3xl font-bold text-white mb-2">{t.steps.email.title}</h1>
            <input 
              type="email"
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-zinc-800 text-white p-4 rounded-md font-bold text-lg focus:outline-none focus:ring-2 focus:ring-white/20 mt-2"
            />
            <p className="text-xs text-zinc-500 mt-2">{t.steps.email.subtitle}</p>
          </div>
        )}

        {/* STEP 2: PASSWORD */}
        {step === 2 && (
           <div className="animate-in slide-in-from-right duration-300">
            <h1 className="text-3xl font-bold text-white mb-2">{t.steps.password.title}</h1>
            <div className="relative mt-2">
              <input 
                type={showPassword ? "text" : "password"}
                autoFocus
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-zinc-800 text-white p-4 rounded-md font-bold text-lg focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-bold uppercase"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">{t.steps.password.subtitle}</p>
          </div>
        )}

        {/* STEP 3: DEMOGRAPHICS */}
        {step === 3 && (
           <div className="animate-in slide-in-from-right duration-300">
             <h1 className="text-3xl font-bold text-white mb-2">{t.steps.demographics.title}</h1>
             
             {/* Simple Custom Date Input Styles */}
             <div className="mt-6">
                <label className="text-xs font-bold text-zinc-400 uppercase">{t.steps.demographics.labelDate}</label>
                <input 
                  type="date"
                  value={birthdate}
                  onChange={e => setBirthdate(e.target.value)}
                  className="w-full bg-zinc-800 text-white p-4 rounded-md font-bold text-lg focus:outline-none focus:ring-2 focus:ring-white/20 mt-2 appearance-none"
                />
             </div>

             <div className="mt-6">
                <label className="text-xs font-bold text-zinc-400 uppercase">{t.steps.demographics.labelGender}</label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {['female', 'male', 'other', 'prefer_not_say'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g as any)}
                      className={`px-4 py-3 rounded-full border text-sm font-bold transition ${gender === g ? 'bg-green-500 border-green-500 text-black' : 'bg-transparent border-zinc-600 text-white'}`}
                    >
                      {g === 'female' ? t.genderOptions.female : 
                       g === 'male' ? t.genderOptions.male : 
                       g === 'other' ? t.genderOptions.other :
                       t.genderOptions.prefer_not_say}
                    </button>
                  ))}
                </div>
             </div>
           </div>
        )}

        {/* STEP 4: NAME */}
        {step === 4 && (
           <div className="animate-in slide-in-from-right duration-300">
            <h1 className="text-3xl font-bold text-white mb-2">{t.steps.name.title}</h1>
            <input 
              type="text"
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-zinc-800 text-white p-4 rounded-md font-bold text-lg focus:outline-none focus:ring-2 focus:ring-white/20 mt-2"
            />
            <p className="text-xs text-zinc-500 mt-2">{t.steps.name.subtitle}</p>
          </div>
        )}

        {/* STEP 5: FAITH */}
        {step === 5 && (
           <div className="animate-in slide-in-from-right duration-300">
            <h1 className="text-3xl font-bold text-white mb-2">{t.steps.faith.title}</h1>
            <p className="text-zinc-400 mb-8">{t.steps.faith.subtitle}</p>

            <div className="space-y-4">
               <button
                  onClick={() => setFaith('evangelical')}
                  className={`w-full p-6 rounded-xl border-2 flex items-center justify-between transition ${faith === 'evangelical' ? 'bg-green-900/20 border-green-500' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'}`}
                >
                  <span className={`text-xl font-bold ${faith === 'evangelical' ? 'text-green-500' : 'text-white'}`}>{t.faithOptions.evangelical}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${faith === 'evangelical' ? 'border-green-500' : 'border-zinc-600'}`}>
                     {faith === 'evangelical' && <div className="w-3 h-3 bg-green-500 rounded-full" />}
                  </div>
                </button>

                <button
                  onClick={() => setFaith('catholic')}
                  className={`w-full p-6 rounded-xl border-2 flex items-center justify-between transition ${faith === 'catholic' ? 'bg-green-900/20 border-green-500' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'}`}
                >
                  <span className={`text-xl font-bold ${faith === 'catholic' ? 'text-green-500' : 'text-white'}`}>{t.faithOptions.catholic}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${faith === 'catholic' ? 'border-green-500' : 'border-zinc-600'}`}>
                     {faith === 'catholic' && <div className="w-3 h-3 bg-green-500 rounded-full" />}
                  </div>
                </button>
            </div>
          </div>
        )}
        
        {/* Next Button Footer */}
        <div className="mt-auto mb-8 flex justify-center">
           <button 
             onClick={handleNextStep}
             disabled={loading}
             className="bg-white text-black font-bold rounded-full px-12 py-4 hover:scale-105 transition active:scale-95 disabled:opacity-50"
           >
             {loading ? <span className="animate-spin">⏳</span> : (step === TOTAL_STEPS ? t.actionRegister : t.actionNext)}
           </button>
        </div>
      </div>
    </div>
  );
};