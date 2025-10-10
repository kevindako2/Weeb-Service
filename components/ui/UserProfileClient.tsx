"use client";

import { useState } from "react";
import Image from "next/image";
import { User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface UserProfileClientProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export default function UserProfileClient({ user }: UserProfileClientProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" });
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
                {user.image ? (
                    <Image
                        src={user.image}
                        alt={user.name || "User"}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                    />
                ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                )}
            </button>

            {isMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                        <div className="py-1">
                            <div className="px-4 py-3 border-b">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                            <a
                                href="/profile"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                View Profile
                            </a>
                            <a
                                href="/profile/edit"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Edit Profile
                            </a>
                            <div className="border-t">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
