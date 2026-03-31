import React, { useState, useEffect } from 'react';
/* 
  DEVELOPER NOTE: 
  The owner plans to migrate this app from Firestore to SQLite for VPS deployment.
  Please refer to /DEVELOPER_NOTES.md for migration details and schema requirements.
*/
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { api } from './api';
import { Guest, EventSettings } from './types';
import { cn, generateSlug } from './lib/utils';
import { 
  Plus, Trash2, Upload, MapPin, Calendar, 
  ExternalLink, LogOut, Settings as SettingsIcon, 
  Users, Share2, Download, Check, AlertCircle,
  Menu, X, ChevronRight, Map as MapIcon,
  Clock, Info, Home, Volume2, VolumeX, MessageCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import ReactPlayer from 'react-player';

interface User {
  username: string;
}

// --- Components ---

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#FDF8F1]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E67E22]"></div>
  </div>
);

const LoginPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setLoading(true);
    setError('');

    try {
      const data = await api.login(username, password);
      onLogin(data.user);
    } catch (err: any) {
      setError('Username atau password salah.');
    }
    setLoading(false);
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100 flex items-center gap-2"
      >
        <AlertCircle size={16} />
        {error}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF8F1] p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full"
      >
        <div className="w-20 h-20 bg-[#E67E22] rounded-2xl flex items-center justify-center text-white font-black text-4xl mx-auto mb-8 shadow-lg">F</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Festival Gurita 2026</h1>
        <p className="text-gray-500 mb-8 text-center">Panel Admin - Silakan Masuk</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E67E22] outline-none transition-all"
              placeholder="Masukkan username..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#E67E22] outline-none transition-all"
              placeholder="Masukkan password..."
              required
            />
          </div>
          
          {renderError()}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#E67E22] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#D35400] transition-all shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : 'Masuk ke Panel Admin'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const Navbar = ({ user, onLogout }: { user: User | null, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-[#E67E22] rounded-lg flex items-center justify-center text-white font-bold">F</div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">Festival Gurita Admin</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <div className="flex items-center gap-2 mr-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                  <div className="w-6 h-6 bg-[#E67E22] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    {user.username?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {user.username}
                  </span>
                </div>
                <Link to="/" className="text-gray-600 hover:text-[#E67E22] px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                  <Users size={18} /> Tamu
                </Link>
                <Link to="/settings" className="text-gray-600 hover:text-[#E67E22] px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                  <SettingsIcon size={18} /> Pengaturan
                </Link>
                <button 
                  onClick={onLogout}
                  className="bg-gray-50 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <LogOut size={18} /> Keluar
                </button>
              </>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {user && (
                <>
                  <div className="px-3 py-2 border-b border-gray-50 mb-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Masuk sebagai</p>
                    <p className="text-sm font-bold text-[#E67E22]">{user.username}</p>
                  </div>
                  <Link to="/" onClick={() => setIsOpen(false)} className="block text-gray-600 hover:text-[#E67E22] px-3 py-2 rounded-md text-base font-medium">Daftar Tamu</Link>
                  <Link to="/settings" onClick={() => setIsOpen(false)} className="block text-gray-600 hover:text-[#E67E22] px-3 py-2 rounded-md text-base font-medium">Pengaturan</Link>
                  <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full text-left text-gray-600 hover:text-[#E67E22] px-3 py-2 rounded-md text-base font-medium">Keluar</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Pages ---

const AdminDashboard = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'sent' | 'unsent'>('all');

  const fetchGuests = async () => {
    try {
      const data = await api.getGuests();
      setGuests(data);
    } catch (error) {
      console.error('Failed to fetch guests', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    const slug = generateSlug(newName);
    try {
      await api.addGuest({
        name: newName,
        title: newTitle,
        phone: newPhone,
        slug
      });
      setNewName('');
      setNewTitle('');
      setNewPhone('');
      fetchGuests();
    } catch (error) {
      console.error('Failed to add guest', error);
    }
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | number | null>(null);

  const handleDeleteGuest = async (id: string | number) => {
    try {
      await api.deleteGuest(id);
      setDeleteConfirmId(null);
      fetchGuests();
    } catch (error) {
      console.error('Failed to delete guest', error);
    }
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws) as any[];

      try {
        for (const row of data) {
          const name = row.Nama || row.name || row.NAME;
          const title = row.Jabatan || row.title || row.TITLE || '';
          const phone = row.WhatsApp || row.phone || row.PHONE || row.WA || '';
          if (name) {
            const slug = generateSlug(name);
            await api.addGuest({
              name,
              title,
              phone: phone.toString(),
              slug
            });
          }
        }
        fetchGuests();
      } catch (error) {
        console.error('Failed to upload guests', error);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const sendWhatsApp = async (guest: Guest) => {
    const invitationUrl = `${window.location.origin}/u/${guest.slug}`;
    const message = `Assalamu'alaikum Warahmatullahi Wabarakatuh.

Dengan hormat, kami mengundang Bapak/Ibu/Saudara/i *${guest.name}* (${guest.title || 'Tamu Undangan'}) untuk menghadiri *FESTIVAL GURITA 2026* dengan tema "Sambal Langat Gurita".

Berikut adalah link undangan digital Anda:
${invitationUrl}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.

Terima kasih.`;
    
    const encodedMessage = encodeURIComponent(message);
    let phone = guest.phone ? guest.phone.replace(/\D/g, '') : '';
    if (phone.startsWith('0')) {
      phone = '62' + phone.substring(1);
    }

    const whatsappUrl = phone 
      ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`
      : `https://api.whatsapp.com/send?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');

    if (guest.id) {
      try {
        await api.toggleWaSent(guest.id, true);
        fetchGuests();
      } catch (error) {
        console.error('Failed to update WA status', error);
      }
    }
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isSent = guest.waSent === 1 || guest.waSent === true;
    
    if (filterStatus === 'sent') return matchesSearch && isSent;
    if (filterStatus === 'unsent') return matchesSearch && !isSent;
    return matchesSearch;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);
  const currentItems = filteredGuests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Add Guest */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plus size={20} className="text-[#E67E22]" /> Tambah Tamu Manual
            </h2>
            <form onSubmit={handleAddGuest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none transition-all"
                  placeholder="Contoh: Bpk. John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan (Opsional)</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none transition-all"
                  placeholder="Contoh: Kepala Dinas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp (Opsional)</label>
                <input 
                  type="text" 
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E67E22] focus:border-transparent outline-none transition-all"
                  placeholder="Contoh: 08123456789"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-[#E67E22] text-white py-2 rounded-lg font-medium hover:bg-[#D35400] transition-colors shadow-sm"
              >
                Tambah Tamu
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Upload size={20} className="text-[#E67E22]" /> Upload Excel
              </h2>
              <p className="text-sm text-gray-500 mb-4">Upload file .xlsx dengan kolom "Nama", "Jabatan", dan "WhatsApp".</p>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">{isUploading ? 'Sedang mengupload...' : 'Klik untuk upload'}</p>
                </div>
                <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleExcelUpload} disabled={isUploading} />
              </label>
            </div>
          </div>
        </div>

        {/* Right: Guest List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-gray-900">Daftar Tamu ({filteredGuests.length})</h2>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Cari nama tamu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E67E22] outline-none text-sm"
                  />
                  <Users size={18} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E67E22] outline-none text-sm bg-white"
                >
                  <option value="all">Semua Tamu</option>
                  <option value="sent">Sudah Kirim WA</option>
                  <option value="unsent">Belum Kirim WA</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase text-gray-400 font-semibold tracking-wider">
                    <th className="px-6 py-4">Nama & Jabatan</th>
                    <th className="px-6 py-4">Link Undangan</th>
                    <th className="px-6 py-4">WhatsApp</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentItems.map((guest) => {
                    const isSent = guest.waSent === 1 || guest.waSent === true;
                    return (
                      <tr key={guest.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{guest.name}</div>
                          <div className="text-xs text-gray-500">{guest.title || '-'}</div>
                          {guest.phone && <div className="text-[10px] text-gray-400 mt-1">{guest.phone}</div>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded text-[#E67E22]">/{guest.slug}</code>
                            <a 
                              href={`/u/${guest.slug}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-[#E67E22] transition-colors"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => sendWhatsApp(guest)}
                            className={cn(
                              "flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full transition-colors",
                              isSent 
                                ? "text-red-600 hover:text-red-700 bg-red-50" 
                                : "text-green-600 hover:text-green-700 bg-green-50"
                            )}
                          >
                            <MessageCircle size={14} />
                            {isSent ? 'Sudah Kirim' : 'Kirim WA'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setDeleteConfirmId(guest.id!)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                        {searchTerm ? 'Tamu tidak ditemukan.' : 'Belum ada tamu yang terdaftar.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="text-sm text-gray-500">
                  Halaman <span className="font-medium">{currentPage}</span> dari <span className="font-medium">{totalPages}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={18} className="rotate-180" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Only show limited page numbers if too many
                    if (
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={cn(
                            "w-8 h-8 rounded text-sm font-medium transition-all border",
                            currentPage === page
                              ? "bg-[#E67E22] text-white border-[#E67E22]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-[#E67E22] hover:text-[#E67E22]"
                          )}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 || 
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="px-1 text-gray-400">...</span>;
                    }
                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-8 shadow-2xl relative z-10 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Tamu?</h3>
              <p className="text-gray-500 mb-8">Tindakan ini tidak dapat dibatalkan. Tamu ini akan dihapus dari daftar.</p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-6 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={() => handleDeleteGuest(deleteConfirmId!)}
                  className="px-6 py-3 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingsPage = () => {
  const [settings, setSettings] = useState<EventSettings>({
    logoUrl: '',
    bannerUrl: '',
    eventName: 'FESTIVAL GURITA 2026',
    theme: 'Sambal Langat Gurita',
    dates: '22 – 23 Mei 2026',
    location: 'Lapangan Merdeka Bintuhan',
    locationUrl: 'https://www.google.com/maps/dir/-4.5344493,103.0560675/Lapangan+Merdeka+Bintuhan,+684X%2BRHF,+Pasar+Baru,+Kaur+Selatan,+Kaur+Regency,+Bengkulu+38963/@-4.793615,103.3478331,286m/am=t/data=!3m1!1e3!4m13!4m12!1m1!4e1!1m5!1m1!1s0x2e37e52fc34e0bdd:0x1a8429c8d78609f0!2m2!1d103.3489328!2d-4.7929325!6m3!1i0!2i0!3i2!5m2!1e4!1e1?entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D',
    galleryImages: [],
    heroLogoUrl: '',
    musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.getSettings();
        if (data) {
          setSettings({
            ...data,
            galleryImages: data.galleryImages || []
          });
        }
      } catch (error) {
        console.error('Failed to fetch settings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings(settings);
      setSaveSuccess(true);
    } catch (error) {
      console.error('Failed to save settings', error);
    } finally {
      setSaving(false);
    }
  };

  const addGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    setSettings({
      ...settings,
      galleryImages: [...(settings.galleryImages || []), newGalleryUrl]
    });
    setNewGalleryUrl('');
  };

  const removeGalleryImage = (index: number) => {
    const newImages = [...(settings.galleryImages || [])];
    newImages.splice(index, 1);
    setSettings({ ...settings, galleryImages: newImages });
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <SettingsIcon className="text-[#E67E22]" /> Pengaturan Acara
        </h2>
        
        <form onSubmit={handleSave} className="space-y-8">
          {saveSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-100 flex items-center gap-3 mb-6"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Pengaturan berhasil disimpan!
            </motion.div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Acara</label>
                <input 
                  type="text" 
                  value={settings.eventName}
                  onChange={(e) => setSettings({ ...settings, eventName: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E67E22] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tema Acara</label>
                <input 
                  type="text" 
                  value={settings.theme}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E67E22] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <input 
                  type="text" 
                  value={settings.dates}
                  onChange={(e) => setSettings({ ...settings, dates: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E67E22] outline-none"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Logo</label>
                <input 
                  type="text" 
                  value={settings.logoUrl}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E67E22] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Banner Utama</label>
                <input 
                  type="text" 
                  value={settings.bannerUrl}
                  onChange={(e) => setSettings({ ...settings, bannerUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E67E22] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Hero Logo (Stylized)</label>
                <input 
                  type="text" 
                  value={settings.heroLogoUrl || ''}
                  onChange={(e) => setSettings({ ...settings, heroLogoUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E67E22] outline-none"
                  placeholder="Masukkan URL logo gurita..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Musik Latar (MP3/YouTube/SoundCloud)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={settings.musicUrl || ''}
                    onChange={(e) => setSettings({ ...settings, musicUrl: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E67E22] outline-none"
                    placeholder="Masukkan URL YouTube, SoundCloud, atau MP3..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (settings.musicUrl) {
                        window.open(settings.musicUrl, '_blank');
                      }
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium"
                  >
                    Test Link
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                <input 
                  type="text" 
                  value={settings.location}
                  onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E67E22] outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Google Maps</label>
            <textarea 
              value={settings.locationUrl}
              onChange={(e) => setSettings({ ...settings, locationUrl: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E67E22] outline-none h-20"
            />
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapIcon size={20} className="text-[#E67E22]" /> Galeri Destinasi Wisata
            </h3>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                placeholder="Masukkan URL foto destinasi..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#E67E22] outline-none"
              />
              <button 
                type="button"
                onClick={addGalleryImage}
                className="bg-[#E67E22] text-white px-4 py-2 rounded-lg hover:bg-[#D35400]"
              >
                Tambah
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {settings.galleryImages?.map((url, idx) => (
                <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100">
                  <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button 
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={saving}
            className="w-full bg-[#E67E22] text-white py-4 rounded-xl font-bold hover:bg-[#D35400] transition-all shadow-lg disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
          </button>
        </form>
      </div>
    </div>
  );
};

const InvitationPage = () => {
  const { slug } = useParams();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [settings, setSettings] = useState<EventSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [settingsData, guestData] = await Promise.all([
          api.getPublicSettings(),
          api.getPublicGuest(slug || '')
        ]);
        
        if (settingsData) {
          setSettings(settingsData);
        } else {
          setSettings({
            eventName: 'FESTIVAL GURITA 2026',
            theme: 'Sambal Langat Gurita',
            dates: '22 – 23 Mei 2026',
            location: 'Lapangan Merdeka Bintuhan',
            locationUrl: 'https://www.google.com/maps/dir/-4.5344493,103.0560675/Lapangan+Merdeka+Bintuhan,+684X%2BRHF,+Pasar+Baru,+Kaur+Selatan,+Kaur+Regency,+Bengkulu+38963/@-4.793615,103.3478331,286m/am=t/data=!3m1!1e3!4m13!4m12!1m1!4e1!1m5!1m1!1s0x2e37e52fc34e0bdd:0x1a8429c8d78609f0!2m2!1d103.3489328!2d-4.7929325!6m3!1i0!2i0!3i2!5m2!1e4!1e1?entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D',
            logoUrl: '',
            bannerUrl: '',
            galleryImages: [],
            heroLogoUrl: '',
            musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
          });
        }
        
        setGuest(guestData);
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [slug]);

  if (loading) return <Loading />;
  
  if (!guest) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF8F1] p-4 text-center">
      <AlertCircle size={64} className="text-red-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Undangan Tidak Ditemukan</h1>
      <p className="text-gray-600 mb-6">Maaf, link undangan untuk "{slug}" tidak valid atau telah dihapus.</p>
      <Link to="/" className="bg-[#E67E22] text-white px-6 py-2 rounded-lg font-medium">Kembali ke Beranda</Link>
    </div>
  );

  const displaySettings = settings || {
    eventName: 'FESTIVAL GURITA 2026',
    theme: 'Sambal Langat Gurita',
    dates: '22 – 23 Mei 2026',
    location: 'Lapangan Merdeka Bintuhan',
    locationUrl: 'https://www.google.com/maps/dir/-4.5344493,103.0560675/Lapangan+Merdeka+Bintuhan,+684X%2BRHF,+Pasar+Baru,+Kaur+Selatan,+Kaur+Regency,+Bengkulu+38963/@-4.793615,103.3478331,286m/am=t/data=!3m1!1e3!4m13!4m12!1m1!4e1!1m5!1m1!1s0x2e37e52fc34e0bdd:0x1a8429c8d78609f0!2m2!1d103.3489328!2d-4.7929325!6m3!1i0!2i0!3i2!5m2!1e4!1e1?entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D',
    logoUrl: '',
    bannerUrl: '',
    galleryImages: [],
    heroLogoUrl: '',
    musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  };

  const handleOpenInvitation = () => {
    setIsOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsPlaying(true);
    // Tambahan: Pastikan volume tidak 0 dan un-mute jika tertahan browser
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] font-sans selection:bg-[#E67E22]/20 overflow-x-hidden">
      {displaySettings.musicUrl && (
        <audio
          id="bg-music"
          src={displaySettings.musicUrl}
          loop
          autoPlay={false}
          style={{ display: 'none' }}
          ref={(el) => {
            if (el) {
              if (isPlaying && !isMuted) {
                el.play().catch(e => console.error("Audio play failed:", e));
                el.volume = 1.0;
              } else {
                el.pause();
              }
              el.muted = isMuted;
            }
          }}
        />
      )}

      {isOpen && displaySettings.musicUrl && (
        <button 
          onClick={toggleMute}
          className="fixed bottom-6 right-6 z-[60] bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-gray-100 text-primary hover:scale-110 transition-all"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}
      {/* Cover Modal */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center text-white text-center p-6 overflow-hidden"
          >
            <motion.div 
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0 z-0"
              style={{ 
                backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${displaySettings.bannerUrl || 'https://picsum.photos/seed/festival/1920/1080'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            
            <div className="relative z-10 max-w-2xl mx-auto lg:scale-[0.85] transition-transform duration-700">
              <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mb-8"
              >
                {displaySettings.logoUrl ? (
                  <img src={displaySettings.logoUrl} alt="Logo" className="w-32 h-32 mx-auto object-contain drop-shadow-2xl" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto border border-white/20">
                    <span className="text-3xl font-black italic">FG</span>
                  </div>
                )}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="relative"
              >
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-primary font-bold tracking-[0.8em] uppercase text-[9px] mb-8 opacity-90"
                >
                  Official Invitation
                </motion.p>
                
                <h1 className="relative inline-block">
                  <span className="block text-7xl md:text-9xl font-serif italic font-black mb-2 leading-[0.8] tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    Festival
                  </span>
                  <span className="block text-7xl md:text-9xl font-serif italic font-black leading-[0.8] tracking-tighter text-primary drop-shadow-[0_10px_30px_rgba(230,126,34,0.3)]">
                    Gurita
                  </span>
                  <motion.span 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute -right-4 -bottom-12 text-4xl md:text-6xl font-serif italic font-light text-white/20 select-none pointer-events-none"
                  >
                    2026
                  </motion.span>
                </h1>

                <div className="flex items-center justify-center gap-6 my-12">
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/50"></div>
                  <p className="text-xl md:text-2xl text-white/80 font-serif italic font-light tracking-[0.2em]">
                    <span className="text-primary/60 mr-2">“</span>
                    {displaySettings.theme}
                    <span className="text-primary/60 ml-2">”</span>
                  </p>
                  <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/50"></div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="mb-12 bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-2xl"
              >
                <p className="text-[10px] text-white/50 mb-4 uppercase tracking-[0.4em]">Kepada Yth.</p>
                <h2 className="text-3xl md:text-5xl font-serif italic font-bold mb-2 break-words">{guest.name}</h2>
                <p className="text-sm md:text-lg text-primary font-medium tracking-widest uppercase">{guest.title}</p>
              </motion.div>

              <motion.button 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenInvitation}
                className="bg-primary text-white px-12 md:px-16 py-5 md:py-6 rounded-full font-bold text-xs md:text-sm uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(230,126,34,0.3)] hover:bg-primary-dark transition-all flex items-center gap-4 mx-auto group"
              >
                Buka Undangan <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={cn("transition-all duration-1000", !isOpen ? "blur-3xl scale-110" : "blur-0 scale-100")}>
        {/* Editorial Hero */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={isOpen ? { scale: 1 } : {}}
            transition={{ duration: 2 }}
            className="absolute inset-0 z-0"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), #FDF8F1), url(${displaySettings.bannerUrl || 'https://picsum.photos/seed/festival/1920/1080'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {displaySettings.heroLogoUrl ? (
                <div className="max-w-2xl mx-auto">
                  <img 
                    src={displaySettings.heroLogoUrl} 
                    alt={displaySettings.eventName} 
                    className="w-full h-auto drop-shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="relative inline-block">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"
                  />
                  <h2 className="text-8xl md:text-[12rem] font-serif italic font-black text-gray-900 mb-6 tracking-tighter leading-[0.75] uppercase relative z-10">
                    Festival <br /> 
                    <span className="text-primary relative inline-block">
                      Gurita
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="absolute -bottom-4 left-0 h-2 bg-primary/20 rounded-full"
                      />
                    </span>
                  </h2>
                  <div className="flex items-center justify-center gap-6 mt-12">
                    <div className="h-[1px] w-16 bg-gray-200"></div>
                    <div className="flex flex-col items-center">
                      <p className="text-2xl md:text-3xl font-serif italic text-gray-400 tracking-[0.4em] uppercase leading-none">2026</p>
                      <p className="text-[10px] font-bold text-primary tracking-[0.6em] uppercase mt-2">Edition</p>
                    </div>
                    <div className="h-[1px] w-16 bg-gray-200"></div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.3em]">Scroll Down</span>
            <div className="w-px h-12 bg-gradient-to-b from-gray-400 to-transparent"></div>
          </motion.div>
        </section>

        {/* Event Details - Clean Utility */}
        <section className="max-w-6xl mx-auto px-6 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div>
                <span className="text-[#E67E22] font-bold tracking-widest uppercase text-xs mb-4 block">The Occasion</span>
                <h2 className="text-4xl md:text-5xl font-serif italic font-bold text-gray-900 mb-6">Waktu & Tempat</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Kami mengundang Anda untuk merayakan kekayaan kuliner dan budaya Kabupaten Kaur dalam perhelatan tahunan yang penuh kemeriahan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                  <Calendar className="text-[#E67E22] mb-4" size={32} />
                  <h4 className="font-bold text-gray-900 mb-1">Tanggal</h4>
                  <p className="text-gray-500">{displaySettings.dates}</p>
                </div>
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                  <Clock className="text-[#E67E22] mb-4" size={32} />
                  <h4 className="font-bold text-gray-900 mb-1">Puncak Acara</h4>
                  <p className="text-gray-500">Malam 23 Mei 2026</p>
                </div>
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 sm:col-span-2">
                  <MapPin className="text-[#E67E22] mb-4" size={32} />
                  <h4 className="font-bold text-gray-900 mb-1">Lokasi</h4>
                  <p className="text-gray-500">{displaySettings.location}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <img 
                src={displaySettings.bannerUrl || 'https://picsum.photos/seed/festival/800/1000'} 
                alt="Festival" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-10">
                <div className="text-white">
                  <p className="text-sm uppercase tracking-widest mb-2 opacity-80">Theme</p>
                  <h3 className="text-3xl font-serif italic font-bold">"{displaySettings.theme}"</h3>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tourist Destinations Gallery */}
        <section className="bg-white py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-[#E67E22] font-bold tracking-widest uppercase text-xs mb-4 block">Explore Kaur</span>
                <h2 className="text-4xl md:text-6xl font-serif italic font-bold text-gray-900 mb-6">Destinasi Wisata</h2>
                <p className="text-gray-500 max-w-xl mx-auto text-lg">
                  Nikmati keindahan alam Kabupaten Kaur di sela-sela kemeriahan festival.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(displaySettings.galleryImages && displaySettings.galleryImages.length > 0 ? displaySettings.galleryImages : [
                'https://picsum.photos/seed/beach1/600/800',
                'https://picsum.photos/seed/beach2/600/800',
                'https://picsum.photos/seed/beach3/600/800',
                'https://picsum.photos/seed/beach4/600/800'
              ]).map((url, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                >
                  <img 
                    src={url} 
                    alt={`Destinasi ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Immersive Map Section */}
        <section className="relative py-32 bg-[#FDF8F1]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-[#E67E22]/10 rounded-full flex items-center justify-center text-[#E67E22] mx-auto mb-8">
                <MapIcon size={40} />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif italic font-bold text-gray-900 mb-6">Petunjuk Jalan</h2>
              <p className="text-gray-600 text-lg mb-12 max-w-xl mx-auto">
                Lokasi acara berada di pusat kota Bintuhan. Klik tombol di bawah untuk panduan navigasi langsung.
              </p>
              <a 
                href={displaySettings.locationUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-black transition-all shadow-xl group"
              >
                Buka di Google Maps <ExternalLink size={20} className="group-hover:rotate-45 transition-transform" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#1A1A1A] text-white py-32 text-center px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-serif italic font-bold mb-8">Sampai Jumpa di Kaur</h2>
              <p className="text-gray-400 text-lg mb-16 leading-relaxed">
                Kehadiran Anda adalah kehormatan bagi kami. Mari bersama-sama merayakan potensi daerah dan kearifan lokal Kabupaten Kaur.
              </p>
              <div className="h-px w-full bg-white/10 mb-12"></div>
              <p className="text-sm uppercase tracking-[0.4em] text-gray-500">Festival Gurita 2026 &bull; Bengkulu</p>
            </motion.div>
          </div>
        </footer>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you might want to verify the token with the server
      setUser({ username: 'Admin' });
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    api.logout();
    setUser(null);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Invitation Route */}
        <Route path="/u/:slug" element={<InvitationPage />} />
        
        {/* Admin Routes */}
        <Route path="/" element={
          user ? (
            <>
              <Navbar user={user} onLogout={handleLogout} />
              <AdminDashboard />
            </>
          ) : (
            <LoginPage onLogin={setUser} />
          )
        } />
        
        <Route path="/settings" element={
          user ? (
            <>
              <Navbar user={user} onLogout={handleLogout} />
              <SettingsPage />
            </>
          ) : (
            <LoginPage onLogin={setUser} />
          )
        } />
      </Routes>
    </div>
  );
}
