import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/nextjs";
import { RedirectToSignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>

      <SignedIn>

      </SignedIn>
      <SignedOut>
        <RedirectToSignUp
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/onboarding"
        />
      </SignedOut>
    </ClerkProvider>
  )
}
