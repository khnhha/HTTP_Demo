import React from 'react';
import { Cpu, RefreshCw, Network, ShieldCheck, Zap, Sun, Moon } from 'lucide-react';
import { ClientType } from '../types';

interface NavbarProps {
  clientType: ClientType;
  onClientTypeChange: (type: ClientType) => void;
  onReset: () => void;
  isAuthenticated: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  clientType,
  onClientTypeChange,
  onReset,
  isAuthenticated,
  isDarkMode,
  onToggleTheme
}) => {
  return (
    <header
      className={`border-b sticky top-0 z-50 transition-colors duration-200 ${
        isDarkMode
          ? 'bg-slate-900 border-slate-800 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight">IoT HTTP Lab</span>
              <span
                className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                  isDarkMode
                    ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                    : 'bg-cyan-50 text-cyan-700 border-cyan-300'
                }`}
              >
                Giao Thức & Xác Thực
              </span>
            </div>
            <p className={`text-xs hidden sm:block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Mô phỏng trực quan luồng gói tin HTTP Request/Response trong lập trình IoT
            </p>
          </div>
        </div>

        {/* Client Perspective Selector & Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Perspective selector */}
          <div
            className={`flex items-center p-1 rounded-lg border text-xs ${
              isDarkMode
                ? 'bg-slate-800/80 border-slate-700'
                : 'bg-slate-100 border-slate-200'
            }`}
          >
            <span className={`px-2 hidden md:inline font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Client:
            </span>
            <button
              id="btn-client-esp32"
              onClick={() => onClientTypeChange('esp32_device')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                clientType === 'esp32_device'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : isDarkMode
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              ESP32 Node
            </button>
            <button
              id="btn-client-portal"
              onClick={() => onClientTypeChange('web_config_portal')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                clientType === 'web_config_portal'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : isDarkMode
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Web Config
            </button>
          </div>

          {/* Status Indicator */}
          <div
            className={`hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg border ${
              isDarkMode
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-slate-100/80 border-slate-200'
            }`}
          >
            {isAuthenticated ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className={`text-xs font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  Đã Xác Thực
                </span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-500" />
                <span className={`text-xs font-medium ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                  Chưa Đăng Nhập
                </span>
              </>
            )}
          </div>

          {/* Light / Dark Mode Toggle Button */}
          <button
            id="btn-toggle-theme"
            onClick={onToggleTheme}
            aria-label={isDarkMode ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 shadow-sm'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200 shadow-xs'
            }`}
            title={isDarkMode ? 'Đổi sang chế độ Sáng (Light mode)' : 'Đổi sang chế độ Tối (Dark mode)'}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Chế Độ Sáng</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Chế Độ Tối</span>
              </>
            )}
          </button>

          {/* Reset Button */}
          <button
            id="btn-navbar-reset"
            onClick={onReset}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="Làm mới mô phỏng"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Đặt Lại</span>
          </button>
        </div>
      </div>
    </header>
  );
};
