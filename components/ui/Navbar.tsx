import Image from "next/image";
import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

const Navbar = async () => {
    const session = await auth();

    return (
        <header className="px-5 py-2 bg-white shadow font-work-sans">
            <nav className=" h-16 flex px-4 bg-white  justify-between items-center">
                    <Image src="/logo.png" alt="logo" width={174} height={30} />

                <div className="flex justify-between items-center h-16 px-6 gap-12 bg-white">
                    <Link href="/startup/create">
                            Create
                    </Link>

                    {session?.user ? (
                        <>
                            {}
                            <form
                                action={async () => {
                                    "use server";
                                    await signOut({ redirectTo: "/" });
                                }}
                            >
                                <button className="text-red-700" type="submit">Logout</button>
                            </form>

                            {}
                            <Link href={`/user/${session.user.id}`}>
                                <span className="text-black">{session.user.name}</span>
                            </Link>
                        </>
                    ) : (
                        <form
                            action={async () => {
                                "use server";
                                await signIn("github");
                            }}
                        >
                            <button className="text-black" type="submit">Login</button>
                        </form>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
