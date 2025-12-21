
import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Input, Select } from '../components/Common';
import { ShieldCheck, Zap, ArrowRight, Users, Check, LogIn, PlayCircle, BarChart3, Lock, Gift } from 'lucide-react';
import { Role, User } from '../types';
import { MOCK_USERS } from '../mockData';
import { useI18n } from '../contexts/I18nContext';
import { track } from '../utils/track';
import { Logo } from '../components/Brand/Logo';
import { Mark } from '../components/Brand/Mark';

interface AuthProps {
  onLogin: (user: User, isNewUser: boolean) => void;
  initialMode: 'login' | 'signup';
  initialRole?: Role;
  returnTo?: string;
}

export default function Auth({ onLogin, initialMode, initialRole, returnTo }: AuthProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // New Signup Fields
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [source, setSource] = useState('');
  
  const [role, setRole] = useState<Role>(initialRole || 'brand');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync role if prop changes
  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialRole]);

  // Track initial load if signup
  useEffect(() => {
    if (initialMode === 'signup') {
        track('signup_started', { source: 'direct_link', role: initialRole });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (mode === 'signup') {
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!source) {
            setError('Please tell us how you heard about us.');
            return;
        }
    }

    setIsLoading(true);
    
    setTimeout(() => {
      // --- LOGIC FOR EXISTING USERS (LOGIN) ---
      if (mode === 'login') {
        // DEMO "MAGIC" LOGIN: 
        let existingUser = MOCK_USERS.find(u => u.email === email);
        
        // Fallback for demo if precise email match fails
        if (!existingUser) {
            if (email.includes('tech') || email.includes('brand')) existingUser = MOCK_USERS[0]; // Alice
            else if (email.includes('dev') || email.includes('comm')) existingUser = MOCK_USERS[1]; // Bob
            else existingUser = MOCK_USERS[2]; // Charlie (Staff)
        }

        track('login_completed', { userId: existingUser.id, role: existingUser.role });
        // Pass 'false' for isNewUser to skip onboarding
        onLogin(existingUser, false);
      } 
      
      // --- LOGIC FOR NEW USERS (SIGN UP) ---
      else {
        const newUser: User = {
          id: `u-${Date.now()}`,
          // Name is temporarily the email handle, we will ask for Full Name in Onboarding
          name: email.split('@')[0], 
          email: email || 'user@example.com',
          role: role,
          createdAt: new Date().toISOString(),
          avatarUrl: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=CC0000&color=fff`
        };
        
        track('signup_completed', { 
            userId: newUser.id, 
            role: newUser.role, 
            referralCode, 
            attributionSource: source 
        });

        // Pass 'true' for isNewUser to trigger onboarding
        onLogin(newUser, true);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const toggleMode = () => {
    const newMode = mode === 'login' ? 'signup' : 'login';
    setMode(newMode);
    
    if (newMode === 'signup') {
        track('signup_started', { source: 'toggle_button', role });
    }

    // Clear sensitive fields
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] flex flex-col lg:flex-row font-sans selection:bg-[#FF0000]/30">
      {/* Left Column - Value Prop (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F0F0F] border-r border-[#1F1F1F] p-16 flex-col justify-between relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
           {/* YouTube Red Accents */}
           <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#FF0000]/5 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#222]/50 rounded-full blur-[120px]"></div>
           {/* Grid Pattern */}
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div className="relative z-10">
          <div className="mb-16">
            <Logo mode="dark" />
          </div>

          <h1 className="text-5xl font-black text-white mb-8 leading-[1.1] tracking-tight">
            {mode === 'signup' ? (
                <>
                    Acesse o Ecossistema <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#666]">de Creators Enterprise.</span>
                </>
            ) : (
                <>
                    O Sistema Operacional <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#666]">do YouTube Marketing.</span>
                </>
            )}
          </h1>
          
          <p className="text-lg text-[#888] mb-12 max-w-lg leading-relaxed">
            Conecte-se a canais verificados, automatize contratos e pague com segurança via Escrow. Sem agências, sem burocracia.
          </p>

          <div className="space-y-6">
            {[
              { icon: PlayCircle, title: 'Inventário Nativo', desc: 'Integrações, Shorts e Reviews Dedicados.' },
              { icon: ShieldCheck, title: 'Audiência Verificada', desc: 'Dados reais via YouTube Data API (OAuth).' },
              { icon: Lock, title: 'Pagamento Seguro', desc: 'O dinheiro só é liberado após a entrega.' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-5 p-4 rounded-2xl bg-[#141414] border border-[#222] hover:border-[#333] transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center text-[#FF0000] border border-[#333]">
                  <item.icon size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-0.5">{item.title}</h3>
                  <p className="text-[#666] text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 relative z-10 flex items-center gap-4 text-xs font-bold text-[#444] uppercase tracking-widest">
          <span>Trusted by</span>
          <div className="h-px bg-[#222] flex-1"></div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 bg-[#050505] flex items-center justify-center p-6 relative">
        {/* Mobile Header (Visible only on mobile) */}
        <div className="absolute top-6 left-6 lg:hidden">
            <Logo mode="dark" />
        </div>

        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-[#222] bg-[#0A0A0A] shadow-2xl">
            <CardContent className="p-8 md:p-10">
              <div className="mb-8 text-center">
                <div className="w-12 h-12 bg-[#141414] rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#222]">
                    <LogIn size={24} className="text-[#FF0000]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    {mode === 'login' ? 'Entrar no Studio' : 'Criar sua conta'}
                </h2>
                <p className="text-[#666] text-sm">
                    {mode === 'login' ? 'Gerencie suas campanhas e entregas.' : 'Comece a negociar em minutos.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* ROLE SELECTION */}
                {mode === 'signup' && (
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('brand')}
                            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                            role === 'brand' 
                                ? 'bg-[#141414] border-[#FF0000] text-white shadow-[0_0_15px_rgba(255,0,0,0.1)]' 
                                : 'bg-[#0F0F0F] border-[#222] text-[#666] hover:bg-[#141414] hover:border-[#333]'
                            }`}
                        >
                            <BarChart3 size={20} className={role === 'brand' ? 'text-[#FF0000]' : 'opacity-50'} />
                            <span className="font-bold text-xs">Sou Marca</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('community')}
                            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                            role === 'community' 
                                ? 'bg-[#141414] border-[#FF0000] text-white shadow-[0_0_15px_rgba(255,0,0,0.1)]' 
                                : 'bg-[#0F0F0F] border-[#222] text-[#666] hover:bg-[#141414] hover:border-[#333]'
                            }`}
                        >
                            <Users size={20} className={role === 'community' ? 'text-[#FF0000]' : 'opacity-50'} />
                            <span className="font-bold text-xs">Sou Creator</span>
                        </button>
                    </div>
                )}

                <div className="space-y-4">
                  <Input 
                    label="E-mail Profissional" 
                    type="email" 
                    placeholder="voce@empresa.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#0F0F0F] border-[#222] text-white placeholder:text-[#444] focus:border-[#FF0000]"
                  />

                  <Input 
                    label="Senha"
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[#0F0F0F] border-[#222] text-white placeholder:text-[#444] focus:border-[#FF0000]"
                  />

                  {mode === 'signup' && (
                    <>
                        <Input 
                            label="Confirmar Senha"
                            type="password" 
                            placeholder="••••••••" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="bg-[#0F0F0F] border-[#222] text-white placeholder:text-[#444] focus:border-[#FF0000]"
                        />
                        
                        <Input 
                            label="Código de Indicação (Opcional)"
                            placeholder="EX: CM-JOAO-2024"
                            value={referralCode}
                            onChange={(e) => setReferralCode(e.target.value)}
                            icon={<Gift size={16} />}
                            className="bg-[#0F0F0F] border-[#222] text-white placeholder:text-[#444] focus:border-[#FF0000]"
                        />

                        <Select
                            label="Onde nos conheceu?"
                            options={[
                                { label: 'Selecione...', value: '' },
                                { label: 'LinkedIn', value: 'linkedin' },
                                { label: 'YouTube', value: 'youtube' },
                                { label: 'Indicação (MGM)', value: 'referral' },
                                { label: 'Google', value: 'google' },
                            ]}
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            className="bg-[#0F0F0F] border-[#222] text-white focus:border-[#FF0000]"
                        />
                    </>
                  )}

                  {error && <p className="text-xs text-rose-500 font-bold bg-rose-950/20 p-2 rounded border border-rose-900/50">{error}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-bold bg-[#FF0000] hover:bg-[#D90000] text-white shadow-lg shadow-red-900/20 transition-all border-transparent"
                  isLoading={isLoading}
                  icon={mode === 'signup' ? <ArrowRight size={18} /> : <LogIn size={18} />}
                >
                  {mode === 'login' ? 'Acessar Painel' : 'Criar Conta Grátis'}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-[#222] text-center">
                <p className="text-sm text-[#666]">
                  {mode === 'login' ? 'Ainda não tem conta?' : 'Já possui cadastro?'}
                  <button 
                    onClick={toggleMode}
                    className="ml-2 font-bold text-white hover:text-[#FF0000] transition-colors underline decoration-transparent hover:decoration-[#FF0000] underline-offset-4"
                  >
                    {mode === 'login' ? 'Cadastre-se' : 'Fazer Login'}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
