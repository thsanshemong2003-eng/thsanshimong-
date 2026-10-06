import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  X,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  UserX,
  FileCheck,
  Check,
  Ban,
  Activity,
  Users,
  ShoppingBag,
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const {
    listings,
    deleteListing,
    reports,
    dismissReport,
    verificationRequests,
    approveVerification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'reports' | 'verification' | 'listings' | 'stats'>('reports');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white text-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold font-display text-base">
                Veylora Admin & Trust Moderation
              </h2>
              <p className="text-[11px] text-slate-400">
                Global platform oversight, complaints, fraud protection & verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="px-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3.5 px-3 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'reports' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Reports & Flagged ({reports.length})
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`py-3.5 px-3 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'verification' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500'
            }`}
          >
            <FileCheck className="w-4 h-4 text-emerald-500" />
            Verification Queue ({verificationRequests.filter((r) => r.status === 'pending').length})
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`py-3.5 px-3 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'listings' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-indigo-500" />
            All Active Listings ({listings.length})
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`py-3.5 px-3 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'stats' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500'
            }`}
          >
            <Activity className="w-4 h-4 text-blue-500" />
            Platform Stats
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'reports' && (
            <div className="space-y-3">
              {reports.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No pending abuse or fraud reports. All good!
                </div>
              ) : (
                reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                          {rep.reason}
                        </span>
                        <span className="text-xs text-slate-500">• Reported by {rep.reporterName}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800">{rep.notes}</p>
                      <span className="text-[10px] text-slate-400">Listing ID: {rep.listingId}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => dismissReport(rep.id)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
                      >
                        Dismiss / Safe
                      </button>
                      {rep.listingId && (
                        <button
                          onClick={() => {
                            deleteListing(rep.listingId!);
                            dismissReport(rep.id);
                            alert('Listing removed for violation.');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                        >
                          Remove Listing
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="space-y-3">
              {verificationRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{req.userName}</h4>
                      <p className="text-xs text-slate-600 font-medium">
                        {req.type}: <span className="font-mono text-indigo-600">{req.documentName}</span>
                      </p>
                      <span className="text-[10px] text-slate-400">Submitted {req.submittedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {req.status === 'approved' ? (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
                        Approved ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          approveVerification(req.id);
                          alert(`Verification approved for ${req.userName}!`);
                        }}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve Badge
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="divide-y divide-slate-100">
              {listings.map((l) => (
                <div key={l.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={l.images[0]}
                      alt={l.title}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-800 block truncate">
                        {l.title}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {l.city} • Seller: {l.sellerName}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Remove listing "${l.title}"?`)) {
                        deleteListing(l.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Users</span>
                <span className="text-2xl font-black font-display text-slate-900 block mt-1">12,480</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Active Sellers</span>
                <span className="text-2xl font-black font-display text-slate-900 block mt-1">1,940</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Live Listings</span>
                <span className="text-2xl font-black font-display text-slate-900 block mt-1">{listings.length}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Fraud Safety Rate</span>
                <span className="text-2xl font-black font-display text-emerald-600 block mt-1">99.8%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
