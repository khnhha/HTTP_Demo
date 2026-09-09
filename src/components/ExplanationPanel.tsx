import React, { useState } from 'react';
import { 
  BookOpen, 
  Code2, 
  Layers, 
  ShieldAlert, 
  CheckCircle2, 
  Copy, 
  Check, 
  Scale, 
  Cpu, 
  ArrowRight,
  Terminal,
  Zap,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { CODE_EXAMPLES } from '../data/constants';

interface ExplanationPanelProps {
  isDarkMode: boolean;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'structure' | 'lifecycle' | 'status_codes' | 'code_examples' | 'comparison'>('structure');
  const [selectedCodeTab, setSelectedCodeTab] = useState<'esp32_httpclient' | 'esp32_raw_socket' | 'micropython' | 'curl'>('esp32_httpclient');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      className={`rounded-2xl p-4 lg:p-6 shadow-xl border transition-colors duration-200 ${
        isDarkMode
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* Panel Top Header */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center space-x-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDarkMode
                ? 'bg-cyan-600/20 border border-cyan-500/30 text-cyan-400'
                : 'bg-cyan-100 border border-cyan-300 text-cyan-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-base font-bold tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Tài Liệu Giải Thích Chuyên Sâu (IoT HTTP Knowledge Base)
            </h3>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Nguyên lý hoạt động, cấu trúc gói tin thô, mã trạng thái và mẫu code cho kỹ sư nhúng
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          className={`flex flex-wrap items-center gap-1.5 p-1 rounded-xl border text-xs font-medium ${
            isDarkMode
              ? 'bg-slate-950 border-slate-800'
              : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            id="tab-exp-structure"
            onClick={() => setActiveTab('structure')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'structure'
                ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                : isDarkMode
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Giải Phẫu HTTP Gói Tin
          </button>
          <button
            id="tab-exp-lifecycle"
            onClick={() => setActiveTab('lifecycle')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'lifecycle'
                ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                : isDarkMode
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Chu Trình Xác Thực IoT
          </button>
          <button
            id="tab-exp-status-codes"
            onClick={() => setActiveTab('status_codes')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'status_codes'
                ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                : isDarkMode
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Mã Trạng Thái &amp; Retry
          </button>
          <button
            id="tab-exp-code-examples"
            onClick={() => setActiveTab('code_examples')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'code_examples'
                ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                : isDarkMode
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Code Mẫu Thực Chiến
          </button>
          <button
            id="tab-exp-comparison"
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'comparison'
                ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                : isDarkMode
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            5. So Sánh HTTP vs MQTT
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className={`mt-6 text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
        {/* TAB 1: CẤU TRÚC GÓI TIN HTTP */}
        {activeTab === 'structure' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Request Architecture */}
              <div
                className={`rounded-xl p-4 border ${
                  isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 font-bold mb-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <h4>Cấu Trúc HTTP Request (Gửi từ ESP32)</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div
                    className={`p-2.5 rounded-lg border ${
                      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <span className="text-cyan-600 dark:text-cyan-300 font-mono font-bold block mb-1">
                      1. Request Line (Dòng Yêu Cầu)
                    </span>
                    <code className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-slate-950 px-2 py-1 rounded block font-mono border border-amber-200 dark:border-transparent">
                      POST /api/v1/auth/login HTTP/1.1
                    </code>
                    <p className={`text-[11px] mt-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Gồm 3 thành phần: Phương thức (<code className="text-cyan-600 dark:text-cyan-300 font-bold">POST</code>), Đường dẫn tài nguyên (<code className="text-cyan-600 dark:text-cyan-300 font-bold">/path</code>), và Phiên bản giao thức (<code className="text-cyan-600 dark:text-cyan-300 font-bold">HTTP/1.1</code>). Kết thúc bằng ký tự <code className="text-slate-800 dark:text-slate-200 font-bold">\r\n</code>.
                    </p>
                  </div>

                  <div
                    className={`p-2.5 rounded-lg border ${
                      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <span className="text-cyan-600 dark:text-cyan-300 font-mono font-bold block mb-1">
                      2. Headers (Tiêu Đề Yêu Cầu)
                    </span>
                    <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Cặp <code className="text-slate-800 dark:text-slate-200 font-semibold">Key: Value</code> cung cấp thông tin ngữ cảnh:
                    </p>
                    <ul className={`list-disc list-inside text-[11px] space-y-1 mt-1 font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      <li><strong className="text-blue-600 dark:text-blue-300">Host:</strong> Bắt buộc trong HTTP/1.1 để máy chủ phân định Virtual Host.</li>
                      <li><strong className="text-blue-600 dark:text-blue-300">Content-Type:</strong> Định dạng dữ liệu (vd: application/json).</li>
                      <li><strong className="text-blue-600 dark:text-blue-300">Content-Length:</strong> Số lượng byte chính xác của phần thân.</li>
                      <li><strong className="text-blue-600 dark:text-blue-300">User-Agent:</strong> Tên vi điều khiển/client.</li>
                    </ul>
                  </div>

                  <div
                    className={`p-2.5 rounded-lg border ${
                      isDarkMode
                        ? 'bg-amber-950/30 border-amber-800/60'
                        : 'bg-amber-50 border-amber-300 text-amber-900'
                    }`}
                  >
                    <span className="text-amber-700 dark:text-amber-300 font-mono font-bold block mb-1">
                      3. Ký Tự Phân Tách Sinh Tử: \r\n\r\n (CRLF kép)
                    </span>
                    <p className={`text-[11px] ${isDarkMode ? 'text-amber-200' : 'text-amber-900'}`}>
                      Khi lập trình Socket C/C++ trực tiếp (<code className="text-cyan-700 dark:text-cyan-300 font-bold">WiFiClient</code>), máy chủ chỉ bắt đầu đọc Body sau khi gặp <strong>dòng trống chứa ký tự xuống dòng kép (\r\n\r\n)</strong>. Nếu thiếu, máy chủ sẽ bị treo đợi mãi cho tới khi timeout ngắt kết nối!
                    </p>
                  </div>

                  <div
                    className={`p-2.5 rounded-lg border ${
                      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <span className="text-cyan-600 dark:text-cyan-300 font-mono font-bold block mb-1">
                      4. Request Body (Phần Thân Gói Tin)
                    </span>
                    <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Chứa payload xác thực (username, password, MAC). Dữ liệu này được mã hóa truyền qua socket mạng.
                    </p>
                  </div>
                </div>
              </div>

              {/* Response Architecture */}
              <div
                className={`rounded-xl p-4 border ${
                  isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h4>Cấu Trúc HTTP Response (Máy Chủ Trả Về)</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div
                    className={`p-2.5 rounded-lg border ${
                      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <span className="text-emerald-600 dark:text-emerald-300 font-mono font-bold block mb-1">
                      1. Status Line (Dòng Trạng Thái)
                    </span>
                    <code className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-slate-950 px-2 py-1 rounded block font-mono border border-emerald-200 dark:border-transparent">
                      HTTP/1.1 200 OK
                    </code>
                    <p className={`text-[11px] mt-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Gồm phiên bản HTTP, Mã số trạng thái (<code className="text-emerald-600 dark:text-emerald-300 font-bold">200</code>), và Thông điệp văn bản (<code className="text-emerald-600 dark:text-emerald-300 font-bold">OK</code>). Trong Arduino, hàm <code className="text-cyan-600 dark:text-cyan-300 font-bold">http.POST()</code> sẽ trả về chính con số nguyên này.
                    </p>
                  </div>

                  <div
                    className={`p-2.5 rounded-lg border ${
                      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <span className="text-emerald-600 dark:text-emerald-300 font-mono font-bold block mb-1">
                      2. Response Headers
                    </span>
                    <ul className={`list-disc list-inside text-[11px] space-y-1 font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      <li><strong className="text-blue-600 dark:text-blue-300">Content-Type:</strong> application/json; charset=utf-8.</li>
                      <li><strong className="text-blue-600 dark:text-blue-300">Content-Length:</strong> Kích thước gói tin trả về để ESP32 phân bổ buffer RAM.</li>
                      <li><strong className="text-blue-600 dark:text-blue-300">Date:</strong> Thời gian máy chủ (đồng bộ thời gian cho IoT RTC).</li>
                    </ul>
                  </div>

                  <div
                    className={`p-2.5 rounded-lg border ${
                      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <span className="text-emerald-600 dark:text-emerald-300 font-mono font-bold block mb-1">
                      3. Response Body (Payload Cấp Quyền)
                    </span>
                    <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Chứa chuỗi JSON bao gồm JWT Bearer Token, quyền hạn (role) và thời hạn hiệu lực (<code className="text-amber-600 dark:text-amber-300 font-bold">expires_in: 3600</code>). Vi điều khiển dùng thư viện <code className="text-cyan-600 dark:text-cyan-300 font-bold">ArduinoJson</code> để bóc tách trường <code className="text-cyan-600 dark:text-cyan-300 font-bold">token</code>.
                    </p>
                  </div>

                  <div
                    className={`p-2.5 rounded-lg border text-[11px] ${
                      isDarkMode
                        ? 'bg-cyan-950/30 border-cyan-800/60 text-cyan-200'
                        : 'bg-cyan-50 border-cyan-200 text-cyan-900'
                    }`}
                  >
                    <strong>Tối ưu hóa tài nguyên vi điều khiển:</strong> Luôn đọc và tiêu thụ hết luồng dữ liệu phản hồi từ socket (<code className="font-bold">http.getString()</code> hoặc <code className="font-bold">client.read()</code>) trước khi gọi <code className="font-bold">http.end()</code> để tránh rò rỉ bộ nhớ heap (memory leak).
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CHU TRÌNH XÁC THỰC IOT */}
        {activeTab === 'lifecycle' && (
          <div className="space-y-6">
            {/* Step flow cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl border relative ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold block mb-1">GIAI ĐOẠN 1</span>
                <h4 className={`font-bold text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Khởi Tạo &amp; Đọc Config</h4>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Thiết bị IoT khởi động, kết nối WiFi. Kiểm tra xem trong Flash NVS đã có Token hợp lệ hay chưa. Nếu chưa có hoặc đã hết hạn, kích hoạt tiến trình Login.
                </p>
              </div>

              <div className={`p-4 rounded-xl border relative ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold block mb-1">GIAI ĐOẠN 2</span>
                <h4 className={`font-bold text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Gửi Credentials Qua POST</h4>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Thiết bị gửi tài khoản/mật khẩu và Hardware MAC tới endpoint <code className="text-cyan-600 dark:text-cyan-300 font-bold">/api/v1/auth/login</code>. Máy chủ kiểm tra mật khẩu đã hash bcrypt và đối chiếu whitelist thiết bị.
                </p>
              </div>

              <div className={`p-4 rounded-xl border relative ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold block mb-1">GIAI ĐOẠN 3</span>
                <h4 className={`font-bold text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Cấp &amp; Lưu Trữ Token</h4>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Server trả về JWT Bearer Token. ESP32 bóc tách JSON và ghi Token vào vùng nhớ Flash <strong className="text-amber-600 dark:text-amber-300">Preferences / NVS</strong> để không bị mất khi cúp điện.
                </p>
              </div>

              <div className={`p-4 rounded-xl border relative ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold block mb-1">GIAI ĐOẠN 4</span>
                <h4 className={`font-bold text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Truyền Cảm Biến (Telemetry)</h4>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Các chu kỳ sau đó (vd: 30s/lần), thiết bị chỉ cần đính kèm Header <code className="text-emerald-600 dark:text-emerald-300 font-bold">Authorization: Bearer &lt;token&gt;</code>, không cần gửi lại user/password nữa.
                </p>
              </div>
            </div>

            {/* Deep Dive Security in IoT */}
            <div
              className={`rounded-xl p-5 border ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <h4 className={`text-sm font-bold mb-3 flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Tại sao trong IoT phải dùng Token thay vì gửi Mật khẩu mỗi lần gửi dữ liệu?</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div
                  className={`p-3 rounded-lg border ${
                    isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <strong className="text-cyan-600 dark:text-cyan-300 block mb-1">1. Tiết kiệm năng lượng &amp; CPU</strong>
                  <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    Mỗi lần kiểm tra mật khẩu, máy chủ phải chạy thuật toán băm (vd: bcrypt / Argon2) rất tốn tài nguyên. Ngược lại, kiểm tra chữ ký số của JWT token chỉ mất vài micro-giây.
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg border ${
                    isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <strong className="text-emerald-600 dark:text-emerald-300 block mb-1">2. Thu hồi quyền tức thì (Revocation)</strong>
                  <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    Nếu một thiết bị IoT ở hiện trường bị đánh cắp, quản trị viên chỉ cần vô hiệu hóa Token hoặc thay đổi secret key, không làm lộ mật khẩu gốc của hệ thống.
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg border ${
                    isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <strong className="text-amber-600 dark:text-amber-300 block mb-1">3. Giới hạn phạm vi (Scope &amp; Expiry)</strong>
                  <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    Token có thể quy định chỉ cho phép thiết bị gửi dữ liệu (<code className="text-cyan-600 dark:text-cyan-300 font-bold">sensor:write</code>), không cho phép thiết bị can thiệp cấu hình hệ thống máy chủ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MÃ TRẠNG THÁI & RETRY LOGIC */}
        {activeTab === 'status_codes' && (
          <div className="space-y-6">
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr
                    className={`border-b text-[11px] ${
                      isDarkMode
                        ? 'border-slate-800 bg-slate-950 text-slate-400'
                        : 'border-slate-200 bg-slate-100 text-slate-700'
                    }`}
                  >
                    <th className="py-2.5 px-3">Mã HTTP</th>
                    <th className="py-2.5 px-3">Tên Chuẩn</th>
                    <th className="py-2.5 px-3">Ý Nghĩa Trong Xác Thực IoT</th>
                    <th className="py-2.5 px-3">Hành Vi Xử Lý Của Firmware (ESP32)</th>
                  </tr>
                </thead>
                <tbody className={`divide-y font-mono ${isDarkMode ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                  <tr className={isDarkMode ? 'hover:bg-slate-950/40' : 'hover:bg-slate-50'}>
                    <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">200</td>
                    <td className={`py-2.5 px-3 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>OK</td>
                    <td className={`py-2.5 px-3 font-sans ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Đăng nhập thành công, máy chủ cấp token.</td>
                    <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-300 font-sans font-medium">Parse JSON, lưu token vào Flash, chuyển sang chế độ Telemetry.</td>
                  </tr>
                  <tr className={isDarkMode ? 'hover:bg-slate-950/40' : 'hover:bg-slate-50'}>
                    <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">201</td>
                    <td className={`py-2.5 px-3 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Created</td>
                    <td className={`py-2.5 px-3 font-sans ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Đã ghi nhận dữ liệu cảm biến mới lên database.</td>
                    <td className={`py-2.5 px-3 font-sans ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Xóa bộ đệm dữ liệu tạm thời, chuẩn bị cho chu kỳ ngủ (Deep Sleep).</td>
                  </tr>
                  <tr className={isDarkMode ? 'hover:bg-slate-950/40' : 'hover:bg-slate-50'}>
                    <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400 font-bold">400</td>
                    <td className={`py-2.5 px-3 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Bad Request</td>
                    <td className={`py-2.5 px-3 font-sans ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Gói tin JSON bị lỗi cú pháp, thiếu trường bắt buộc.</td>
                    <td className="py-2.5 px-3 text-rose-600 dark:text-rose-300 font-sans font-medium">Không thử lại ngay! In log Serial kiểm tra chuỗi JSON gửi đi.</td>
                  </tr>
                  <tr className={isDarkMode ? 'hover:bg-slate-950/40' : 'hover:bg-slate-50'}>
                    <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400 font-bold">401</td>
                    <td className={`py-2.5 px-3 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Unauthorized</td>
                    <td className={`py-2.5 px-3 font-sans ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Sai mật khẩu, hoặc Token xác thực đã hết hạn.</td>
                    <td className="py-2.5 px-3 text-amber-600 dark:text-amber-300 font-sans font-medium">Tự động kích hoạt lại hàm <code className="text-cyan-600 dark:text-cyan-300 font-bold">loginToAuthServer()</code> để lấy token mới.</td>
                  </tr>
                  <tr className={isDarkMode ? 'hover:bg-slate-950/40' : 'hover:bg-slate-50'}>
                    <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400 font-bold">404</td>
                    <td className={`py-2.5 px-3 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Not Found</td>
                    <td className={`py-2.5 px-3 font-sans ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Sai URL endpoint hoặc Device ID chưa được đăng ký trong CSDL.</td>
                    <td className={`py-2.5 px-3 font-sans ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Kích hoạt chế độ Captive Portal (Phát WiFi Access Point) để người dùng cài đặt lại.</td>
                  </tr>
                  <tr className={isDarkMode ? 'hover:bg-slate-950/40' : 'hover:bg-slate-50'}>
                    <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400 font-bold">500 / 503</td>
                    <td className={`py-2.5 px-3 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Server Error</td>
                    <td className={`py-2.5 px-3 font-sans ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Máy chủ quá tải, mất kết nối cơ sở dữ liệu.</td>
                    <td className="py-2.5 px-3 text-cyan-600 dark:text-cyan-300 font-sans font-medium">Áp dụng thuật toán <strong>Exponential Backoff</strong> (chờ 2s, 4s, 8s, 16s... trước khi retry).</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Backoff diagram */}
            <div
              className={`p-4 rounded-xl border ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <h4 className={`text-xs font-bold mb-2 flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <Clock className="w-4 h-4 text-cyan-500" />
                <span>Thuật toán Exponential Backoff chống sập mạng IoT (Thundering Herd Problem)</span>
              </h4>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Khi một trạm biến áp bị cúp điện và có điện trở lại, hàng chục nghìn bóng đèn hoặc đồng hồ thông minh cùng kết nối và gửi request POST login tới máy chủ cùng một giây. Nếu không có thuật toán Backoff kèm độ lệch ngẫu nhiên (Jitter), máy chủ sẽ bị nghẽn mạng ngay lập tức. Công thức chuẩn trong firmware IoT:
              </p>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 mt-2 font-mono text-xs text-cyan-300">
                wait_time = min(max_delay, base_delay * (2 ^ retry_count)) + random_jitter(0, 1000) ms;
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CODE MẪU THỰC CHIẾN */}
        {activeTab === 'code_examples' && (
          <div className="space-y-4">
            {/* Sub-selector */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div
                className={`flex flex-wrap items-center gap-1.5 p-1 rounded-xl border text-xs font-medium ${
                  isDarkMode
                    ? 'bg-slate-950 border-slate-800'
                    : 'bg-slate-100 border-slate-200'
                }`}
              >
                <button
                  id="btn-code-esp32-httpclient"
                  onClick={() => setSelectedCodeTab('esp32_httpclient')}
                  className={`px-3 py-1 rounded-lg transition ${
                    selectedCodeTab === 'esp32_httpclient'
                      ? 'bg-cyan-600 text-white font-semibold'
                      : isDarkMode
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ESP32 Arduino (HTTPClient)
                </button>
                <button
                  id="btn-code-esp32-raw-socket"
                  onClick={() => setSelectedCodeTab('esp32_raw_socket')}
                  className={`px-3 py-1 rounded-lg transition ${
                    selectedCodeTab === 'esp32_raw_socket'
                      ? 'bg-cyan-600 text-white font-semibold'
                      : isDarkMode
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ESP32 Socket Thô (WiFiClient \r\n)
                </button>
                <button
                  id="btn-code-micropython"
                  onClick={() => setSelectedCodeTab('micropython')}
                  className={`px-3 py-1 rounded-lg transition ${
                    selectedCodeTab === 'micropython'
                      ? 'bg-cyan-600 text-white font-semibold'
                      : isDarkMode
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  MicroPython (urequests)
                </button>
                <button
                  id="btn-code-curl"
                  onClick={() => setSelectedCodeTab('curl')}
                  className={`px-3 py-1 rounded-lg transition ${
                    selectedCodeTab === 'curl'
                      ? 'bg-cyan-600 text-white font-semibold'
                      : isDarkMode
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lệnh cURL (Test Terminal)
                </button>
              </div>

              <button
                id="btn-copy-code-block"
                onClick={() => handleCopyCode(CODE_EXAMPLES[selectedCodeTab])}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
                }`}
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Đã Sao Chép!' : 'Sao Chép Mã'}</span>
              </button>
            </div>

            {/* Code Block Display */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto shadow-inner">
              <pre className="text-xs font-mono text-cyan-200 leading-relaxed whitespace-pre">
                {CODE_EXAMPLES[selectedCodeTab]}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 5: SO SÁNH HTTP VS MQTT */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr
                    className={`border-b text-[11px] ${
                      isDarkMode
                        ? 'border-slate-800 bg-slate-950 text-slate-400'
                        : 'border-slate-200 bg-slate-100 text-slate-700'
                    }`}
                  >
                    <th className="py-3 px-3">Tiêu Chí</th>
                    <th className="py-3 px-3 text-cyan-600 dark:text-cyan-400 font-bold">HTTP / REST (Giao thức trong Lab)</th>
                    <th className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-bold">MQTT (Message Queuing Telemetry)</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                  <tr className={isDarkMode ? 'hover:bg-slate-950/40' : 'hover:bg-slate-50'}>
                    <td className={`py-3 px-3 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Mô hình kiến trúc</td>
                    <td className={`py-3 px-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Request - Response (Client chủ động kéo/đẩy)</td>
                    <td className={`py-3 px-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Publish - Subscribe (Bất đồng bộ qua Broker)</td>
                  </tr>
                  <tr className={isDarkMode ? 'hover:bg-slate-950/40' : 'hover:bg-slate-50'}>
                    <td className={`py-3 px-3 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Kích thước Header (Overhead)</td>
                    <td className="py-3 px-3 text-amber-600 dark:text-amber-400 font-mono font-bold">Lớn (100 - 800 bytes mỗi gói tin)</td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-mono font-bold">Rất nhỏ (chỉ từ 2 bytes)</td>
                  </tr>
                  <tr className={isDarkMode ? 'hover:bg-slate-950/40' : 'hover:bg-slate-50'}>
                    <td className={`py-3 px-3 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Tiêu thụ Pin &amp; Năng lượng</td>
                    <td className={`py-3 px-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Trung bình - Cao (mỗi lần gọi phải bắt tay TCP/TLS)</td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-300 font-medium">Rất thấp (duy trì 1 socket kết nối nhẹ)</td>
                  </tr>
                  <tr className={isDarkMode ? 'hover:bg-slate-950/40' : 'hover:bg-slate-50'}>
                    <td className={`py-3 px-3 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Gửi lệnh tức thì từ Cloud xuống Device</td>
                    <td className="py-3 px-3 text-rose-600 dark:text-rose-300">Khó khăn (thiết bị phải liên tục polling hoặc dùng WebSocket)</td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-300 font-medium">Tức thì (Broker chủ động đẩy tin nhắn xuống ngay lập tức)</td>
                  </tr>
                  <tr className={isDarkMode ? 'hover:bg-slate-950/40' : 'hover:bg-slate-50'}>
                    <td className={`py-3 px-3 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Độ tin cậy (QoS)</td>
                    <td className={`py-3 px-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Dựa vào mã phản hồi HTTP Status Code (200, 500)</td>
                    <td className={`py-3 px-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Có 3 mức QoS (0: Nhiều nhất 1 lần, 1: Ít nhất 1 lần, 2: Đúng 1 lần)</td>
                  </tr>
                  <tr className={isDarkMode ? 'hover:bg-slate-950/40' : 'hover:bg-slate-50'}>
                    <td className={`py-3 px-3 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Ứng dụng phù hợp nhất trong IoT</td>
                    <td className="py-3 px-3 text-cyan-600 dark:text-cyan-300 font-medium">
                      • Nâng cấp Firmware qua mạng (OTA Update)<br/>
                      • Cổng cấu hình Captive Portal WiFi<br/>
                      • Đăng nhập &amp; Xác thực ban đầu (như bài lab này)
                    </td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-300 font-medium">
                      • Gửi dữ liệu cảm biến liên tục mỗi giây<br/>
                      • Điều khiển bật/tắt relay, đèn, quạt tức thời<br/>
                      • Thiết bị chạy pin ngoài trời nhiều năm
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-800 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>Lời khuyên kiến trúc IoT:</strong> Trong các hệ thống IoT công nghiệp hiện đại, kỹ sư thường kết hợp cả hai: Sử dụng <strong>HTTP</strong> cho chu trình xác thực đầu tiên (Login), nhận token và cấu hình ban đầu; sau đó sử dụng Token đó để mở kết nối an toàn <strong>MQTT/MQTTS</strong> để truyền nhận dữ liệu thời gian thực!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
