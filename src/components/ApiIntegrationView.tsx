import React, { useState } from 'react';
import {
  Code2,
  FileCode,
  Upload,
  Send,
  CheckCircle2,
  Copy,
  Terminal,
  Database,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useCockpit } from '../context/CockpitContext';
import { API_ENDPOINTS_DOCS } from '../data/mockData';

export const ApiIntegrationView: React.FC = () => {
  const { refreshDataSimulated } = useCockpit();

  const [activeEndpointIndex, setActiveEndpointIndex] = useState<number>(0);
  const [jsonInputPayload, setJsonInputPayload] = useState<string>(
    API_ENDPOINTS_DOCS[0].requestBodyExample || ''
  );
  const [responseLog, setResponseLog] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  const endpoint = API_ENDPOINTS_DOCS[activeEndpointIndex];

  const handleTestApiCall = () => {
    try {
      if (endpoint.requestBodyExample) {
        JSON.parse(jsonInputPayload);
      }
      refreshDataSimulated();
      setResponseLog(
        JSON.stringify(
          {
            timestamp: new Date().toISOString(),
            status: 200,
            statusText: 'OK - Dados de Indicadores municipais processados com sucesso!',
            escolas_afetadas: 108,
            indicadores_recalculados: true,
          },
          null,
          2
        )
      );
    } catch (err: any) {
      setResponseLog(
        JSON.stringify(
          {
            error: 'JSON_SYNTAX_ERROR',
            message: 'O payload enviado possui erros de sintaxe JSON.',
            details: err.message,
          },
          null,
          2
        )
      );
    }
  };

  const handleCopyCode = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleFileUploadSimulated = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      refreshDataSimulated();
      setImportSuccessMsg(`Arquivo "${file.name}" importado com sucesso! 108 registros de escolas atualizados.`);
      setTimeout(() => setImportSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="bg-[#0b132a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-sky-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">
            CONTRATO DE INTEGRAÇÃO API & CARGA DE DADOS
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Especificação técnica de endpoints JSON e canal de importação de dados para a prefeitura-piloto
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Endpoints List */}
        <div className="lg:col-span-4 bg-[#0b132a] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
          <h3 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-2">
            Endpoints Disponíveis
          </h3>
          {API_ENDPOINTS_DOCS.map((ep, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveEndpointIndex(idx);
                setJsonInputPayload(ep.requestBodyExample || '');
                setResponseLog(null);
              }}
              className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                activeEndpointIndex === idx
                  ? 'bg-sky-950/80 border-sky-500/80 text-white'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-[9px] font-extrabold rounded font-mono ${
                      ep.method === 'POST' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-sky-950 text-sky-300 border border-sky-800'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="text-xs font-bold font-mono">{ep.path}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">{ep.title}</p>
              </div>
            </button>
          ))}

          {/* File Upload Box */}
          <div className="mt-6 p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <h4 className="text-xs font-bold uppercase text-amber-300 flex items-center gap-1.5">
              <Upload className="w-4 h-4" />
              Importar Planilha / CSV da Prefeitura
            </h4>
            <p className="text-[11px] text-slate-400">
              Faça upload de arquivos exportados do diário eletrônico ou Censo Escolar para atualizar o cockpit.
            </p>
            <label className="block w-full cursor-pointer bg-slate-950 hover:bg-slate-800 border border-dashed border-slate-700 hover:border-amber-400 rounded-xl p-3 text-center transition">
              <span className="text-xs text-amber-400 font-bold block">Escolher arquivo CSV/JSON</span>
              <span className="text-[9px] text-slate-500">Formatos aceitos: .csv, .json, .xlsx</span>
              <input type="file" accept=".csv,.json,.xlsx" onChange={handleFileUploadSimulated} className="hidden" />
            </label>
            {importSuccessMsg && (
              <div className="p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-emerald-300 text-[11px] font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{importSuccessMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right API Sandbox Workspace */}
        <div className="lg:col-span-8 bg-[#0b132a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 font-mono font-bold text-xs rounded border border-emerald-800">
                  {endpoint.method}
                </span>
                <span className="font-mono text-sm font-bold text-amber-300">{endpoint.path}</span>
              </div>
              <h3 className="text-xs text-slate-300 font-semibold mt-1">{endpoint.description}</h3>
            </div>
          </div>

          {/* Request Payload Editor */}
          {endpoint.requestBodyExample && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase text-slate-400">
                  Corpo da Requisição (Request Body JSON)
                </label>
                <button
                  onClick={() => handleCopyCode(jsonInputPayload, 1)}
                  className="text-[10px] text-sky-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedIndex === 1 ? 'Copiado!' : 'Copiar JSON'}</span>
                </button>
              </div>
              <textarea
                rows={7}
                value={jsonInputPayload}
                onChange={(e) => setJsonInputPayload(e.target.value)}
                className="w-full font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl p-3 text-emerald-400 focus:outline-none focus:border-sky-500"
              />
            </div>
          )}

          {/* Submit Test Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleTestApiCall}
              className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              <Send className="w-4 h-4" />
              <span>Simular Disparo de Requisição API</span>
            </button>
            <span className="text-[10px] text-slate-500 font-mono">Status Esperado: 200 OK</span>
          </div>

          {/* Response Console Output */}
          {responseLog && (
            <div className="space-y-1.5 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Terminal className="w-4 h-4" />
                <span>Resposta do Servidor (Response Stream)</span>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto">
                {responseLog}
              </pre>
            </div>
          )}

          {/* Reference Response Example */}
          <div className="space-y-1.5 pt-2">
            <label className="text-[10px] font-bold uppercase text-slate-400 block">
              Exemplo de Resposta de Sucesso (Model Contract)
            </label>
            <pre className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs font-mono text-slate-400 overflow-x-auto">
              {endpoint.responseExample}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
