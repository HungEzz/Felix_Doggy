import React, { useCallback } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

// ─── Types ─────────────────────────────────────────────────────────────────────
export type Period = 'today' | 'week' | 'month' | 'year' | 'custom';

export interface DateFilter {
  period: Period;
  startDate: string;
  endDate: string;
}

// ─── Colors ────────────────────────────────────────────────────────────────────
export const CHART_COLORS = {
  accent: '#ff6b35', // Warm burnt orange
  purple: '#8b5cf6',
  amber: '#f59e0b',
  rose: '#ba1a1a',   // Dark red warning
  blue: '#576415',   // Olive green
  teal: '#daeb8d',   // Light yellow green
};

export const PIE_COLORS = ['#ff6b35', '#576415', '#daeb8d', '#343027', '#efe7da'];

// ─── Date Filter Component ─────────────────────────────────────────────────────
interface TimeFilterProps {
  value: DateFilter;
  onChange: (filter: DateFilter) => void;
}

const PERIODS: { label: string; value: Period }[] = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Year', value: 'year' },
  { label: 'Custom', value: 'custom' },
];

export const TimeFilter: React.FC<TimeFilterProps> = ({ value, onChange }) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="material-symbols-outlined text-[#594139] text-lg font-bold">calendar_month</span>
      {PERIODS.map((p) => {
        const isActive = value.period === p.value;
        return (
          <button
            key={p.value}
            onClick={() => onChange({ ...value, period: p.value })}
            className={`font-mono text-xs px-4 py-1.5 rounded-full border-2 border-[#1e1b14] transition-all cursor-pointer ${
              isActive 
                ? 'bg-[#576415] text-white shadow-[2px_2px_0px_0px_#1e1b14]' 
                : 'bg-[#f5ede0] hover:bg-[#efe7da] text-[#1e1b14]'
            }`}
          >
            {p.label}
          </button>
        );
      })}

      {value.period === 'custom' && (
        <div className="flex items-center gap-2 ml-2">
          <input
            type="date"
            max={today}
            value={value.startDate}
            onChange={(e) => onChange({ ...value, startDate: e.target.value })}
            className="bg-white border-2 border-[#1e1b14] px-2 py-1 font-mono text-xs text-[#1e1b14] rounded-lg focus:outline-none focus:border-[#ab3500]"
          />
          <span className="font-mono text-xs text-[#594139] font-bold">to</span>
          <input
            type="date"
            max={today}
            value={value.endDate}
            onChange={(e) => onChange({ ...value, endDate: e.target.value })}
            className="bg-white border-2 border-[#1e1b14] px-2 py-1 font-mono text-xs text-[#1e1b14] rounded-lg focus:outline-none focus:border-[#ab3500]"
          />
        </div>
      )}
    </div>
  );
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: string;
  trend?: { value: number; label: string };
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color = '#ff6b35', trend }) => {
  // Deterministic tilt based on title
  const rot = title.charCodeAt(0) % 2 === 0 ? -1.5 : 1.5;
  
  return (
    <div 
      className="bg-[#f5ede0] border-4 border-[#1e1b14] blob-card-border p-6 shadow-[5px_5px_0px_0px_rgba(87,100,21,1)] jiggle transition-all group relative overflow-hidden flex flex-col justify-between min-h-[140px]"
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#efe7da] rounded-full opacity-35 blob-border pointer-events-none group-hover:scale-125 transition-transform duration-300"></div>
      
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div>
          <p className="font-mono text-[9px] text-[#594139] font-black uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="font-sans text-2xl font-black text-[#1e1b14]">
            {value}
          </h3>
        </div>
        
        <div 
          className="w-10 h-10 border-2 border-[#1e1b14] rounded-full flex items-center justify-center shrink-0 shadow-sm blob-border text-white"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between">
        {subtitle ? (
          <p className="font-mono text-[9px] text-[#594139] font-bold uppercase">{subtitle}</p>
        ) : (
          <div />
        )}
        
        {trend && (
          <div className="flex items-center gap-1">
            <span 
              className="font-mono text-[9px] font-black uppercase px-2 py-0.5 border border-[#1e1b14] rounded-full"
              style={{
                backgroundColor: trend.value >= 0 ? '#daeb8d' : '#ffdad6',
                color: trend.value >= 0 ? '#181e00' : '#93000a',
              }}
            >
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="font-mono text-[8px] text-[#594139] font-bold">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Page Header ───────────────────────────────────────────────────────────────
interface StatsPageHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  filter: DateFilter;
  onFilterChange: (f: DateFilter) => void;
  onExport: () => void;
  exporting?: boolean;
}

export const StatsPageHeader: React.FC<StatsPageHeaderProps> = ({
  title, subtitle, icon, color, filter, onFilterChange, onExport, exporting,
}) => (
  <div className="space-y-6">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pl-4 border-l-8" style={{ borderColor: color }}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#1e1b14] flex items-center justify-center shrink-0 shadow-sm blob-border text-white" style={{ backgroundColor: color }}>
          {icon}
        </div>
        <div>
          <h2 className="font-sans text-3xl font-black text-[#1e1b14] uppercase tracking-tight mb-0.5">
            {title}
          </h2>
          <p className="font-sans text-sm text-[#594139] font-bold">{subtitle}</p>
        </div>
      </div>
      
      <button 
        onClick={onExport}
        disabled={exporting}
        className="wobbly-border bg-[#ab3500] hover:bg-[#ff6b35] text-white py-3 px-6 font-mono text-xs font-bold hard-shadow-dark jiggle flex items-center gap-2 group cursor-pointer"
      >
        {exporting ? (
          <span className="material-symbols-outlined text-xs font-bold animate-spin">sync</span>
        ) : (
          <span className="material-symbols-outlined text-xs font-bold group-hover:animate-bounce">download</span>
        )}
        {exporting ? 'Exporting...' : 'Export Excel Data'}
      </button>
    </div>

    <div className="bg-[#efe7da] border-4 border-[#1e1b14] p-4 shadow-[4px_4px_0px_0px_#1e1b14] rounded-[12px] mt-6">
      <TimeFilter value={filter} onChange={onFilterChange} />
    </div>
  </div>
);

// ─── Loading Skeleton ───────────────────────────────────────────────────────────
export const StatsSkeleton: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <div className="stats-grid-container cols-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="bg-[#efe7da] border-4 border-[#1e1b14] rounded-xl h-28 animate-pulse shadow-sm" />
      ))}
    </div>
    <div className="bg-[#efe7da] border-4 border-[#1e1b14] rounded-xl h-80 animate-pulse shadow-sm" />
  </div>
);

// ─── Empty State ───────────────────────────────────────────────────────────────
export const EmptyState: React.FC<{ message?: string }> = ({ message = 'No data available for this time period.' }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-[#fff8f0] border-2 border-[#1e1b14] rounded-xl hard-shadow-sm">
    <span className="material-symbols-outlined text-5xl text-[#594139]/40 mb-3">bar_chart</span>
    <p className="font-sans text-sm font-black text-[#1e1b14] uppercase tracking-wide mb-1">No data yet</p>
    <p className="font-mono text-xs text-[#594139] font-bold">{message}</p>
  </div>
);

// ─── useStatsData hook ──────────────────────────────────────────────────────────
export const useStatsData = <T,>(endpoint: string, filter: DateFilter) => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ period: filter.period });
      if (filter.period === 'custom') {
        if (filter.startDate) params.set('startDate', filter.startDate);
        if (filter.endDate) params.set('endDate', filter.endDate);
      }
      const result = await api.get(`/admin/statistics/${endpoint}?${params}`);
      setData(result as T);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load data');
      toast.error('Unable to load statistics data');
    } finally {
      setLoading(false);
    }
  }, [endpoint, filter]);

  React.useEffect(() => { fetch(); }, [fetch]);
  return { data, loading, error, refetch: fetch };
};

