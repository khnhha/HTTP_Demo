import React, { useState } from 'react';
import { 
  Activity, 
  Send, 
  Thermometer, 
  Droplets, 
  BatteryMedium, 
  ShieldCheck, 
  AlertTriangle,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

interface TelemetrySimulatorProps {
  authToken: string | null;
  onReauthenticate: () => void;
  isDarkMode: boolean;
}

export const TelemetrySimulator: React.FC<TelemetrySimulatorProps> = ({
  authToken,
  onReauthenticate,
  isDarkMode
}) => {
  const [temp, setTemp] = useState<number>(28.5);
  const [humidity, setHumidity] = useState<number>(64);
  const [voltage, setVoltage] = useState<number>(3.3);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [responseLog, setResponseLog] = useState<{
    time: string;
    status: number;
    message: string;
    success: boolean;
  } | null>(null);
  const [simulateTokenExpired, setSimulateTokenExpired] = useState<boolean>(false);

  const handleSendTelemetry = () => {
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      const now = new Date().toLocaleTimeString();

      if (!authToken) {
        setResponseLog({
          time: now,
          status: 401,
          message: 'LỖI: 401 Unauthorized - Thiết bị chưa đăng nhập, thiếu Bearer Token!',
          success: false
        });
      } else if (simulateTokenExpired) {
        setResponseLog({
          time: now,
          status: 401,
          message: 'LỖI: 401 Token Expired - Token đã hết hạn, thiết bị cần thực hiện chu trình Login lại!',
          success: false
        });
      } else {
        setResponseLog({
          time: now,
          status: 201,
          message: `THÀNH CÔNG: 201 Created - Máy chủ IoT đã ghi nhận dữ liệu cảm biến (Nhiệt: ${temp}°C, Độ ẩm: ${humidity}%) vào cơ sở dữ liệu TimeSeries.`,
          success: true
        });
      }
    }, 600);
  };

  return (
    <div
      className={`rounded-2xl p-4 lg:p-6 shadow-xl border transition-colors duration-200 ${
        isDarkMode
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      <div
        className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b mb-4 ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-emerald-500" />
          <div>
            <h3 className={`text-sm font-bold tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Thực Nghiệm Gửi Cảm Biến Kèm Bearer Token (Telemetry Request)
            </h3>
            <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Minh họa cách thiết bị IoT dùng Token vừa nhận được từ bước đăng nhập để gửi dữ liệu định kỳ
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <label
            className={`flex items-center space-x-1.5 text-xs px-2.5 py-1.5 rounded-lg border cursor-pointer ${
              isDarkMode
                ? 'text-slate-300 bg-slate-800 border-slate-700'
                : 'text-slate-700 bg-slate-100 border-slate-200'
            }`}
          >
            <input
              id="checkbox-simulate-expired"
              type="checkbox"
              checked={simulateTokenExpired}
              onChange={(e) => setSimulateTokenExpired(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500"
            />
            <span className="text-[11px] font-medium">Giả lập Token Hết Hạn (Test 401)</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Controls Column */}
        <div
          className={`rounded-xl p-4 space-y-4 border ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="text-xs font-semibold flex items-center justify-between">
            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
              Dữ liệu đo đạc (Sensor Readings)
            </span>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono font-bold">
              ESP32 GPIO / ADC
            </span>
          </div>

          {/* Temperature Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className={`flex items-center space-x-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                <span>Nhiệt Độ:</span>
              </span>
              <span className={`font-mono font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {temp} °C
              </span>
            </div>
            <input
              id="slider-telemetry-temp"
              type="range"
              min="10"
              max="50"
              step="0.5"
              value={temp}
              onChange={(e) => setTemp(parseFloat(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Humidity Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className={`flex items-center space-x-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                <span>Độ Ẩm:</span>
              </span>
              <span className={`font-mono font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {humidity} %
              </span>
            </div>
            <input
              id="slider-telemetry-humidity"
              type="range"
              min="20"
              max="99"
              value={humidity}
              onChange={(e) => setHumidity(parseInt(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Voltage */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className={`flex items-center space-x-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <BatteryMedium className="w-3.5 h-3.5 text-emerald-500" />
                <span>Điện Áp Pin:</span>
              </span>
              <span className={`font-mono font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {voltage} V
              </span>
            </div>
            <input
              id="slider-telemetry-voltage"
              type="range"
              min="2.8"
              max="4.2"
              step="0.1"
              value={voltage}
              onChange={(e) => setVoltage(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <button
            id="btn-send-telemetry"
            onClick={handleSendTelemetry}
            disabled={isSending}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-700/25 transition disabled:opacity-50 cursor-pointer"
          >
            <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
            <span>{isSending ? 'Đang Gửi Socket...' : 'Gửi Gói Tin Telemetry POST'}</span>
          </button>
        </div>

        {/* HTTP Headers & Bearer Token Inspector */}
        <div
          className={`rounded-xl p-4 flex flex-col font-mono text-xs border ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="text-xs font-semibold mb-2 font-sans flex items-center justify-between">
            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
              Khung Gói Tin HTTP Gửi Kèm Token
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              POST /api/v1/telemetry
            </span>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1 text-[11px] flex-1 overflow-x-auto text-slate-200">
            <div className="text-cyan-300 font-bold">POST /api/v1/telemetry HTTP/1.1</div>
            <div className="text-slate-400">Host: iot-cloud.smartgateway.vn</div>
            <div className="text-slate-400">Content-Type: application/json</div>
            
            {/* The Bearer Token Header */}
            <div className="py-1 px-1.5 rounded bg-emerald-950/40 border border-emerald-800/60 my-1">
              <span className="text-emerald-400 font-bold">Authorization: </span>
              <span className="text-emerald-200">
                {authToken && !simulateTokenExpired
                  ? `Bearer ${authToken.slice(0, 20)}...`
                  : simulateTokenExpired
                  ? 'Bearer [TOKEN_EXPIRED_OR_INVALID]'
                  : '[CHƯA CÓ TOKEN - CHƯA ĐĂNG NHẬP]'}
              </span>
            </div>

            <div className="text-slate-500">{"\r\n"}</div>
            <div className="text-amber-300">
              {JSON.stringify({
                temperature: temp,
                humidity: humidity,
                voltage: voltage,
                device_id: 'ESP32-NODE-01'
              }, null, 2)}
            </div>
          </div>
        </div>

        {/* Server Response & Recovery Logic */}
        <div
          className={`rounded-xl p-4 flex flex-col justify-between border ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div>
            <div className="text-xs font-semibold mb-2 flex items-center justify-between">
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                Phản Hồi Máy Chủ & Xử Lý Firmware
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Response Handler</span>
            </div>

            {responseLog ? (
              <div
                className={`p-3 rounded-xl border text-xs leading-relaxed ${
                  responseLog.success
                    ? isDarkMode
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : isDarkMode
                    ? 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold mb-1 font-mono text-[11px]">
                  {responseLog.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                  )}
                  <span>Status: {responseLog.status} ({responseLog.time})</span>
                </div>
                <p className="text-[11px] mt-1">{responseLog.message}</p>

                {!responseLog.success && (
                  <div
                    className={`mt-3 pt-2 border-t ${
                      isDarkMode ? 'border-rose-900/60' : 'border-rose-200'
                    }`}
                  >
                    <p className={`text-[11px] font-medium mb-1.5 ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                      Phản ứng chuẩn của Firmware IoT khi gặp 401:
                    </p>
                    <button
                      id="btn-reauthenticate-trigger"
                      onClick={onReauthenticate}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] transition shadow-xs cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Kích hoạt tự động Đăng nhập lại (Re-login)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`p-4 rounded-xl border text-xs text-center ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-400'
                    : 'bg-white border-slate-200 text-slate-500 shadow-xs'
                }`}
              >
                Bấm "Gửi Gói Tin Telemetry POST" để xem kết quả kiểm tra xác thực máy chủ.
              </div>
            )}
          </div>

          <div
            className={`mt-3 p-2.5 rounded-lg border text-[11px] ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800/80 text-slate-400'
                : 'bg-white border-slate-200 text-slate-600 shadow-xs'
            }`}
          >
            <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>Quy tắc vàng:</strong> Sau khi có JWT token từ lần login đầu tiên, thiết bị chỉ cần gửi kèm Header <code className="text-cyan-600 dark:text-cyan-300 font-bold">Authorization: Bearer</code>, không cần truyền lại username &amp; password ở mỗi chu kỳ đo.
          </div>
        </div>
      </div>
    </div>
  );
};
