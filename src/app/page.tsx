import { syncUser } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
	const user = await currentUser();
	if (user) {
		try {
			await syncUser();
		} catch (error) {
			console.error("Failed to sync user:", error);
		}
	}
	return (
		<main className="flex min-h-screen flex-col items-center gap-3 p-24">
			<h1 className="text-4xl font-bold">SAFER IN WEB</h1>
			<p className=" text-lg">Witaj w Safer in Web!</p>
			<p className=" text-md">
				Dowiedz się jak bezpiecznie korzystać z Internetu już teraz!
			</p>
			<SignedOut>
				<SignInButton mode="modal">
					<Button>Sign in</Button>
				</SignInButton>
				<SignUpButton>
					<Button variant="outline">Sign up</Button>
				</SignUpButton>
			</SignedOut>
			<SignedIn>
				<UserButton />
			</SignedIn>
		</main>
	);
}
