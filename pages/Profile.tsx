
import React from 'react';
import { User } from '../types';
import { Icon } from '../components/Icon';
import { APP_TEXT } from '../content';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const t = APP_TEXT.profile;

  // Calculate trial time remaining if applicable
  const getTrialTimeRemaining = () => {
    if (!user.isTrial || !user.trialEndsAt) return null;
    const now = new Date();
    const end = new Date(user.trialEndsAt);
    const diffMs = end.getTime() - now.getTime();
    if (diffMs <= 0) return "Expirado";
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    return `${hours} horas`;
  };

  const trialRemaining = getTrialTimeRemaining();

  return (
    <div className="p-8 pb-32 overflow-y-auto h-full bg-gradient-to-b from-zinc-900 to-black animate-in fade-in slide-in-from-bottom-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-6 mb-10">
           <img 
            src={user.avatarUrl} 
            alt={user.name} 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-zinc-800 shadow-xl"
           />
           <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{user.name}</h1>
              <div className="flex items-center gap-2">
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${user.isPremium ? 'bg-green-900/40 text-green-400 border-green-800' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                    {user.isTrial ? t.planTrial : (user.isPremium ? t.planPremium : t.planFree)}
                 </span>
                 {user.faith && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-900/40 text-blue-400 border border-blue-800">
                        {user.faith === 'catholic' ? 'Católica' : 'Evangélica'}
                    </span>
                 )}
              </div>
           </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           {/* Personal Info */}
           <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Icon name="user" className="w-5 h-5 text-zinc-400" />
                  {t.personalInfo}
              </h3>
              
              <div className="space-y-4">
                 <div>
                    <label className="text-xs text-zinc-500 uppercase font-bold block mb-1">E-mail</label>
                    <div className="flex items-center gap-3 text-zinc-300">
                        <Icon name="mail" className="w-4 h-4" />
                        {user.email}
                    </div>
                 </div>
                 
                 {user.birthdate && (
                    <div>
                        <label className="text-xs text-zinc-500 uppercase font-bold block mb-1">Nascimento</label>
                        <div className="flex items-center gap-3 text-zinc-300">
                            <Icon name="calendar" className="w-4 h-4" />
                            {new Date(user.birthdate).toLocaleDateString('pt-BR')}
                        </div>
                    </div>
                 )}

                 {user.gender && (
                    <div>
                        <label className="text-xs text-zinc-500 uppercase font-bold block mb-1">Gênero</label>
                        <div className="text-zinc-300 capitalize">
                           {user.gender === 'prefer_not_say' ? 'Prefiro não dizer' : 
                            user.gender === 'female' ? 'Feminino' : 
                            user.gender === 'male' ? 'Masculino' : 'Outro'}
                        </div>
                    </div>
                 )}
              </div>
           </div>

           {/* Subscription */}
           <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 flex flex-col">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Icon name="sparkles" className="w-5 h-5 text-green-500" />
                  {t.subscription}
              </h3>

              <div className="flex-1">
                  {user.isTrial ? (
                      <div className="mb-6">
                         <p className="text-zinc-400 text-sm mb-2">Seu teste grátis expira em:</p>
                         <p className="text-3xl font-mono text-green-400 font-bold">{trialRemaining}</p>
                      </div>
                  ) : user.isPremium ? (
                      <div className="mb-6">
                         <p className="text-zinc-400 text-sm mb-2">Próxima renovação:</p>
                         <p className="text-xl text-white font-medium">15/12/2024</p>
                      </div>
                  ) : (
                      <p className="text-zinc-400 mb-6">Você está no plano gratuito.</p>
                  )}
              </div>

              <div className="space-y-3 mt-auto">
                 {user.isPremium ? (
                    <button onClick={() => alert("Funcionalidade simulada: Assinatura cancelada.")} className="w-full border border-red-900/50 text-red-500 py-2 rounded font-medium hover:bg-red-900/10 transition text-sm">
                        {t.cancelBtn}
                    </button>
                 ) : (
                    <button onClick={() => alert("Funcionalidade simulada: Redirecionando para pagamento...")} className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-500 transition">
                        {t.subscribeBtn}
                    </button>
                 )}
                 
                 {user.isTrial && (
                    <button onClick={() => alert("Funcionalidade simulada: Plano contratado!")} className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-500 transition shadow-lg shadow-green-900/20">
                       {t.subscribeBtn}
                    </button>
                 )}
              </div>
           </div>
        </div>

        {/* Logout Zone */}
        <div className="border-t border-zinc-900 pt-8">
            <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition group"
            >
                <Icon name="logout" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">{t.logoutBtn}</span>
            </button>
        </div>

      </div>
    </div>
  );
};
