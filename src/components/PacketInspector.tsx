import React, { useState } from 'react';
import { 
  FileCode2, 
  Terminal, 
  HardDrive, 
  Copy, 
  Check, 
  Layers, 
  Eye, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { HttpRequestData, HttpResponseData } from '../types';

interface PacketInspectorProps {
  requestData: HttpRequestData;
  responseData: HttpResponseData | null;
  authToken: string | null;
  tokenExpiresIn: number | null;
  deviceId: string;
  isDarkMode: boolean;
}

export const PacketInspector: React.FC<PacketInspectorProps> = ({
  requestData,
  responseData,
  authToken,
  tokenExpiresIn,
  deviceId,
  isDarkMode
}) => {
  const [activeTab, setActiveTab] = useState<'raw_wire' | 'formatted_json' | 'esp32_memory' | 'wireshark'>('raw_wire');
  const [copied, setCopied] = useState(false);

  // Generate Raw HTTP Request Wire text with \r\n explicitly visible
  const enabledHeaders = requestData.headers.filter((h) => h.enabled);
  const bodyBytes = new TextEncoder().encode(requestData.body).length;

  const rawRequestLines = [
    `${requestData.method} ${requestData.path} ${requestData.protocol}`,
    ...enabledHeaders.map((h) => `${h.key}: ${h.value}`),
    `Content-Length: ${bodyBytes}`,
    '', // Empty line representing \r\n before body
    requestData.body
  ];

  const rawRequestString = rawRequestLines.join('\r\n');

  const rawResponseString = responseData
    ? [
        `HTTP/1.1 ${responseData.statusCode} ${responseData.statusText}`,
        ...responseData.headers.map((h) => `${h.key}: ${h.value}`),
        '',
        responseData.body
      ].join('\r\n')
    : null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-2xl p-4 lg:p-6 shadow-xl flex flex-col h-full border transition-colors duration-200 ${
        isDarkMode
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* Top Header & Tabs */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div>
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyan-500" />
            <h3 className={`text-sm font-bold tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Bộ Phân Tích Gói Tin (Packet Inspector)
            </h3>
          </div>
          <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Xem chính xác cấu trúc byte truyền qua socket mạng và bộ nhớ vi điều khiển
          </p>
        </div>

        {/* Tab Buttons */}
        <div
          className={`flex items-center p-1 rounded-xl border text-xs font-medium ${
            isDarkMode
              ? 'bg-slate-950 border-slate-800'
              : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            id="tab-raw-wire"
            onClick={() => setActiveTab('raw_wire')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'raw_wire'
                ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                : isDarkMode
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Luồng Byte Thô (\r\n)
          </button>
          <button
            id="tab-formatted-json"
            onClick={() => setActiveTab('formatted_json')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'formatted_json'
                ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                : isDarkMode
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Định Dạng JSON
          </button>
          <button
            id="tab-esp32-memory"
            onClick={() => setActiveTab('esp32_memory')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1 ${
              activeTab === 'esp32_memory'
                ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                : isDarkMode
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HardDrive className="w-3 h-3" />
            <span>Bộ Nhớ Flash NVS</span>
          </button>
          <button
            id="tab-wireshark"
            onClick={() => setActiveTab('wireshark')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'wireshark'
                ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                : isDarkMode
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Khung Bắt Gói Tin
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="mt-4 flex-1 flex flex-col min-h-0">
        {/* TAB 1: RAW WIRE BYTES (CRLF \r\n Visualizer) */}
        {activeTab === 'raw_wire' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
            {/* Left: Request Stream */}
            <div
              className={`rounded-xl p-3.5 flex flex-col overflow-hidden border ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-800'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div
                className={`flex items-center justify-between pb-2 border-b mb-2 ${
                  isDarkMode ? 'border-slate-800/80' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span className={`text-xs font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    HTTP REQUEST (Gửi Đi từ ESP32)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono font-semibold">
                    {bodyBytes} bytes body
                  </span>
                  <button
                    id="btn-copy-raw-request"
                    onClick={() => handleCopy(rawRequestString)}
                    className={`p-1 rounded transition ${
                      isDarkMode
                        ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                        : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'
                    }`}
                    title="Sao chép chuỗi thô"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Raw Wire Box with highlighted CRLF markers */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-[11px] leading-relaxed text-slate-200 overflow-auto flex-1 select-text">
                {/* Request Line */}
                <div className="text-cyan-300 font-bold">
                  {requestData.method} {requestData.path} {requestData.protocol}
                  <span className="text-amber-400 font-bold bg-amber-950/60 px-1 ml-1 rounded text-[10px]">
                    \r\n
                  </span>
                </div>

                {/* Headers */}
                {enabledHeaders.map((h) => (
                  <div key={h.key} className="text-slate-300">
                    <span className="text-indigo-300">{h.key}</span>: {h.value}
                    <span className="text-amber-400 font-bold bg-amber-950/60 px-1 ml-1 rounded text-[10px]">
                      \r\n
                    </span>
                  </div>
                ))}

                {/* Content-Length Header */}
                <div className="text-slate-300">
                  <span className="text-indigo-300">Content-Length</span>: {bodyBytes}
                  <span className="text-amber-400 font-bold bg-amber-950/60 px-1 ml-1 rounded text-[10px]">
                    \r\n
                  </span>
                </div>

                {/* Crucial CRLF Blank Line Boundary */}
                <div className="my-1.5 p-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold flex items-center justify-between text-[10px]">
                  <span>&lt;Dòng trống phân cách Headers &amp; Body&gt;</span>
                  <span className="bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-black">
                    \r\n\r\n (CRLF kép)
                  </span>
                </div>

                {/* Body Content */}
                <div className="text-emerald-300 font-mono whitespace-pre-wrap mt-1">
                  {requestData.body}
                </div>
              </div>
            </div>

            {/* Right: Response Stream */}
            <div
              className={`rounded-xl p-3.5 flex flex-col overflow-hidden border ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-800'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div
                className={`flex items-center justify-between pb-2 border-b mb-2 ${
                  isDarkMode ? 'border-slate-800/80' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      responseData
                        ? responseData.statusCode === 200
                          ? 'bg-emerald-500'
                          : 'bg-rose-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span className={`text-xs font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    HTTP RESPONSE (Nhận Về từ Server)
                  </span>
                </div>
                {responseData && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      responseData.statusCode === 200
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {responseData.statusCode} {responseData.statusText}
                  </span>
                )}
              </div>

              {responseData ? (
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-[11px] leading-relaxed text-slate-200 overflow-auto flex-1 select-text">
                  {/* Status Line */}
                  <div
                    className={`font-bold ${
                      responseData.statusCode === 200 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    HTTP/1.1 {responseData.statusCode} {responseData.statusText}
                    <span className="text-amber-400 font-bold bg-amber-950/60 px-1 ml-1 rounded text-[10px]">
                      \r\n
                    </span>
                  </div>

                  {/* Headers */}
                  {responseData.headers.map((h) => (
                    <div key={h.key} className="text-slate-300">
                      <span className="text-indigo-300">{h.key}</span>: {h.value}
                      <span className="text-amber-400 font-bold bg-amber-950/60 px-1 ml-1 rounded text-[10px]">
                        \r\n
                      </span>
                    </div>
                  ))}

                  {/* CRLF empty line */}
                  <div className="my-1.5 p-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold flex items-center justify-between text-[10px]">
                    <span>&lt;Dòng trống phân cách Headers &amp; Body&gt;</span>
                    <span className="bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-black">
                      \r\n\r\n (CRLF kép)
                    </span>
                  </div>

                  {/* Response Body */}
                  <div className="bg-slate-950 p-2 rounded border border-slate-800 text-cyan-300 whitespace-pre-wrap">
                    {responseData.body}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <Terminal className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-xs">Chưa có phản hồi từ máy chủ.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Hãy bấm nút "Gửi Yêu Cầu HTTP POST" để xem phản hồi thực tế.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: FORMATTED JSON VIEW */}
        {activeTab === 'formatted_json' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
            {/* Request Payload JSON */}
            <div
              className={`rounded-xl p-4 flex flex-col border ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className={`text-xs font-bold mb-2 font-mono flex items-center space-x-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <span>Payload Đăng Nhập (Client Body)</span>
              </span>
              <pre className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300 flex-1 overflow-auto">
                {requestData.body}
              </pre>
            </div>

            {/* Response Payload JSON */}
            <div
              className={`rounded-xl p-4 flex flex-col border ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className={`text-xs font-bold mb-2 font-mono flex items-center space-x-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <span>Payload Phản Hồi (Server Response)</span>
              </span>
              {responseData ? (
                <pre className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs font-mono text-emerald-300 flex-1 overflow-auto">
                  {responseData.body}
                </pre>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
                  Chờ phản hồi từ máy chủ...
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ESP32 MEMORY / FLASH NVS SIMULATOR */}
        {activeTab === 'esp32_memory' && (
          <div
            className={`rounded-xl p-4 flex-1 flex flex-col border ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-3 border-b mb-4 ${
                isDarkMode ? 'border-slate-800' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-amber-500" />
                <h4 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Mô Phỏng Bộ Nhớ Vi Điều Khiển ESP32 (RAM & NVS Flash)
                </h4>
              </div>
              <span className="text-[11px] font-mono text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                Non-Volatile Storage (NVS)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {/* RAM State */}
              <div
                className={`border rounded-xl p-3.5 space-y-3 ${
                  isDarkMode
                    ? 'bg-slate-900/90 border-slate-800'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-600 dark:text-cyan-300 font-mono">
                    Bộ Nhớ RAM Tĩnh
                  </span>
                  <span className="text-[10px] text-slate-500">Mất khi reset nguồn</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div
                    className={`p-2 rounded border ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="text-slate-500 block text-[10px]">String authToken (RAM Buffer):</span>
                    <span className="text-emerald-600 dark:text-emerald-400 break-all font-semibold">
                      {authToken ? `"${authToken}"` : '"" (Rỗng)'}
                    </span>
                  </div>

                  <div
                    className={`p-2 rounded border ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="text-slate-500 block text-[10px]">uint32_t tokenExpiresAt:</span>
                    <span className="text-amber-600 dark:text-amber-300 font-semibold">
                      {tokenExpiresIn ? `${tokenExpiresIn} giây (~1 giờ)` : '0'}
                    </span>
                  </div>

                  <div
                    className={`p-2 rounded border ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="text-slate-500 block text-[10px]">Device State Enum:</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                      {authToken ? 'STATE_AUTHENTICATED' : 'STATE_DISCONNECTED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* NVS Flash Storage */}
              <div
                className={`border rounded-xl p-3.5 space-y-3 ${
                  isDarkMode
                    ? 'bg-slate-900/90 border-slate-800'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-300 font-mono">
                    Vùng Nhớ Flash (NVS Preferences)
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Lưu vĩnh viễn qua các lần Reboot
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div
                    className={`p-2 rounded border ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="text-slate-500 block text-[10px]">Namespace: "iot_auth"</span>
                    <div className="flex justify-between mt-1 text-[11px]">
                      <span className="text-slate-500">Key: "jwt_token"</span>
                      <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>
                        {authToken ? `${authToken.slice(0, 16)}...` : '(Chưa ghi)'}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1 text-[11px]">
                      <span className="text-slate-500">Key: "device_id"</span>
                      <span className="text-cyan-600 dark:text-cyan-300 font-semibold">
                        {deviceId || 'ESP32-NODE-01'}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-2.5 rounded text-[11px] leading-relaxed font-sans border ${
                      isDarkMode
                        ? 'bg-cyan-950/30 border-cyan-900/50 text-cyan-200'
                        : 'bg-cyan-50 border-cyan-200 text-cyan-900'
                    }`}
                  >
                    <strong>Kỹ năng thực tế:</strong> Trong ESP32, sau khi hàm HTTPClient nhận chuỗi JSON từ server, ta dùng thư viện <code className="text-amber-600 dark:text-amber-300 font-bold">Preferences.h</code> để gọi <code className="text-cyan-600 dark:text-cyan-300 font-bold">prefs.putString("jwt_token", token)</code>. Nhờ đó, nếu thiết bị mất điện và khởi động lại, vi điều khiển không cần phải gọi API login liên tục!
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WIRESHARK-LIKE PACKET TABLE */}
        {activeTab === 'wireshark' && (
          <div
            className={`rounded-xl p-3 flex-1 flex flex-col overflow-x-auto border ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr
                  className={`border-b text-[11px] ${
                    isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <th className="py-2 px-2">Gói #</th>
                  <th className="py-2 px-2">Thời Gian</th>
                  <th className="py-2 px-2">Nguồn (Source)</th>
                  <th className="py-2 px-2">Đích (Destination)</th>
                  <th className="py-2 px-2">Giao Thức</th>
                  <th className="py-2 px-2">Kích Thước</th>
                  <th className="py-2 px-2">Thông Tin (Info)</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-900 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                <tr className={isDarkMode ? 'hover:bg-slate-900/50' : 'hover:bg-slate-100'}>
                  <td className="py-1.5 px-2 text-slate-500">1</td>
                  <td className="py-1.5 px-2">0.000000</td>
                  <td className="py-1.5 px-2 text-cyan-600 dark:text-cyan-300">192.168.1.105:54321</td>
                  <td className="py-1.5 px-2 text-blue-600 dark:text-blue-300">103.82.20.14:80</td>
                  <td className="py-1.5 px-2 font-bold text-amber-600 dark:text-amber-400">TCP</td>
                  <td className="py-1.5 px-2">64 B</td>
                  <td className="py-1.5 px-2 text-slate-500">[SYN] Seq=0 Win=64240 MSS=1460</td>
                </tr>
                <tr className={isDarkMode ? 'hover:bg-slate-900/50' : 'hover:bg-slate-100'}>
                  <td className="py-1.5 px-2 text-slate-500">2</td>
                  <td className="py-1.5 px-2">0.024180</td>
                  <td className="py-1.5 px-2 text-blue-600 dark:text-blue-300">103.82.20.14:80</td>
                  <td className="py-1.5 px-2 text-cyan-600 dark:text-cyan-300">192.168.1.105:54321</td>
                  <td className="py-1.5 px-2 font-bold text-amber-600 dark:text-amber-400">TCP</td>
                  <td className="py-1.5 px-2">64 B</td>
                  <td className="py-1.5 px-2 text-slate-500">[SYN, ACK] Seq=0 Ack=1 Win=65535</td>
                </tr>
                <tr className={isDarkMode ? 'hover:bg-slate-900/50' : 'hover:bg-slate-100'}>
                  <td className="py-1.5 px-2 text-slate-500">3</td>
                  <td className="py-1.5 px-2">0.024220</td>
                  <td className="py-1.5 px-2 text-cyan-600 dark:text-cyan-300">192.168.1.105:54321</td>
                  <td className="py-1.5 px-2 text-blue-600 dark:text-blue-300">103.82.20.14:80</td>
                  <td className="py-1.5 px-2 font-bold text-amber-600 dark:text-amber-400">TCP</td>
                  <td className="py-1.5 px-2">54 B</td>
                  <td className="py-1.5 px-2 text-slate-500">[ACK] Seq=1 Ack=1 Win=64240</td>
                </tr>
                <tr className={isDarkMode ? 'bg-cyan-950/20 hover:bg-cyan-950/30' : 'bg-cyan-50/60 hover:bg-cyan-100/60'}>
                  <td className="py-1.5 px-2 text-cyan-600 dark:text-cyan-400 font-bold">4</td>
                  <td className="py-1.5 px-2">0.025100</td>
                  <td className="py-1.5 px-2 text-cyan-600 dark:text-cyan-300">192.168.1.105:54321</td>
                  <td className="py-1.5 px-2 text-blue-600 dark:text-blue-300">103.82.20.14:80</td>
                  <td className="py-1.5 px-2 font-bold text-cyan-600 dark:text-cyan-400">HTTP</td>
                  <td className="py-1.5 px-2 font-bold">{rawRequestString.length} B</td>
                  <td className="py-1.5 px-2 text-cyan-700 dark:text-cyan-300 font-bold">POST /api/v1/auth/login (application/json)</td>
                </tr>
                {responseData && (
                  <tr className={isDarkMode ? 'bg-emerald-950/20 hover:bg-emerald-950/30' : 'bg-emerald-50/60 hover:bg-emerald-100/60'}>
                    <td className="py-1.5 px-2 text-emerald-600 dark:text-emerald-400 font-bold">5</td>
                    <td className="py-1.5 px-2">0.078320</td>
                    <td className="py-1.5 px-2 text-blue-600 dark:text-blue-300">103.82.20.14:80</td>
                    <td className="py-1.5 px-2 text-cyan-600 dark:text-cyan-300">192.168.1.105:54321</td>
                    <td className="py-1.5 px-2 font-bold text-emerald-600 dark:text-emerald-400">HTTP</td>
                    <td className="py-1.5 px-2 font-bold">{(rawResponseString || '').length} B</td>
                    <td className="py-1.5 px-2 text-emerald-700 dark:text-emerald-300 font-bold">
                      HTTP/1.1 {responseData.statusCode} {responseData.statusText}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
