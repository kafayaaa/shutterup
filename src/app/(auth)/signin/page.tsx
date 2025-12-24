import AuthButton from "@/components/OAuthButton";
import AuthLayout from "@/components/AuthLayout";

export default function SignIn() {
  return (
    <AuthLayout title="Sign In" desc="nanti ini Sign In">
      <div className="flex flex-col gap-3">
        <AuthButton text="Sign In" />
      </div>
    </AuthLayout>
  );
}
