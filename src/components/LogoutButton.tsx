import { RiLogoutCircleLine } from "react-icons/ri";

export default function LogoutButton() {
  return (
    <form action="/logout" method="post">
      <button
        type="submit"
        className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-rose-500 font-extrabold font-fira-code text-sm text-white rounded-md hover:bg-rose-500/80"
      >
        <RiLogoutCircleLine className="text-2xl" />
        Logout
      </button>
    </form>
  );
}
