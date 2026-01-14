export default function LogoutButton() {
  return (
    <form action="/logout" method="post">
      <div className="w-full flex flex-col items-center justify-center">
        <button type="submit" className="text-zinc-950 dark:text-zinc-50">
          Logout Account
        </button>
      </div>
    </form>
  );
}
