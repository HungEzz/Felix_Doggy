import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data: any = await api.get('/admin/users');
      setUsers(data);
    } catch (error) {
      toast.error('Error loading customer list');
    }
  };

  const handleRoleChange = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (window.confirm(`Are you sure you want to grant ${newRole} role to this user?`)) {
      try {
        await api.put(`/admin/users/${id}/role`, { role: newRole });
        toast.success('Role updated successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Error updating role');
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const q = searchQuery.toLowerCase();
    return (
      (user.fullName && user.fullName.toLowerCase().includes(q)) ||
      user.email.toLowerCase().includes(q) ||
      user.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-12 bg-[#fff8f0]" style={{ fontFamily: "'Work Sans', sans-serif" }}>
      {/* Organic Brutalism CSS Utilities */}
      <style>{`
        .blob-shape-1 {
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
        }
        .blob-shape-2 {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
        .blob-shape-3 {
          border-radius: 50% 50% 30% 70% / 40% 40% 60% 60%;
        }
        .wobbly-border {
          border: 3px solid #1e1b14;
          border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
        }
        .hard-shadow {
          box-shadow: 6px 6px 0px 0px #576415;
        }
        .hard-shadow-dark {
          box-shadow: 6px 6px 0px 0px #1e1b14;
        }
        .wavy-divider {
          background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 5 Q 10 0, 20 5 T 40 5 T 60 5 T 80 5 T 100 5 T 120 5' fill='none' stroke='%231e1b14' stroke-width='2' stroke-dasharray='10,10'/%3E%3C/svg%3E");
          background-repeat: repeat-x;
          height: 10px;
          width: 100%;
        }
      `}</style>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6 pl-4 border-l-8 border-[#576415]">
        <div>
          <h2 className="font-sans text-3xl font-black text-[#1e1b14] mb-2 uppercase tracking-tight">Fellow Weirdos</h2>
          <p className="font-sans text-sm text-[#594139] font-bold">The humans brave enough to shop here.</p>
        </div>
        <button 
          onClick={() => {
            toast.success("Weirdo Data exported to CSV! (Mock action)");
          }}
          className="wobbly-border bg-[#ab3500] hover:bg-[#ff6b35] text-white py-3 px-6 font-mono text-xs font-bold hard-shadow-dark jiggle flex items-center gap-2 group cursor-pointer"
        >
          <span className="material-symbols-outlined group-hover:animate-bounce">download</span>
          Export Weirdo Data
        </button>
      </div>

      {/* Search Filter */}
      <div className="flex justify-end mb-6">
        <div className="relative group w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#594139] group-focus-within:text-[#ab3500] transition-colors pointer-events-none">
            search
          </span>
          <input 
            className="pl-10 pr-4 py-2 bg-[#f5ede0] rounded-none border-2 border-[#1e1b14] focus:border-[#ab3500] focus:ring-0 font-mono text-xs w-full focus:outline-none text-[#1e1b14]" 
            placeholder="Search humans..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* List Container */}
      <div className="wobbly-border bg-white p-6 md:p-8 hard-shadow relative">
        {/* Table Header (Desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-4 pb-4 font-mono text-xs text-[#594139] font-black uppercase border-b-2 border-dashed border-[#1e1b14]">
          <div className="col-span-4">Weirdo Identity</div>
          <div className="col-span-2">Joined</div>
          <div className="col-span-2">Total Orders</div>
          <div className="col-span-1">Lifetime Spend</div>
          <div className="col-span-2 text-center">Vibe Check</div>
          <div className="col-span-1 text-right pr-4">Actions</div>
        </div>

        {/* List Items */}
        <div className="flex flex-col gap-6 mt-6">
          {filteredUsers.map((item, index) => {
            // Deterministic mock values based on account details
            const boxes = (item.id.charCodeAt(0) % 15) + 2;
            const spend = boxes * 28.5 + (item.id.charCodeAt(1) % 50);
            let vibeTag = 'New Anomaly';
            let vibeBg = 'bg-[#efe7da] text-[#594139]';
            let vibeShape = 'blob-shape-1';
            
            if (item.role === 'ADMIN') {
              vibeTag = 'Chief Anomaly';
              vibeBg = 'bg-[#ffdbd0] text-[#5f1900]';
              vibeShape = 'blob-shape-3';
            } else if (boxes > 12) {
              vibeTag = 'Frequent Squeaker';
              vibeBg = 'bg-[#daeb8d] text-[#181e00]';
              vibeShape = 'blob-shape-2';
            } else if (boxes > 6) {
              vibeTag = 'Kibble Connoisseur';
              vibeBg = 'bg-[#ffdbd0] text-[#5f1900]';
              vibeShape = 'blob-shape-3';
            }

            return (
              <div 
                key={item.id} 
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center group p-4 -mx-4 hover:bg-[#fbf3e6] transition-colors wobbly-border border-transparent hover:border-[#1e1b14]"
              >
                {/* Weirdo Identity */}
                <div className="col-span-12 md:col-span-4 flex items-center gap-4">
                  <div className={`w-12 h-12 ${index % 3 === 0 ? 'blob-shape-1' : index % 3 === 1 ? 'blob-shape-2' : 'blob-shape-3'} bg-[#daeb8d] flex items-center justify-center border-2 border-[#1e1b14] overflow-hidden shrink-0 shadow-sm`}>
                    <span className="material-symbols-outlined text-[#1e1b14] text-xl font-bold">person</span>
                  </div>
                  <div>
                    <h3 className="font-sans text-sm font-black text-[#1e1b14] group-hover:text-[#ab3500] transition-colors uppercase tracking-wide">
                      {item.fullName || 'Not updated'}
                    </h3>
                    <p className="font-mono text-xs text-[#594139] font-bold">{item.email}</p>
                  </div>
                </div>

                {/* Joined Date */}
                <div className="col-span-12 md:col-span-2 font-mono text-xs text-[#594139] font-bold">
                  {new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>

                {/* Total Orders */}
                <div className="col-span-12 md:col-span-2 font-sans text-sm text-[#1e1b14] font-bold">
                  {boxes} <span className="text-xs text-[#594139] font-mono">boxes</span>
                </div>

                {/* Lifetime Spend */}
                <div className="col-span-12 md:col-span-1 font-mono text-sm font-black text-[#ab3500]">
                  ${spend.toFixed(2)}
                </div>

                {/* Vibe Check */}
                <div className="col-span-12 md:col-span-2 flex justify-center mt-2 md:mt-0">
                  <span className={`inline-block px-2.5 py-1 font-mono text-[9px] font-black uppercase border border-[#1e1b14] ${vibeBg} ${vibeShape}`}>
                    {vibeTag}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-12 md:col-span-1 flex justify-end pr-2 w-full md:w-auto mt-2 md:mt-0">
                  <button 
                    onClick={() => handleRoleChange(item.id, item.role)}
                    className="w-9 h-9 border-2 border-[#1e1b14] rounded-lg bg-white hover:bg-[#ffdad6] text-[#1e1b14] hard-shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center shrink-0"
                    title={item.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                  >
                    <span className="material-symbols-outlined font-bold" style={{ fontSize: '16px' }}>
                      {item.role === 'ADMIN' ? 'shield_minus' : 'shield_person'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center">
              <span className="material-symbols-outlined text-6xl text-[#594139]/40 mb-2">sentiment_dissatisfied</span>
              <p className="font-mono text-sm text-[#594139] font-bold">No humans matched your search query.</p>
            </div>
          )}
        </div>

        {/* Decorative Mascot Peek */}
        <div className="absolute -bottom-10 -right-4 w-24 h-24 rotate-12 pointer-events-none hidden md:block">
          <img 
            className="w-full h-full object-contain drop-shadow-md" 
            alt="Monster mascot looking around" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7hykj10hHZnMKy0e__nWYo7YrXnDFbMeSKe2m5fKQi7VXDrGqEsg8jFkmhZNCavtXMaamxZe1uaPWrZ_H4ciUxdYrOaBpnRa84_ajfkIBJM7OHX2PfdCJOPchCFRvbSbzaHvVfszOX2yr4agKUI3S9XcVDGzMNtHVITXrXP3XcYPtgFManMXR5YS1Liw9VCFLdR1lm7TWChAinTemxmli9Z1Q2Gb9edPay4kmabsIqr-nCP5f-18iP8AA1TkLOYkWQFfQlVzs7bQ" 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
