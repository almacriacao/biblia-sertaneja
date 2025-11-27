
import React, { useState } from 'react';
import { User } from '../types';
import { Icon } from '../components/Icon';
import { APP_TEXT } from '../content';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onNavigateToPricing: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onLogout, onNavigateToPricing, onUpdateUser }) => {
  const t = APP_TEXT.profile;

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<User>>({
     name: user.name,
     birthdate: user.birthdate,
     gender: user.gender,
     faith: user.faith
  });

  const handleSave = () => {
    // Merge new data with existing user object
    const updatedUser = { ...user, ...formData };
    onUpdateUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Revert changes
    setFormData({
        name: user.name,
        birthdate: user.birthdate,
        gender: user.gender,
        faith: user.faith
    });
    setIsEditing(false);
  };

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
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 text-center md:text-left">
           <div className="relative group">
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-zinc-800 shadow-xl"
              />
              {isEditing && (
                 <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer">
                    <Icon name="edit" className="w-8 h-8 text-white" />
                 </div>
              )}
           </div>
           
           <div className="flex-1">
              {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="text-3xl md:text-4xl font-bold text-white bg-zinc-800 border border-zinc-700 rounded p-2 mb-2 w-full text-center md:text-left"
                  />
              ) : (
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{user.name}</h1>
              )}
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${user.isPremium ? 'bg-green-900/40 text-green-400 border-green-800' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                    {user.isTrial ? t.planTrial : (user.isPremium ? t.planPremium : t.planFree)}
                 </span>
                 
                 {/* Faith Badge */}
                 {!isEditing && user.faith && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-900/40 text-blue-400 border border-blue-800">
                        {user.faith === 'catholic' ? 'Católica' : 'Evangélica'}
                    </span>
                 )}
              </div>
           </div>

           {/* Edit Actions */}
           <div className="flex gap-2">
             {isEditing ? (
                <>
                    <button onClick={handleCancel} className="px-4 py-2 rounded-full bg-zinc-800 text-white font-bold text-sm hover:bg-zinc-700 transition">
                        {t.cancelEdit}
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-full bg-green-600 text-white font-bold text-sm hover:bg-green-500 transition shadow-lg shadow-green-900/20">
                        {t.saveProfile}
                    </button>
                </>
             ) : (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-full border border-zinc-700 text-zinc-400 hover:text-white hover:border-white font-bold text-sm transition flex items-center gap-2">
                    <Icon name="edit" className="w-4 h-4" />
                    {t.editProfile}
                </button>
             )}
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
                        <span className="opacity-70 cursor-not-allowed" title="E-mail não pode ser alterado">{user.email}</span>
                    </div>
                 </div>
                 
                 <div>
                    <label className="text-xs text-zinc-500 uppercase font-bold block mb-1">Nascimento</label>
                    <div className="flex items-center gap-3 text-zinc-300">
                        <Icon name="calendar" className="w-4 h-4" />
                        {isEditing ? (
                            <input 
                                type="date" 
                                value={formData.birthdate} 
                                onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
                                className="bg-zinc-800 text-white p-1 rounded border border-zinc-700 text-sm"
                            />
                        ) : (
                            <span>{user.birthdate ? new Date(user.birthdate).toLocaleDateString('pt-BR') : 'Não informado'}</span>
                        )}
                    </div>
                 </div>

                 <div>
                    <label className="text-xs text-zinc-500 uppercase font-bold block mb-1">Gênero</label>
                    <div className="text-zinc-300 capitalize">
                        {isEditing ? (
                            <select 
                                value={formData.gender}
                                onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                                className="bg-zinc-800 text-white p-1 rounded border border-zinc-700 text-sm w-full"
                            >
                                <option value="female">Feminino</option>
                                <option value="male">Masculino</option>
                                <option value="other">Outro</option>
                                <option value="prefer_not_say">Prefiro não dizer</option>
                            </select>
                        ) : (
                            <span>
                                {user.gender === 'prefer_not_say' ? 'Prefiro não dizer' : 
                                user.gender === 'female' ? 'Feminino' : 
                                user.gender === 'male' ? 'Masculino' : 'Outro'}
                            </span>
                        )}
                    </div>
                 </div>

                 {/* Faith Editor (Only visible in edit mode here for UX) */}
                 {isEditing && (
                    <div>
                        <label className="text-xs text-zinc-500 uppercase font-bold block mb-1">Fé Cristã</label>
                        <select 
                            value={formData.faith}
                            onChange={(e) => setFormData({...formData, faith: e.target.value as any})}
                            className="bg-zinc-800 text-white p-1 rounded border border-zinc-700 text-sm w-full"
                        >
                            <option value="evangelical">Evangélica</option>
                            <option value="catholic">Católica</option>
                        </select>
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
                    <button 
                        onClick={onNavigateToPricing} 
                        className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-500 transition flex items-center justify-center gap-2 animate-pulse"
                    >
                        <Icon name="sparkles" className="w-4 h-4" />
                        {t.subscribeBtn}
                    </button>
                 )}
                 
                 {user.isTrial && (
                    <button 
                        onClick={onNavigateToPricing} 
                        className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-500 transition shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                    >
                       <Icon name="sparkles" className="w-4 h-4" />
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
