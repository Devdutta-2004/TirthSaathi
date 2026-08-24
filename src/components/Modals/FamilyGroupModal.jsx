import React, { useState } from 'react';
import { useYatra } from '../../context/YatraContext';
import { Users, UserPlus, Copy, Check, Share2, Shield, X, Bell, Radio, Zap, Battery } from 'lucide-react';

export const FamilyGroupModal = () => {
  const { activeModal, setActiveModal, familyGroup, familyMembers, triggerFamilyRing, addToast } = useYatra();
  const [copied, setCopied] = useState(false);
  const currentGroup = familyGroup || { groupCode: 'TS-FAM-7X29A', name: 'Quantum Family Circle', members: [] };
  const members = currentGroup.members?.length > 0 ? currentGroup.members : familyMembers;
  const inviteCode = currentGroup.groupCode || 'TS-FAM-7X29A';

  if (activeModal !== 'family-group') return null;

  const handleCopy = () => {
    setCopied(true);
    addToast('Quantum Circle Key Copied', `Share key ${inviteCode} with circle members.`, 'success');
    navigator.clipboard && navigator.clipboard.writeText(inviteCode);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-cyber-panel rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-cyan-500/40 relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#04132B] to-[#0A2654] p-6 text-white border-b border-cyan-500/20 relative">
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-glow">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  UWB MESH ENCRYPTED
                </span>
              </div>
              <h3 className="text-lg font-bold font-display text-white mt-0.5">
                {currentGroup.name || 'Quantum Family Circle'}
              </h3>
              <p className="text-xs font-mono text-cyan-300/70">
                {members.length} Synchronized Pilgrim Nodes
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Invite Code Box */}
          <div className="bg-black/50 border border-cyan-500/30 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Quantum Circle Access Key</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-400/40">
                ACTIVE AES-256
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 bg-black/70 border border-cyan-500/20 rounded-xl p-2.5">
              <span className="font-mono text-sm font-bold text-white tracking-widest px-2">
                {inviteCode}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 text-xs font-mono font-bold uppercase transition-all shadow-glow active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'COPIED' : 'COPY'}
              </button>
            </div>
          </div>

          {/* Members List */}
          <div>
            <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Connected Telemetry Nodes</span>
              <span className="text-emerald-400 font-bold">{members.length} of {members.length} ONLINE</span>
            </h4>
            
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 no-scrollbar">
              {members.map((member, idx) => (
                <div
                  key={member.id || idx}
                  className="flex items-center justify-between p-3 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/50 bg-black/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-cyan-400/40 flex-shrink-0 shadow-sm">
                      <img
                        src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white tracking-wide">{member.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                          {member.role || 'Node'}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>Range: <strong className="text-cyan-300">{member.distanceMeters || 120}m</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-emerald-400">
                          <Battery className="w-3 h-3" /> {member.battery || 88}%
                        </span>
                      </p>
                    </div>
                  </div>

                  {(!member.name?.includes('You') && idx !== 0) && (
                    <button
                      onClick={() => triggerFamilyRing(member.name)}
                      className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition-colors flex items-center gap-1 text-[11px] font-mono font-bold"
                      title="Send Sacred Beacon Sound"
                    >
                      <Bell className="w-3.5 h-3.5" /> PING
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-cyan-950/40 p-3 rounded-xl border border-cyan-500/20">
            <Shield className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Encrypted zero-knowledge P2P channel. GPS precision telemetry is restricted to verified nodes.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

