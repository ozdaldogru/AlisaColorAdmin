import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/nextjs";
import { RedirectToSignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <SignedIn>
    
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  )
}
