import React, { useState } from 'react';
import { useYatra } from '../../context/YatraContext';
import { Users, UserPlus, Copy, Check, Share2, Shield, X, Bell } from 'lucide-react';

export const FamilyGroupModal = () => {
  const { activeModal, setActiveModal, familyMembers, triggerFamilyRing, addToast } = useYatra();
  const [copied, setCopied] = useState(false);
  const inviteCode = 'YATRA-8492-SAFE';

  if (activeModal !== 'family-group') return null;

  const handleCopy = () => {
    setCopied(true);
    addToast('Invite Code Copied', `Share code ${inviteCode} with family members to connect.`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/75 backdrop-blur-md">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-800 to-yatra-blue p-6 text-white relative">
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center text-white">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display">Kashi Yatra Family Circle</h3>
              <p className="text-xs text-sky-100">Private encrypted group • 4 Connected Yatris</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Invite Code Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Family Group Invite Code
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Active Code
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl p-2.5">
              <span className="font-mono text-sm font-bold text-navy-800 tracking-wider">
                {inviteCode}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yatra-blue hover:bg-yatra-bright text-white text-xs font-semibold transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Members List */}
          <div>
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3 flex items-center justify-between">
              <span>Connected Group Members</span>
              <span className="text-yatra-blue font-bold">4 of 4 Online</span>
            </h4>
            
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-yatra-blue/30 bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                      {member.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-navy-900">{member.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-yatra-blue font-medium">
                          {member.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Distance: <strong className="text-slate-700">{member.distance}</strong> • Batt: {member.battery}%
                      </p>
                    </div>
                  </div>

                  {member.id !== 'me' && (
                    <button
                      onClick={() => triggerFamilyRing(member.name)}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-yatra-blue hover:bg-yatra-light hover:border-yatra-blue transition-colors flex items-center gap-1 text-[11px] font-semibold"
                      title="Send Beacon Sound Chime"
                    >
                      <Bell className="w-3.5 h-3.5" /> Ring
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-blue-50/70 p-3 rounded-xl border border-blue-100">
            <Shield className="w-4 h-4 text-yatra-blue flex-shrink-0" />
            <span>Only members with this invite code can view real-time approximate safe-zone markers.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
