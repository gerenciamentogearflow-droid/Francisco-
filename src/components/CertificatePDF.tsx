import React, { forwardRef } from 'react';
import { ServiceData } from '../types';

interface CertificatePDFProps {
  data: ServiceData;
}

export const CertificatePDF = forwardRef<HTMLDivElement, CertificatePDFProps>(
  ({ data }, ref) => {
    const totalMO = data.items.reduce((acc, item) => acc + item.laborCost, 0);
    const totalParts = data.items.reduce((acc, item) => acc + item.partsCost, 0);
    const totalGeneral = totalMO + totalParts;

    return (
      <div
        ref={ref}
        className="w-[800px] bg-white text-neutral-900"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* PAGE 1 */}
        <div className="p-12 pb-0 flex flex-col" style={{ minHeight: '1120px' }}>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-red-600 mb-1 tracking-tight">
              FRANCISCO MECÂNICO
            </h1>
            <p className="text-red-600 font-semibold text-sm tracking-wider mb-6">
              AMAPÁ DO MARANHÃO
            </p>
            <h2 className="text-2xl font-bold text-neutral-900 mb-1 uppercase">
              {data.certificateTitle || 'REVISÃO E ENTREGA'}
            </h2>
            <p className="text-red-600 text-xs font-bold tracking-widest uppercase">
              Premium Services
            </p>
            <div className="w-12 h-[2px] bg-neutral-200 mx-auto mt-4 mb-6"></div>
            <p className="text-neutral-600 text-sm max-w-2xl mx-auto leading-relaxed px-4">
              Eu, Francisco, certifico que executei e conferi rigorosamente os serviços detalhados abaixo, seguindo os padrões de qualidade e segurança da nossa oficina.
            </p>
          </div>

          {/* Details Box */}
          <div className="border border-neutral-300 rounded-2xl p-6 mb-8 bg-white">
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Modelo</p>
                <p className="font-bold text-lg text-neutral-900">{data.model || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Placa/Chassi</p>
                <p className="font-bold text-lg text-neutral-900">{data.licensePlate || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Data do Serviço</p>
                <p className="font-bold text-lg text-neutral-900">{data.date || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Cliente</p>
                <p className="font-bold text-lg text-neutral-900">{data.clientName || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Services List */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-5 h-5 rounded-full border-2 border-red-500 flex items-center justify-center">
                <span className="text-red-500 font-bold text-xs">✓</span>
              </div>
              <h3 className="font-bold text-red-600 text-sm tracking-wide">
                SERVIÇOS REALIZADOS
              </h3>
            </div>
            <p className="text-[10px] font-bold text-red-600 ml-7 mb-4 uppercase tracking-wider">
              Mão de Obra e Peças
            </p>

            <div className="space-y-3">
              {data.items.length === 0 ? (
                <div className="bg-red-50 rounded-xl p-4 text-center text-neutral-500 text-sm border border-red-100">
                  Nenhum serviço adicionado.
                </div>
              ) : (
                data.items.map((item) => (
                  <div key={item.id} className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-teal-500 font-bold text-lg flex-shrink-0">✓</span>
                      <p className="text-neutral-700 font-medium text-sm pr-4 uppercase">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-xs font-bold text-neutral-600 whitespace-nowrap">
                      M.O. R$ {item.laborCost.toFixed(2)} <span className="text-neutral-300 mx-2">|</span> PEÇAS: R$ {item.partsCost.toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-neutral-50 rounded-xl p-6 mb-8 border border-neutral-200">
            <h4 className="font-bold text-xs text-neutral-900 mb-2 uppercase tracking-wide">Notas / Observações:</h4>
            <p className="text-xs text-neutral-500 uppercase tracking-wide leading-relaxed whitespace-pre-wrap">
              {data.notes || 'NENHUMA OBSERVAÇÃO ADICIONADA.'}
            </p>
          </div>

          {/* Totals */}
          <div className="bg-neutral-100 rounded-2xl p-6 flex justify-between items-center mt-auto border border-neutral-200 mb-12">
            <div>
              <p className="font-bold text-neutral-800 text-sm mb-1 uppercase tracking-wide">
                Total Mão de Obra: R$ {totalMO.toFixed(2)}
              </p>
              <p className="font-bold text-neutral-800 text-sm uppercase tracking-wide">
                Total Peças: R$ {totalParts.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="font-bold text-red-500 text-2xl uppercase tracking-wide">
                Valor Total: R$ {totalGeneral.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-neutral-200 mt-auto mb-12">
            <p className="text-xs font-bold text-neutral-500 mb-1 tracking-wider">
              AVENIDA MILTON LEMOS • AMAPÁ DO MARANHÃO
            </p>
            <p className="text-[10px] text-neutral-400 font-medium tracking-wider">
              CONTATO: (98) 9 8469-1493 | INSTAGRAM: @FRANCISCOARAGAO99
            </p>
          </div>
        </div>

        {/* PAGE 2 - IMAGES (Only if there are images) */}
        {data.images.length > 0 && (
          <div className="p-12 flex flex-col" style={{ minHeight: '1120px' }}>
            <h3 className="font-bold text-xl text-neutral-900 mb-8 border-b pb-4">
              Anexos (Fotos do Serviço)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {data.images.map((img, i) => (
                <div key={i} className="aspect-square bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200">
                  <img src={img} alt={`Anexo ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            
             {/* Footer on page 2 */}
             <div className="text-center pt-8 border-t border-neutral-200 mt-auto mb-12">
              <p className="text-xs font-bold text-neutral-500 mb-1 tracking-wider">
                AVENIDA MILTON LEMOS • AMAPÁ DO MARANHÃO
              </p>
              <p className="text-[10px] text-neutral-400 font-medium tracking-wider">
                CONTATO: (98) 9 8469-1493 | INSTAGRAM: @FRANCISCOARAGAO99
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);
