interface HeaderProps {
  connected: boolean;
  onLogout: () => void;
}

export default function Header({ connected, onLogout }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Weather App</h1>
      <div className="flex items-center gap-4">
        <span className={`text-sm ${connected ? "text-green-400" : "text-red-400"}`}>
          {connected ? "Connected" : "Disconnected"}
        </span>
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-sm cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
