import React, { useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileDigit,
  Save,
  Shield,
  Bell,
  Palette,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('company');

  const [formData, setFormData] = useState({
    companyName: user?.companyName || '',
    vatNumber: user?.vatNumber || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    zipCode: user?.zipCode || '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'company', label: 'Company Info', icon: Building2 },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'branding', label: 'Branding', icon: Palette },
  ];

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {saved && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-3 text-sm animate-fade-in">
          ✓ Settings saved successfully
        </div>
      )}

      {activeTab === 'company' && (
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
              <Building2 size={20} className="text-brand-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Company Information</h2>
              <p className="text-sm text-slate-500">Update your business details</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <Input
              label="Company Name"
              value={formData.companyName}
              onChange={e => handleChange('companyName', e.target.value)}
              icon={<Building2 size={18} />}
            />

            <Input
              label="VAT/CVR Number"
              value={formData.vatNumber}
              onChange={e => handleChange('vatNumber', e.target.value)}
              icon={<FileDigit size={18} />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                icon={<Mail size={18} />}
              />
              <Input
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={e => handleChange('phone', e.target.value)}
                icon={<Phone size={18} />}
              />
            </div>

            <Input
              label="Address"
              value={formData.address}
              onChange={e => handleChange('address', e.target.value)}
              icon={<MapPin size={18} />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Zip Code"
                value={formData.zipCode}
                onChange={e => handleChange('zipCode', e.target.value)}
              />
              <Input
                label="City"
                value={formData.city}
                onChange={e => handleChange('city', e.target.value)}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <Button type="submit" icon={<Save size={16} />}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-brand-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Security Settings</h2>
              <p className="text-sm text-slate-500">Manage your account security</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-xl">
              <h3 className="font-medium text-slate-900 mb-2">Change Password</h3>
              <div className="space-y-3">
                <Input label="Current Password" type="password" placeholder="Enter current password" />
                <Input label="New Password" type="password" placeholder="Enter new password" />
                <Input label="Confirm New Password" type="password" placeholder="Confirm new password" />
              </div>
              <div className="mt-4">
                <Button size="sm">Update Password</Button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <h3 className="font-medium text-slate-900 mb-1">Two-Factor Authentication</h3>
              <p className="text-sm text-slate-500 mb-3">Add an extra layer of security to your account</p>
              <Button variant="outline" size="sm">Enable 2FA</Button>
            </div>

            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <h3 className="font-medium text-red-900 mb-1">Danger Zone</h3>
              <p className="text-sm text-red-600 mb-3">Permanently delete your account and all data</p>
              <Button variant="danger" size="sm">Delete Account</Button>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
              <Bell size={20} className="text-brand-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Notification Preferences</h2>
              <p className="text-sm text-slate-500">Choose what notifications you receive</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Quotation accepted', desc: 'When a customer accepts your quotation', default: true },
              { label: 'Quotation rejected', desc: 'When a customer rejects your quotation', default: true },
              { label: 'Quotation expiring', desc: 'When a quotation is about to expire', default: true },
              { label: 'Weekly summary', desc: 'A weekly digest of your activity', default: false },
              { label: 'Marketing emails', desc: 'Product updates and feature announcements', default: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-900 text-sm">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:ring-4 peer-focus:ring-brand-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'branding' && (
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
              <Palette size={20} className="text-brand-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Branding & Customization</h2>
              <p className="text-sm text-slate-500">Customize the look of your quotations</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-xl">
              <h3 className="font-medium text-slate-900 mb-2">Company Logo</h3>
              <p className="text-sm text-slate-500 mb-3">Upload your logo to appear on quotations</p>
              <div className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 hover:border-brand-400 hover:text-brand-500 transition-colors cursor-pointer">
                <div className="text-center">
                  <Building2 size={24} className="mx-auto mb-1" />
                  <span className="text-xs">Upload Logo</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <h3 className="font-medium text-slate-900 mb-2">Brand Color</h3>
              <p className="text-sm text-slate-500 mb-3">Choose your primary brand color</p>
              <div className="flex gap-3">
                {['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'].map(color => (
                  <button
                    key={color}
                    className="w-10 h-10 rounded-xl border-2 border-white shadow-sm hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm text-amber-800">
                <strong>Coming Soon:</strong> Full branding customization including custom logos,
                colors, and quotation templates will be available in the next update.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
