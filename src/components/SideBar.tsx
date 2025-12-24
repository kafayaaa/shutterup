import LogoutButton from "./LogoutButton";

export default function SideBar() {
  return (
    <div className="w-full min-h-screen p-5 text-zinc-950 dark:text-zinc-50 bg-zinc-500 dark:bg-zinc-950">
      <div className="flex flex-col gap-5">
        <div>
          <h1>Ini SideBar</h1>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <button>dashboard</button>
        <LogoutButton />
      </div>
    </div>
  );
}
