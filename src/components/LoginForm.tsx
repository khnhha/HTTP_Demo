import React, { useState } from 'react';
import { 
  Send, 
  Settings2, 
  KeyRound, 
  User, 
  Layers, 
  Sliders, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Laptop,
  Radio,
  Cpu
} from 'lucide-react';
import { AuthScenario, ClientType, HttpHeader } from '../types';
import { AUTH_SCENARIOS, DEFAULT_HEADERS } from '../data/constants';

interface LoginFormProps {
  clientType: ClientType;
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  deviceId: string;
  setDeviceId: (v: string) => void;
  headers: HttpHeader[];
  setHeaders: React.Dispatch<React.SetStateAction<HttpHeader[]>>;
  contentType: 'application/json' | 'application/x-www-form-urlencoded';
  setContentType: (v: 'application/json' | 'application/x-www-form-urlencoded') => void;
  onSendRequest: () => void;
  isSending: boolean;
  onSelectScenario: (scenario: AuthScenario) => void;
  selectedScenarioId: string;
  isDarkMode: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  clientType,
  username,
  setUsername,
  password,
  setPassword,
  deviceId,
  setDeviceId,
  headers,
  setHeaders,
  contentType,
  setContentType,
  onSendRequest,
  isSending,
  onSelectScenario,
  selectedScenarioId,
  isDarkMode
}) => {
  const [showAdvancedHeaders, setShowAdvancedHeaders] = useState(false);

  // Compute body string based on content type
  const bodyString = contentType === 'application/json'
    ? JSON.stringify({ username, password, device_id: deviceId }, null, 2)
    : `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&device_id=${encodeURIComponent(deviceId)}`;

  const bodyByteLength = new TextEncoder().encode(bodyString).length;

  const handleToggleHeader = (index: number) => {
    setHeaders((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], enabled: !next[index].enabled };
      return next;
    });
  };

  const handleHeaderValueChange = (index: number, val: string) => {
    setHeaders((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], value: val };
      return next;
    });
  };

  return (
    <div
      className={`rounded-2xl p-4 lg:p-6 shadow-xl flex flex-col h-full border transition-colors duration-200 ${
        isDarkMode
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* Top Banner / Scenario Selector */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Kịch Bản Kiểm Thử (Presets)
          </span>
          <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
            Chọn để điền nhanh dữ liệu
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {AUTH_SCENARIOS.map((sc) => {
            const isSelected = sc.id === selectedScenarioId;
            return (
              <button
                key={sc.id}
                id={`btn-scenario-${sc.id}`}
                onClick={() => onSelectScenario(sc)}
                className={`p-2 rounded-xl text-left border transition text-xs relative ${
                  isSelected
                    ? isDarkMode
                      ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-sm'
                      : 'bg-cyan-50 border-cyan-500 text-cyan-950 shadow-xs font-semibold'
                    : isDarkMode
                    ? 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-semibold truncate text-[11px]">{sc.label.split('(')[0]}</div>
                <div
                  className={`font-mono text-[10px] mt-0.5 ${
                    sc.expectedStatus === 200
                      ? isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                      : isDarkMode ? 'text-amber-400' : 'text-amber-700'
                  }`}
                >
                  {sc.expectedStatus} {sc.expectedStatusText}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Login Form & Inputs */}
      <div
        className={`rounded-xl p-4 mb-4 border ${
          isDarkMode
            ? 'bg-slate-950/60 border-slate-800'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        {/* Portal Address Bar Simulation */}
        <div
          className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 mb-4 text-xs font-mono border ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-slate-300'
              : 'bg-white border-slate-200 text-slate-700 shadow-xs'
          }`}
        >
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">POST</span>
          <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>http://iot-cloud.smartgateway.vn</span>
          <span className="text-cyan-600 dark:text-cyan-400 font-semibold">/api/v1/auth/login</span>
        </div>

        <div className="space-y-3.5">
          {/* Username Input */}
          <div>
            <label className="block text-xs font-semibold mb-1 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-cyan-500" />
                <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>
                  Tên Tài Khoản (Username / Device ID)
                </span>
              </span>
              <span className={`text-[10px] font-normal ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Truyền trong JSON body
              </span>
            </label>
            <input
              id="input-login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full rounded-lg px-3 py-2 text-sm font-mono transition border ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 focus:border-cyan-500 text-white placeholder-slate-500'
                  : 'bg-white border-slate-300 focus:border-cyan-600 text-slate-900 placeholder-slate-400'
              }`}
              placeholder="Nhập username..."
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold mb-1 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-500" />
                <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>
                  Mật Khẩu (Password / Device Secret)
                </span>
              </span>
              <span className={`text-[10px] font-normal ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Sẽ được máy chủ băm đối chiếu
              </span>
            </label>
            <input
              id="input-login-password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full rounded-lg px-3 py-2 text-sm font-mono transition border ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 focus:border-cyan-500 text-white placeholder-slate-500'
                  : 'bg-white border-slate-300 focus:border-cyan-600 text-slate-900 placeholder-slate-400'
              }`}
              placeholder="Nhập password..."
            />
          </div>

          {/* Device ID Input (Optional in IoT) */}
          <div>
            <label className="block text-xs font-semibold mb-1 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-500" />
                <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>
                  Mã Định Danh Phần Cứng (Device Hardware ID)
                </span>
              </span>
              <span className={`text-[10px] font-normal ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Ví dụ: ESP32-NODE-01
              </span>
            </label>
            <input
              id="input-device-id"
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              className={`w-full rounded-lg px-3 py-2 text-sm font-mono transition border ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 focus:border-cyan-500 text-white placeholder-slate-500'
                  : 'bg-white border-slate-300 focus:border-cyan-600 text-slate-900 placeholder-slate-400'
              }`}
              placeholder="ESP32-NODE-01"
            />
          </div>
        </div>

        {/* Content-Type Selection */}
        <div
          className={`mt-4 pt-3 border-t flex items-center justify-between ${
            isDarkMode ? 'border-slate-800/80' : 'border-slate-200'
          }`}
        >
          <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Định dạng Payload (Content-Type):
          </span>
          <div className="flex space-x-2 text-xs font-mono">
            <button
              id="btn-content-type-json"
              onClick={() => setContentType('application/json')}
              className={`px-2.5 py-1 rounded-md border transition ${
                contentType === 'application/json'
                  ? isDarkMode
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-600'
                    : 'bg-cyan-100 text-cyan-800 border-cyan-400 font-semibold'
                  : isDarkMode
                  ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
              }`}
            >
              application/json
            </button>
            <button
              id="btn-content-type-form"
              onClick={() => setContentType('application/x-www-form-urlencoded')}
              className={`px-2.5 py-1 rounded-md border transition ${
                contentType === 'application/x-www-form-urlencoded'
                  ? isDarkMode
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-600'
                    : 'bg-cyan-100 text-cyan-800 border-cyan-400 font-semibold'
                  : isDarkMode
                  ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
              }`}
            >
              form-urlencoded
            </button>
          </div>
        </div>
      </div>

      {/* Advanced HTTP Headers Accordion */}
      <div className="mb-4">
        <button
          id="btn-toggle-advanced-headers"
          onClick={() => setShowAdvancedHeaders(!showAdvancedHeaders)}
          className={`flex items-center justify-between w-full p-2.5 rounded-xl border text-xs font-semibold transition ${
            isDarkMode
              ? 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/80 text-slate-300'
              : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-800'
          }`}
        >
          <span className="flex items-center space-x-2">
            <Settings2 className="w-4 h-4 text-cyan-500" />
            <span>Cấu Hình HTTP Headers ({headers.filter(h => h.enabled).length} đang bật)</span>
          </span>
          <span className="text-cyan-600 dark:text-cyan-400 font-mono">
            {showAdvancedHeaders ? 'Thu gọn ▲' : 'Mở rộng ▼'}
          </span>
        </button>

        {showAdvancedHeaders && (
          <div
            className={`mt-2 rounded-xl p-3 space-y-2 text-xs border ${
              isDarkMode
                ? 'bg-slate-950/80 border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className={`text-[11px] mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Trong lập trình IoT (ESP32 / Arduino), việc thêm đúng các Headers như <code className="text-cyan-600 dark:text-cyan-300 font-bold">Host</code> và <code className="text-cyan-600 dark:text-cyan-300 font-bold">Content-Length</code> là điều kiện tiên quyết để server không từ chối gói tin.
            </div>

            {headers.map((hdr, idx) => (
              <div
                key={hdr.key}
                className={`flex items-center justify-between gap-2 p-2 rounded-lg border ${
                  isDarkMode
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2 min-w-[130px]">
                  <input
                    id={`checkbox-header-${idx}`}
                    type="checkbox"
                    checked={hdr.enabled}
                    onChange={() => handleToggleHeader(idx)}
                    className="rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className={`font-mono font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {hdr.key}
                  </span>
                </div>
                <input
                  id={`input-header-val-${idx}`}
                  type="text"
                  value={hdr.value}
                  disabled={!hdr.enabled}
                  onChange={(e) => handleHeaderValueChange(idx, e.target.value)}
                  className={`flex-1 border rounded px-2 py-1 text-xs font-mono disabled:opacity-40 ${
                    isDarkMode
                      ? 'bg-slate-950 border-slate-800 focus:border-cyan-500 text-slate-300'
                      : 'bg-slate-50 border-slate-200 focus:border-cyan-600 text-slate-800'
                  }`}
                />
              </div>
            ))}

            {/* Auto-calculated Content Length note */}
            <div
              className={`flex items-center justify-between p-2 rounded-lg text-[11px] border ${
                isDarkMode
                  ? 'bg-cyan-950/30 border-cyan-900/40 text-cyan-300'
                  : 'bg-cyan-50 border-cyan-200 text-cyan-900'
              }`}
            >
              <span className="font-mono font-semibold">Content-Length (Tự động tính):</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-300">{bodyByteLength} bytes</span>
            </div>
          </div>
        )}
      </div>

      {/* Send HTTP Action Button */}
      <div className="mt-auto pt-2">
        <button
          id="btn-send-http-request"
          onClick={onSendRequest}
          disabled={isSending}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className={`w-4 h-4 ${isSending ? 'animate-bounce' : ''}`} />
          <span>{isSending ? 'Đang Truyền Gói Tin Qua Mạng...' : 'Gửi Yêu Cầu HTTP POST (Xác Thực)'}</span>
        </button>

        <div className={`flex items-center justify-between text-[11px] mt-2 px-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <span>Kích thước Body: <strong className={`font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{bodyByteLength} bytes</strong></span>
          <span>Target: <strong className="text-cyan-600 dark:text-cyan-400 font-mono">PORT 80 (HTTP)</strong></span>
        </div>
      </div>
    </div>
  );
};
