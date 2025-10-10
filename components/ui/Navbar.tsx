import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import UserProfileClient from "./UserProfileClient";
import LoginMenu from "./LoginMenu";

const Navbar = async () => {
    const session = await auth();

    return (
        <header className="px-5 py-2 bg-white shadow font-work-sans">
            <nav className="h-16 flex px-4 bg-white justify-between items-center">
                <Link href="/">
                    <Image src="/logo.png" alt="logo" width={174} height={30} />
                </Link>

                <div className="flex justify-between items-center h-16 px-6 gap-6 bg-white">
                    <Link href="/" className="text-black hover:text-primary transition-colors">
                        Home
                    </Link>
                    {session?.user && (
                        <Link href="/startup/create" className="text-black hover:text-primary transition-colors">
                            Create
                        </Link>
                    )}

                    {session?.user ? (
                        <UserProfileClient 
                            user={{
                                id: session.user.id || "",
                                name: session.user.name,
                                email: session.user.email,
                                image: session.user.image,
                            }}
                        />
                    ) : (
                        <LoginMenu />
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
