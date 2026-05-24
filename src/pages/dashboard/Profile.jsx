import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Profile
      </h1>

      <div className="p-8 rounded-2xl border border-white/10 bg-white/5 max-w-xl">
        <p className="text-slate-400">Name</p>
        <p className="text-xl mb-4">{user?.name}</p>

        <p className="text-slate-400">Email</p>
        <p className="text-xl">{user?.email}</p>
      </div>
    </div>
  );
}