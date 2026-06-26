import React, { useState, useEffect } from 'react';
import { Wrench, AlertCircle, User, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('francisco_app_user');
    const savedPass = localStorage.getItem('francisco_app_pass');
    if (savedUser && savedPass) {
      setUsername(savedUser);
      setPassword(savedPass);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate a brief loading state for a premium feel
    setTimeout(() => {
      const currentPassword = localStorage.getItem('francisco_app_custom_pass') || 'Franciscoaragão637';
      if (username === 'Francisco' && password === currentPassword) {
        setError('');
        if (rememberMe) {
          localStorage.setItem('francisco_app_user', username);
          localStorage.setItem('francisco_app_pass', password);
        } else {
          localStorage.removeItem('francisco_app_user');
          localStorage.removeItem('francisco_app_pass');
        }
        onLogin();
      } else {
        setError('Credenciais incorretas. Tente novamente.');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 selection:bg-red-500/30 relative overflow-hidden">
      
      {/* Decorative background blur */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        
        {/* Logo and Header */}
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <div className="bg-gradient-to-br from-red-500 to-red-700 p-4 rounded-2xl mb-6 shadow-[0_0_40px_rgba(220,38,38,0.3)] ring-1 ring-red-500/50">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Francisco App</h1>
          <p className="text-neutral-400 text-sm font-medium tracking-wide uppercase">Sistema de Emissão de Certificados</p>
        </div>

        {/* Login Card */}
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl relative">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1">
                Usuário
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-red-500 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-neutral-950/50 border border-neutral-800 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                  placeholder="Digite seu usuário"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1">
                Senha
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-red-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-neutral-950/50 border border-neutral-800 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-neutral-700 rounded-md peer-checked:bg-red-600 peer-checked:border-red-600 transition-colors group-hover:border-neutral-500"></div>
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-sm font-medium text-neutral-400 group-hover:text-neutral-300 transition-colors">
                  Lembrar meus dados
                </span>
              </label>
            </div>

            {error && (
              <div className="flex items-center space-x-3 text-red-400 bg-red-950/30 border border-red-900/50 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full bg-white hover:bg-neutral-200 text-neutral-950 font-bold py-4 px-4 rounded-2xl transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
              <span>{isLoading ? 'Autenticando...' : 'Acessar Sistema'}</span>
              {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

        </div>
        
        {/* Footer */}
        <p className="text-center text-neutral-600 text-xs mt-8 font-medium">
          &copy; {new Date().getFullYear()} Francisco Mecânico. Todos os direitos reservados.
        </p>

      </div>
    </div>
  );
}

