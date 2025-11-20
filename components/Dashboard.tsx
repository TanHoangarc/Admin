import React, { useMemo } from 'react';
import { WebNfcProfile } from '../types';
import { StatsChart } from './StatsChart';
import { Users, MousePointerClick, Activity, ExternalLink } from 'lucide-react';

interface DashboardProps {
  profiles: WebNfcProfile[];
  onNavigateToManager: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ profiles, onNavigateToManager }) => {
  const totalVisits = useMemo(() => profiles.reduce((acc, curr) => acc + curr.visits, 0), [profiles]);
  const totalInteractions = useMemo(() => profiles.reduce((acc, curr) => acc + curr.interactions, 0), [profiles]);
  const activeProfiles = useMemo(() => profiles.filter(p => p.status === 'active').length, [profiles]);

  const topPerformer = useMemo(() => {
    if (profiles.length === 0) return null;
    return profiles.reduce((prev, current) => (prev.visits > current.visits) ? prev : current);
  }, [profiles]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
          <p className="text-slate-500">Real-time analytics across all NFC endpoints.</p>
        </div>
        <button 
            onClick={onNavigateToManager}
            className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1"
        >
            Manage Profiles <ExternalLink size={14} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Visits</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalVisits.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-sky-50 rounded-lg text-sky-600">
            <MousePointerClick size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Interactions</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalInteractions.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Active Profiles</p>
            <h3 className="text-2xl font-bold text-slate-900">{activeProfiles} <span className="text-sm font-normal text-slate-400">/ {profiles.length}</span></h3>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <StatsChart data={profiles} />
        </div>
        
        {/* Top Performer Card */}
        <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between bg-gradient-to-br from-indigo-900 to-indigo-800">
             <div>
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-indigo-700 rounded text-xs font-semibold uppercase tracking-wider">Top Performer</span>
                </div>
                {topPerformer ? (
                    <>
                        <h3 className="text-3xl font-bold mb-1">{topPerformer.name}</h3>
                        <p className="text-indigo-200 text-sm break-all">{topPerformer.slug}</p>
                        
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-indigo-300 text-xs uppercase">Visits</p>
                                <p className="text-xl font-semibold">{topPerformer.visits.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-indigo-300 text-xs uppercase">Engagement</p>
                                <p className="text-xl font-semibold">{((topPerformer.interactions / topPerformer.visits) * 100).toFixed(1)}%</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-indigo-300">No data available</p>
                )}
             </div>
             <button 
                onClick={onNavigateToManager}
                className="mt-6 w-full py-2 bg-white text-indigo-900 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
                View Details
             </button>
        </div>
      </div>
    </div>
  );
};