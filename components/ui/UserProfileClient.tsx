"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, User, LogOut } from "lucide-react";
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState(user.image || "");
    const [previewImage, setPreviewImage] = useState(user.image || "");

    const handleImageUpdate = async () => {
        setPreviewImage(imageUrl);
        setIsDialogOpen(false);
    };

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" });
    };

    return (
        <div className="relative">
            {/* Profile Button */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
                {previewImage ? (
                    <Image
                        src={previewImage}
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

            {/* Dropdown Menu */}
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
                                href={`/user/${user.id}`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                View Profile
                            </a>
                            <button
                                onClick={() => {
                                    setIsDialogOpen(true);
                                    setIsMenuOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                                <Camera className="mr-2 h-4 w-4" />
                                Update Photo
                            </button>
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

            {/* Update Photo Dialog */}
            {isDialogOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-30"
                        onClick={() => setIsDialogOpen(false)}
                    />
                    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-full max-w-md bg-white rounded-lg shadow-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Update Profile Photo</h2>
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            {imageUrl && (
                                <div className="flex justify-center">
                                    <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-primary/20">
                                        <Image
                                            src={imageUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                            <div>
                                <label htmlFor="image-url" className="block text-sm font-medium mb-2">
                                    Image URL
                                </label>
                                <input
                                    id="image-url"
                                    type="text"
                                    placeholder="https://example.com/image.jpg"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <button
                                onClick={handleImageUpdate}
                                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                            >
                                Update Photo
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