// ─── Excel Export ───────────────────────────────────────────────────────────────
type ExportRow = Record<string, string | number | null | undefined>;

export const exportToExcel = async (
  endpoint: string,
  params: Record<string, string>,
  filename: string,
  columns: { key: string; label: string; format?: (v: any) => string }[],
  transformRows: (data: any) => ExportRow[],
) => {
  try {
    const query = new URLSearchParams(params).toString();
    const data = await api.get(`/admin/statistics/${endpoint}?${query}`);
    const rows = transformRows(data);

    if (!rows.length) {
      toast.error('No data to export');
      return;
    }

    // Build CSV
    const header = columns.map((c) => `"${c.label}"`).join(',');
    const body = rows
      .map((row) =>
        columns
          .map((c) => {
            const val = c.format ? c.format(row[c.key]) : row[c.key];
            return `"${String(val ?? '').replace(/"/g, '""')}"`;
          })
          .join(','),
      )
      .join('\n');

    const csv = '\uFEFF' + header + '\n' + body;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File exported successfully!');
  } catch {
    toast.error('Error exporting file');
  }
};

// ─── Chart wrapper card ─────────────────────────────────────────────────────────
export const ChartCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; minHeight?: number }> = ({
  title, subtitle, children, minHeight = 300,
}) => (
  <div className="bg-white border-4 border-[#1e1b14] p-6 shadow-[6px_6px_0px_0px_#1e1b14] rounded-[16px] relative overflow-hidden">
    <div className="mb-6 relative z-10">
      <h3 className="font-sans text-sm font-black text-[#1e1b14] uppercase tracking-wider mb-1">{title}</h3>
      {subtitle && <p className="font-mono text-[10px] text-[#594139] font-bold uppercase">{subtitle}</p>}
    </div>
    <div className="relative z-10" style={{ minHeight }}>{children}</div>
  </div>
);

