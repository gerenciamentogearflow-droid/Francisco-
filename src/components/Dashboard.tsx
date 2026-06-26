import React, { useState, useRef } from 'react';
import { ServiceData, ServiceItem } from '../types';
import { CertificatePDF } from './CertificatePDF';
import { generatePDF } from '../utils/pdf';
import { Plus, Trash2, Camera, Download, Share2, LogOut, FileText, Settings, X, Save } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [data, setData] = useState<ServiceData>({
    clientName: '',
    licensePlate: '',
    model: '',
    date: new Date().toLocaleDateString('pt-BR') + ' ÀS ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    notes: '',
    items: [],
    images: [],
    certificateTitle: 'REVISÃO E ENTREGA'
  });

  const [newItem, setNewItem] = useState({ description: '', laborCost: '', partsCost: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  
  const handleSavePassword = () => {
    if (newPassword.trim().length < 4) {
      setPasswordMessage('A senha deve ter pelo menos 4 caracteres.');
      return;
    }
    localStorage.setItem('francisco_app_custom_pass', newPassword.trim());
    setPasswordMessage('Senha alterada com sucesso!');
    setNewPassword('');
    setTimeout(() => {
      setPasswordMessage('');
      setIsSettingsOpen(false);
    }, 2000);
  };
  
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleAddItem = () => {
    if (!newItem.description) return;
    const item: ServiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: newItem.description,
      laborCost: parseFloat(newItem.laborCost) || 0,
      partsCost: parseFloat(newItem.partsCost) || 0,
    };
    setData({ ...data, items: [...data.items, item] });
    setNewItem({ description: '', laborCost: '', partsCost: '' });
  };

  const handleRemoveItem = (id: string) => {
    setData({ ...data, items: data.items.filter(item => item.id !== id) });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    (Array.from(files) as File[]).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setData(prev => ({
            ...prev,
            images: [...prev.images, event.target!.result as string]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const processPdfAction = async (action: 'download' | 'share') => {
    if (!pdfRef.current) return;
    setIsGenerating(true);
    try {
      const blob = await generatePDF(pdfRef.current, 'certificado.pdf');
      const filename = `Certificado_${data.clientName.replace(/\s+/g, '_') || 'Servico'}.pdf`;
      const file = new File([blob], filename, { type: 'application/pdf' });

      if (action === 'share' && navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Certificado de Serviço',
          text: 'Segue o certificado de serviço da oficina.',
        });
      } else {
        // Fallback to download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar o PDF. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const totalMO = data.items.reduce((acc, item) => acc + item.laborCost, 0);
  const totalParts = data.items.reduce((acc, item) => acc + item.partsCost, 0);

  return (
    <div className="min-h-screen bg-neutral-950 pb-20 selection:bg-red-500/30 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Header */}
      <header className="bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-800 text-white p-4 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-red-500 to-red-700 p-2 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.2)]">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-extrabold text-xl tracking-tight">Novo Certificado</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-neutral-800 rounded-xl transition-colors text-neutral-400 hover:text-white">
              <Settings className="w-5 h-5" />
            </button>
            <button onClick={onLogout} className="p-2 hover:bg-red-950/50 hover:text-red-500 rounded-xl transition-colors text-neutral-400">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6 mt-4 relative z-10">
        
        {/* Info Section */}
        <section className="bg-neutral-900/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:p-8 border border-neutral-800">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
            <span className="w-2 h-6 bg-red-500 rounded-full"></span>
            <span>Dados Gerais</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 ml-1">Título do Certificado</label>
              <input type="text" value={data.certificateTitle} onChange={e => setData({...data, certificateTitle: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-950/50 border border-neutral-800 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all font-bold text-lg" placeholder="Ex: REVISÃO E ENTREGA" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 ml-1">Cliente</label>
              <input type="text" value={data.clientName} onChange={e => setData({...data, clientName: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-950/50 border border-neutral-800 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all" placeholder="Nome do cliente" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 ml-1">Modelo da Moto</label>
              <input type="text" value={data.model} onChange={e => setData({...data, model: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-950/50 border border-neutral-800 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all" placeholder="Ex: Hornet 600" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 ml-1">Placa / Chassi</label>
              <input type="text" value={data.licensePlate} onChange={e => setData({...data, licensePlate: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-950/50 border border-neutral-800 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all" placeholder="Ex: JAH7698" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 ml-1">Data e Hora (Automático)</label>
              <input type="text" value={data.date} onChange={e => setData({...data, date: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-950/50 border border-neutral-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all" />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-neutral-900/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:p-8 border border-neutral-800">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
            <span className="w-2 h-6 bg-red-500 rounded-full"></span>
            <span>Serviços e Peças</span>
          </h2>
          
          <div className="bg-neutral-950/50 p-5 rounded-2xl border border-neutral-800 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
              <div className="md:col-span-6">
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 ml-1">Descrição</label>
                <input type="text" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all text-sm" placeholder="Ex: Limpeza de injeção" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 ml-1">Valor M.O. (R$)</label>
                <input type="number" step="0.01" value={newItem.laborCost} onChange={e => setNewItem({...newItem, laborCost: e.target.value})} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all text-sm" placeholder="0.00" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 ml-1">Valor Peças (R$)</label>
                <input type="number" step="0.01" value={newItem.partsCost} onChange={e => setNewItem({...newItem, partsCost: e.target.value})} className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all text-sm" placeholder="0.00" />
              </div>
            </div>
            <button onClick={handleAddItem} disabled={!newItem.description} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(220,38,38,0.3)]">
              <Plus className="w-5 h-5" />
              <span>Adicionar Serviço</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.items.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-neutral-800 bg-neutral-950/50 group hover:border-neutral-700 transition-colors">
                <div className="flex-1 pr-4">
                  <p className="font-bold text-white text-sm uppercase tracking-wide">{item.description}</p>
                  <p className="text-xs font-medium text-neutral-500 mt-1">
                    M.O: R$ {item.laborCost.toFixed(2)} <span className="mx-2 text-neutral-700">|</span> Peças: R$ {item.partsCost.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-4 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t border-neutral-800 sm:border-0 justify-between sm:justify-end w-full sm:w-auto">
                  <p className="font-bold text-red-500 text-lg">
                    R$ {(item.laborCost + item.partsCost).toFixed(2)}
                  </p>
                  <button onClick={() => handleRemoveItem(item.id)} className="p-2.5 text-neutral-500 hover:text-red-400 hover:bg-red-950/50 rounded-xl transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {data.items.length === 0 && (
              <div className="text-center py-8 text-neutral-500 text-sm font-medium border-2 border-dashed border-neutral-800 rounded-2xl">
                Nenhum serviço adicionado.
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-sm font-medium text-neutral-400">
              M.O: R$ {totalMO.toFixed(2)} <span className="mx-2 text-neutral-700">&bull;</span> Peças: R$ {totalParts.toFixed(2)}
            </div>
            <div className="text-2xl font-black text-white">
              Total: <span className="text-red-500">R$ {(totalMO + totalParts).toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* Notes */}
        <section className="bg-neutral-900/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:p-8 border border-neutral-800">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
            <span className="w-2 h-6 bg-red-500 rounded-full"></span>
            <span>Observações</span>
          </h2>
          <textarea 
            value={data.notes}
            onChange={e => setData({...data, notes: e.target.value})}
            className="w-full p-4 rounded-2xl bg-neutral-950/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all min-h-[120px] text-sm resize-none"
            placeholder="Ex: Quilometragem registrada: 23.000 KM..."
          ></textarea>
        </section>

        {/* Photos */}
        <section className="bg-neutral-900/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:p-8 border border-neutral-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="w-2 h-6 bg-red-500 rounded-full"></span>
              <span>Fotos do Serviço</span>
            </h2>
            <label className="cursor-pointer bg-neutral-800 text-white hover:bg-neutral-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center space-x-2 border border-neutral-700">
              <Camera className="w-4 h-4" />
              <span>Anexar</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {data.images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-800 group bg-neutral-950">
                <img src={img} alt="Foto serviço" className="w-full h-full object-cover" />
                <button onClick={() => removeImage(i)} className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur-sm text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {data.images.length === 0 && (
              <div className="col-span-full py-10 text-center text-neutral-500 text-sm font-medium border-2 border-dashed border-neutral-800 rounded-2xl">
                Nenhuma foto anexada.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-neutral-950/80 backdrop-blur-xl border-t border-neutral-800 z-40">
        <div className="max-w-4xl mx-auto flex space-x-3">
          <button 
            onClick={() => processPdfAction('download')} 
            disabled={isGenerating}
            className="flex-1 bg-white hover:bg-neutral-200 text-neutral-950 font-bold py-4 px-4 rounded-2xl transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            <span>{isGenerating ? 'Gerando...' : 'Baixar PDF'}</span>
          </button>
          <button 
            onClick={() => processPdfAction('share')} 
            disabled={isGenerating}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-2xl transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 shadow-[0_0_20px_rgba(220,38,38,0.2)]"
          >
            <Share2 className="w-5 h-5" />
            <span>Compartilhar</span>
          </button>
        </div>
      </div>

      {/* Hidden PDF template container */}
      <div className="absolute top-0 left-[-9999px] overflow-hidden" style={{ width: '800px' }}>
        <CertificatePDF ref={pdfRef} data={data} />
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-neutral-800">
              <h2 className="font-bold text-lg text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-red-500" />
                Configurações
              </h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-neutral-300 mb-1">
                  Alterar Senha de Acesso
                </label>
                <p className="text-xs text-neutral-500 mb-4">
                  A nova senha será exigida no próximo login.
                </p>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-neutral-950/50 border border-neutral-800 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                  placeholder="Digite a nova senha"
                />
              </div>

              {passwordMessage && (
                <div className={`p-4 rounded-xl text-sm font-medium flex items-center justify-center ${passwordMessage.includes('sucesso') ? 'bg-green-950/30 text-green-400 border border-green-900/50' : 'bg-red-950/30 text-red-400 border border-red-900/50'}`}>
                  {passwordMessage}
                </div>
              )}

              <button
                onClick={handleSavePassword}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                <Save className="w-5 h-5" />
                <span>Salvar Senha</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
