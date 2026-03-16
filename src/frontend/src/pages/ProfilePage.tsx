import { Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import type { UserProfile } from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const FIELDS: [keyof UserProfile, string, string][] = [
  ["name", "Full Name", "text"],
  ["email", "Email", "email"],
  ["phone", "Phone Number", "tel"],
  ["address", "Address", "text"],
];

export default function ProfilePage() {
  const { actor } = useActor();
  const { identity, login } = useInternetIdentity();
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!actor || !identity) return;
    actor
      .getCallerUserProfile()
      .then((p) => {
        if (p) setProfile(p);
      })
      .catch(console.error);
  }, [actor, identity]);

  const handleSave = async () => {
    if (!actor || !identity) {
      login();
      return;
    }
    setSaving(true);
    try {
      await actor.saveCallerUserProfile(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (!identity) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <User size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Sign in to view your profile
          </h2>
          <button
            type="button"
            onClick={login}
            className="gold-bg text-gray-900 font-bold px-6 py-3 rounded-lg"
            data-ocid="profile.login_button"
          >
            Login
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User size={24} /> My Profile
        </h1>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="space-y-4">
            {FIELDS.map(([field, label, type]) => (
              <div key={field}>
                <label
                  htmlFor={`profile-${field}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {label}
                </label>
                <input
                  id={`profile-${field}`}
                  type={type}
                  value={profile[field]}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, [field]: e.target.value }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  data-ocid={`profile.${field}_input`}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`mt-6 flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
              saved
                ? "bg-green-500 text-white"
                : "gold-bg text-gray-900 hover:opacity-90"
            }`}
            data-ocid="profile.save_button"
          >
            <Save size={18} />
            {saving ? "Saving..." : saved ? "Saved!" : "Save Profile"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
