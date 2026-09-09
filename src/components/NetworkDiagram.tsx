import React from 'react';
import { 
  Cpu, 
  Server, 
  Wifi, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw,
  CheckCircle2,
  Database,
  Lock,
  Radio,
  FileCode2,
  Globe
} from 'lucide-react';
import { ClientType, StepId, SimulationStep } from '../types';
import { SIMULATION_STEPS } from '../data/constants';

interface NetworkDiagramProps {
  clientType: ClientType;
  currentStepId: StepId;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onNextStep: () => void;
  onReset: () => void;
  onSelectStep: (stepId: StepId) => void;
  statusCode?: number;
  isDarkMode: boolean;
}

export const NetworkDiagram: React.FC<NetworkDiagramProps> = ({
  clientType,
  currentStepId,
  isPlaying,
  onPlayToggle,
  onNextStep,
  onReset,
  onSelectStep,
  statusCode,
  isDarkMode
}) => {
  const currentStepIndex = SIMULATION_STEPS.findIndex((s) => s.id === currentStepId);
  const currentStep = SIMULATION_STEPS[currentStepIndex] || SIMULATION_STEPS[0];

  const isSuccess = statusCode === 200;
  const isError = statusCode !== undefined && statusCode !== 200;

  return (
    <div
      className={`rounded-2xl p-4 lg:p-6 shadow-xl relative overflow-hidden transition-colors duration-200 border ${
        isDarkMode
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* Background Grid Pattern */}
      <div
        className={`absolute inset-0 bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none ${
          isDarkMode
            ? 'bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]'
            : 'bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)]'
        }`}
      />

      {/* Header & Controls Bar */}
      <div
        className={`relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 border-b ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-cyan-500 animate-pulse" />
            <h2 className={`text-base font-bold tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Sơ Đồ Luồng Truyền Gói Tin Mạng & Xác Thực
            </h2>
          </div>
          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Mô phỏng chu trình TCP Socket, đóng gói chuỗi HTTP và phản hồi máy chủ
          </p>
        </div>

        {/* Stepper Playback Controls */}
        <div
          className={`flex items-center space-x-2 p-1.5 rounded-xl border shadow-inner ${
            isDarkMode
              ? 'bg-slate-800/90 border-slate-700'
              : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            id="btn-step-play"
            onClick={onPlayToggle}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-sm"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Tạm Dừng</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{currentStepId === 'idle' ? 'Chạy Mô Phỏng' : 'Tiếp Tục'}</span>
              </>
            )}
          </button>

          <button
            id="btn-step-next"
            onClick={onNextStep}
            disabled={isPlaying || currentStepId === 'client_parsed'}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition ${
              isDarkMode
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
            title="Chuyển bước kế tiếp"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bước Tiếp</span>
          </button>

          <button
            id="btn-step-reset"
            onClick={onReset}
            className={`p-1.5 rounded-lg transition ${
              isDarkMode
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
            }`}
            title="Quay về ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visual Actors & Wire Transmission Stage */}
      <div className="relative z-10 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* ACTOR 1: IoT Client */}
          <div
            className={`p-4 rounded-xl border transition-all duration-300 ${
              isDarkMode
                ? currentStep.phase === 'client'
                  ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500/50 shadow-lg shadow-cyan-950/40'
                  : 'bg-slate-800/60 border-slate-700'
                : currentStep.phase === 'client'
                  ? 'bg-cyan-50/80 border-cyan-500 ring-1 ring-cyan-400 shadow-md'
                  : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isDarkMode
                      ? 'bg-cyan-600/20 border border-cyan-500/30 text-cyan-400'
                      : 'bg-cyan-100 border border-cyan-300 text-cyan-700'
                  }`}
                >
                  {clientType === 'esp32_device' ? (
                    <Cpu className="w-5 h-5" />
                  ) : (
                    <Globe className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {clientType === 'esp32_device' ? 'Vi Điều Khiển ESP32' : 'Trình Duyệt Cấu Hình'}
                  </h3>
                  <span className="text-[11px] text-cyan-500 font-mono">
                    {clientType === 'esp32_device' ? 'ESP-IDF / Arduino' : 'Captive Portal Web'}
                  </span>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  currentStepId === 'client_parsed' && isSuccess
                    ? isDarkMode
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : currentStepId === 'client_parsed' && isError
                    ? isDarkMode
                      ? 'bg-rose-950 text-rose-300 border-rose-700'
                      : 'bg-rose-100 text-rose-800 border-rose-300'
                    : isDarkMode
                    ? 'bg-slate-800 text-slate-300 border-slate-700'
                    : 'bg-slate-200 text-slate-700 border-slate-300'
                }`}
              >
                {currentStepId === 'client_parsed'
                  ? isSuccess ? 'ONLINE (AUTH OK)' : 'AUTH FAILED'
                  : currentStep.phase === 'client' ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>

            {/* Hardware & Network Specs */}
            <div
              className={`space-y-1.5 text-[11px] font-mono p-2.5 rounded-lg border ${
                isDarkMode
                  ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>IP Thiết Bị:</span>
                <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>192.168.1.105</span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>Địa chỉ MAC:</span>
                <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>24:6F:28:B1:C2:E0</span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>Bộ nhớ lưu trữ:</span>
                <span className={isDarkMode ? 'text-amber-300' : 'text-amber-600 font-semibold'}>
                  {currentStepId === 'client_parsed' && isSuccess
                    ? 'NVS Flash: Bearer JWT'
                    : 'RAM: Ready'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>Giao vận:</span>
                <span className={isDarkMode ? 'text-cyan-300' : 'text-cyan-700 font-semibold'}>
                  TCP Socket Client
                </span>
              </div>
            </div>
          </div>

          {/* ACTOR 2: Network / Transport / Packet Flow */}
          <div className="flex flex-col items-center justify-center p-3 relative">
            {/* Packet Wire Line */}
            <div
              className={`w-full h-1.5 rounded-full relative overflow-hidden my-4 ${
                isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
              }`}
            >
              {/* Traveling Packet Animation */}
              {currentStepId === 'send_request' && (
                <div
                  className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse rounded-full"
                  style={{ animation: 'travelRight 1.5s linear infinite' }}
                />
              )}
              {currentStepId === 'send_response' && (
                <div
                  className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse rounded-full"
                  style={{ animation: 'travelLeft 1.5s linear infinite' }}
                />
              )}
              {currentStepId === 'tcp_handshake' && (
                <div className="absolute inset-0 bg-amber-400/80 animate-pulse rounded-full" />
              )}
            </div>

            {/* Middle Packet Badge */}
            <div
              className={`border rounded-xl px-4 py-2.5 text-center shadow-md w-full max-w-[260px] ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-center space-x-1 text-xs mb-1">
                <Wifi className="w-3.5 h-3.5 text-cyan-500" />
                <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  WiFi / Router / Gateway
                </span>
              </div>

              {/* Protocol Packet Badge */}
              <div className="font-mono text-xs">
                {currentStepId === 'idle' && (
                  <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>
                    Chờ lệnh gửi...
                  </span>
                )}
                {currentStepId === 'tcp_handshake' && (
                  <div className="flex items-center justify-center space-x-1 text-amber-500 font-semibold animate-pulse">
                    <span>TCP [SYN, ACK] Cổng 80</span>
                  </div>
                )}
                {currentStepId === 'send_request' && (
                  <div className="flex items-center justify-center space-x-1 text-cyan-600 font-bold">
                    <span>HTTP POST &gt;&gt;</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-500 animate-bounce" />
                  </div>
                )}
                {currentStepId === 'server_processing' && (
                  <div className="flex items-center justify-center space-x-1 text-amber-500 font-semibold">
                    <Lock className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                    <span>Server Đang Xử Lý...</span>
                  </div>
                )}
                {currentStepId === 'send_response' && (
                  <div className="flex items-center justify-center space-x-1 text-emerald-600 font-bold">
                    <ArrowLeft className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                    <span>&lt;&lt; HTTP {statusCode || 200}</span>
                  </div>
                )}
                {currentStepId === 'client_parsed' && (
                  <div className={`flex items-center justify-center space-x-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Hoàn tất chu trình</span>
                  </div>
                )}
              </div>
              <div className={`text-[10px] font-mono mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Giao thức: HTTP/1.1 qua TCP:80
              </div>
            </div>
          </div>

          {/* ACTOR 3: IoT Authentication Server */}
          <div
            className={`p-4 rounded-xl border transition-all duration-300 ${
              isDarkMode
                ? currentStep.phase === 'server'
                  ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500/50 shadow-lg shadow-blue-950/40'
                  : 'bg-slate-800/60 border-slate-700'
                : currentStep.phase === 'server'
                  ? 'bg-blue-50/80 border-blue-500 ring-1 ring-blue-400 shadow-md'
                  : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isDarkMode
                      ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400'
                      : 'bg-blue-100 border border-blue-300 text-blue-700'
                  }`}
                >
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Máy Chủ Xác Thực (Auth)
                  </h3>
                  <span className="text-[11px] text-blue-500 font-mono">
                    api.iot-cloud.vn
                  </span>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isDarkMode
                    ? 'bg-slate-800 text-slate-300 border-slate-700'
                    : 'bg-slate-200 text-slate-700 border-slate-300'
                }`}
              >
                PORT 80 / 443
              </span>
            </div>

            {/* Server Specs */}
            <div
              className={`space-y-1.5 text-[11px] font-mono p-2.5 rounded-lg border ${
                isDarkMode
                  ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>IP Public:</span>
                <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>103.82.20.14</span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>Hệ thống Auth:</span>
                <span className={isDarkMode ? 'text-indigo-300' : 'text-indigo-700 font-semibold'}>
                  JWT Signer (HMAC)
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>Cơ sở dữ liệu:</span>
                <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>Device Reg & Users</span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>Thời hạn Token:</span>
                <span className={isDarkMode ? 'text-emerald-300' : 'text-emerald-700 font-semibold'}>
                  3600 giây (1 giờ)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Step Navigator Pills */}
      <div
        className={`relative z-10 pt-4 border-t ${
          isDarkMode ? 'border-slate-800/80' : 'border-slate-200'
        }`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {SIMULATION_STEPS.map((step, idx) => {
            const isCurrent = step.id === currentStepId;
            const isPast = SIMULATION_STEPS.findIndex((s) => s.id === currentStepId) >= idx;

            return (
              <button
                key={step.id}
                id={`btn-nav-step-${step.id}`}
                onClick={() => onSelectStep(step.id)}
                className={`p-2 rounded-xl text-left border transition text-xs relative ${
                  isCurrent
                    ? isDarkMode
                      ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-md shadow-cyan-950/30'
                      : 'bg-cyan-50 border-cyan-500 text-cyan-950 shadow-sm font-semibold'
                    : isPast
                    ? isDarkMode
                      ? 'bg-slate-800/70 border-slate-700 text-slate-200 hover:border-slate-600'
                      : 'bg-slate-100 border-slate-200 text-slate-800 hover:border-slate-300'
                    : isDarkMode
                    ? 'bg-slate-900/40 border-slate-800/80 text-slate-500 hover:text-slate-300'
                    : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      isCurrent
                        ? isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                        : isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Bước {idx + 1}
                  </span>
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                  )}
                </div>
                <div className="font-semibold truncate">{step.title.replace(/Bước \d+: /, '')}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Step Detailed Breakdown Banner */}
      <div
        className={`relative z-10 mt-4 rounded-xl p-3.5 border ${
          isDarkMode
            ? 'bg-slate-950/80 border-slate-800'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b mb-2 ${
            isDarkMode ? 'border-slate-800/80' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            <h4 className={`text-xs sm:text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {currentStep.title}
            </h4>
          </div>
          <span
            className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
              isDarkMode
                ? 'text-cyan-300 bg-cyan-950/80 border-cyan-800'
                : 'text-cyan-800 bg-cyan-50 border-cyan-200 font-semibold'
            }`}
          >
            {currentStep.subtitle}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className={`leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <span className={`font-semibold block mb-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Mô tả kỹ thuật mạng:
            </span>
            {currentStep.technicalDetails}
          </div>
          <div
            className={`leading-relaxed p-2 rounded-lg border ${
              isDarkMode
                ? 'text-amber-200/90 bg-amber-950/20 border-amber-900/40'
                : 'text-amber-900 bg-amber-50/80 border-amber-200'
            }`}
          >
            <span className={`font-semibold block mb-0.5 ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>
              Góc nhìn lập trình IoT (ESP32/C++):
            </span>
            {currentStep.iotNote}
          </div>
        </div>
      </div>
    </div>
  );
};
