import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  Plus,
  User,
  Shield,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  X,
  Loader2,
  LogOut,
  KeyRound,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const ROLE_META = {
  admin:  { label: 'Admin',  color: 'bg-insite-blue/10 text-insite-blue' },
  editor: { label: 'Editor', color: 'bg-green-100 text-green-800' },
  author: { label: 'Writer', color: 'bg-gray-100 text-gray-700' },
};

const RoleBadge = ({ role }) => {
  const meta = ROLE_META[role] || ROLE_META.author;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${meta.color}`}>
      <Shield className="h-3 w-3" />
      {meta.label}
    </span>
  );
};

const EMPTY_FORM = { name: '', email: '', password: '', role: 'author' };

const UserManagement = () => {
  const { user, logout, authFetch } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await authFetch(`${API_BASE}/api/auth/users`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to load users.');
      setUsers(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (form.password.length < 8) {
      setFormError('Password must be at least 8 characters.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await authFetch(`${API_BASE}/api/auth/users`, {
        method: 'POST',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to create user.');
      setFormSuccess(`User "${data.data.name}" created successfully.`);
      setForm(EMPTY_FORM);
      await fetchUsers();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center">
                <img src="/assets/images/logo.png" alt="InSite Health" className="h-8" />
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <Link
                to="/blog/manage"
                className="flex items-center text-gray-500 hover:text-insite-blue text-sm transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Blog Management
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">User Management</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <img
                  src={user?.avatar || '/assets/images/team-1.jpg'}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-700">{user?.name}</span>
                <RoleBadge role={user?.role} />
              </div>
              <button onClick={logout} className="text-gray-500 hover:text-gray-900 transition-colors" title="Logout">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 max-w-5xl">

        {/* Action bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
            <p className="text-sm text-gray-500 mt-0.5">{users.length} user{users.length !== 1 ? 's' : ''} total</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchUsers}
              className="text-gray-500 hover:text-gray-900 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={() => { setShowForm(true); setFormError(''); setFormSuccess(''); }}
              className="flex items-center gap-2 bg-insite-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-insite-blue/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New User
            </button>
          </div>
        </div>

        {/* New user form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-4 w-4 text-insite-blue" />
                Create New User
              </h3>
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError(''); setFormSuccess(''); setForm(EMPTY_FORM); }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Smith"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-insite-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="jane@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-insite-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-insite-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-insite-blue focus:border-transparent"
                >
                  <option value="author">Writer (Author)</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="md:col-span-2 flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-insite-blue text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-insite-blue/90 transition-colors disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {submitting ? 'Creating...' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setFormError(''); setFormSuccess(''); }}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={fetchUsers} className="ml-auto underline">Retry</button>
          </div>
        )}

        {/* Users table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-insite-blue" />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Last Login</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u._id} className={`hover:bg-gray-50 transition-colors ${u._id === user?._id ? 'bg-insite-blue/3' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || '/assets/images/team-1.jpg'}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{u.name}</span>
                            {u._id === user?._id && (
                              <span className="text-xs text-insite-blue font-medium">(you)</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(u.lastLogin)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isLoading && users.length === 0 && (
            <div className="text-center py-12">
              <User className="h-10 w-10 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No users found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