// ─── Status Badge ───────────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:    { label: 'Out there', color: '#5f1900', bg: '#ffdbd0' },
  PROCESSING: { label: 'On road', color: '#181e00', bg: '#daeb8d' },
  SHIPPED:    { label: 'On road', color: '#181e00', bg: '#daeb8d' },
  COMPLETED:  { label: 'Delivered', color: '#181e00', bg: '#daeb8d' },
  CANCELLED:  { label: 'Boxed up', color: '#93000a', bg: '#ffdad6' },
};

export const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cfg = STATUS_MAP[status.toUpperCase()] || { label: status, color: '#1e1b14', bg: '#e9e2d5' };
  return (
    <span className="inline-block border-2 border-[#1e1b14] font-mono text-[9px] font-black uppercase px-2.5 py-1 rounded-full" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
      {cfg.label}
    </span>
  );
};

export const fmtCurrency = (v: number) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US');

// Add shimmer keyframe and responsive media query styles via style tag (called once)
if (typeof document !== 'undefined') {
  const id = 'stats-shimmer-style';
  if (!document.getElementById(id)) {
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      
      /* Global stats pages style overrides */
      .space-y-12,
      main {
        background-color: #fff8f0 !important;
      }
      
      /* Target the table wrappers */
      div:has(> table) {
        border: 4px solid #1e1b14 !important;
        border-radius: 16px !important;
        background-color: #ffffff !important;
        box-shadow: 6px 6px 0px 0px #1e1b14 !important;
        overflow: hidden !important;
        margin-top: 1.5rem !important;
        margin-bottom: 1.5rem !important;
        padding: 8px !important;
      }
      
      /* Table header */
      table thead tr {
        border-bottom: 4px solid #1e1b14 !important;
        background-color: #efe7da !important;
      }
      
      table th {
        font-family: 'Space Mono', monospace !important;
        font-size: 10px !important;
        font-weight: 900 !important;
        text-transform: uppercase !important;
        color: #594139 !important;
        letter-spacing: 0.05em !important;
        padding: 14px 16px !important;
        border-bottom: 4px solid #1e1b14 !important;
      }
      
      /* Table cells */
      table td {
        padding: 14px 16px !important;
        font-family: 'Work Sans', sans-serif !important;
        font-size: 13px !important;
        color: #1e1b14 !important;
        border-bottom: 2px dashed #e1bfb5 !important;
      }
      
      table tbody tr:hover {
        background-color: #fbf3e6 !important;
      }
      
      table tbody tr:last-child td {
        border-bottom: none !important;
      }
      
      /* Custom title overrides inside files */
      h3[style*="fontFamily"] {
        font-family: 'Bricolage Grotesque', sans-serif !important;
        font-weight: 900 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.02em !important;
        color: #1e1b14 !important;
      }
      
      /* InventoryStats custom header styling */
      .stats-header-inner {
        padding-left: 1rem !important;
        border-left: 8px solid #576415 !important;
      }
      .stats-header-inner h1 {
        font-family: 'Bricolage Grotesque', sans-serif !important;
        font-weight: 900 !important;
        text-transform: uppercase !important;
        color: #1e1b14 !important;
      }
      .stats-header-inner button {
        border: 3px solid #1e1b14 !important;
        border-radius: 255px 15px 225px 15px/15px 225px 15px 255px !important;
        background-color: #ab3500 !important;
        color: #ffffff !important;
        font-family: 'Space Mono', monospace !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        padding: 10px 20px !important;
        box-shadow: 4px 4px 0px 0px #1e1b14 !important;
        transition: all 0.2s !important;
        cursor: pointer !important;
      }
      .stats-header-inner button:hover {
        background-color: #ff6b35 !important;
        box-shadow: 6px 6px 0px 0px #1e1b14 !important;
        transform: translate(-2px, -2px) rotate(1deg) !important;
      }
      
      /* Recharts Tooltip popup customization */
      .recharts-default-tooltip {
        border: 3px solid #1e1b14 !important;
        border-radius: 12px !important;
        background-color: #fff8f0 !important;
        box-shadow: 4px 4px 0px 0px #1e1b14 !important;
        font-family: 'Space Mono', monospace !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        color: #1e1b14 !important;
      }
      
      /* Responsive Header & Grid overrides */
      @media (max-width: 768px) {
        .stats-header-inner {
          flex-direction: column !important;
          align-items: stretch !important;
          gap: 12px !important;
        }
        .stats-header-inner button {
          align-self: flex-start !important;
        }
      }
      
      .stats-grid-container {
        display: grid !important;
        gap: 14px !important;
      }
      
      @media (min-width: 1025px) {
        .stats-grid-container.cols-5 { grid-template-columns: repeat(5, 1fr) !important; }
        .stats-grid-container.cols-4 { grid-template-columns: repeat(4, 1fr) !important; }
        .stats-grid-container.cols-3 { grid-template-columns: repeat(3, 1fr) !important; }
      }
      
      @media (max-width: 1024px) and (min-width: 641px) {
        .stats-grid-container.cols-5 { grid-template-columns: repeat(3, 1fr) !important; }
        .stats-grid-container.cols-4 { grid-template-columns: repeat(2, 1fr) !important; }
        .stats-grid-container.cols-3 { grid-template-columns: repeat(2, 1fr) !important; }
      }
      
      @media (max-width: 640px) {
        .stats-grid-container.cols-5,
        .stats-grid-container.cols-4,
        .stats-grid-container.cols-3 {
          grid-template-columns: 1fr !important;
        }
      }
      
      .stats-charts-row {
        display: grid !important;
        gap: 16px !important;
      }
      
      @media (min-width: 901px) {
        .stats-charts-row { grid-template-columns: 2fr 1fr !important; }
      }
      
      @media (max-width: 900px) {
        .stats-charts-row { grid-template-columns: 1fr !important; }
      }
    `;
    document.head.appendChild(style);
  }
}
export default TimeFilter;