export default function LogoutButton() {
  return (
    <form action="/logout" method="post">
      <button type="submit" className="text-zinc-950 dark:text-zinc-50">
        Logout Account
      </button>
    </form>
  );
}
