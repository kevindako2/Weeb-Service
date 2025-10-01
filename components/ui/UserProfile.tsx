"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserProfileProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    onSignOut: () => void;
}

export default function UserProfile({ user, onSignOut }: UserProfileProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState(user.image || "");
    const [previewImage, setPreviewImage] = useState(user.image || "");

    const handleImageUpdate = async () => {
        // TODO: Implement image update logic with Sanity
        setPreviewImage(imageUrl);
        setIsDialogOpen(false);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
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
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <a href={`/user/${user.id}`} className="cursor-pointer">
                            View Profile
                        </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                        <Camera className="mr-2 h-4 w-4" />
                        Update Photo
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onSignOut} className="text-red-600">
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Update Profile Photo</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col items-center gap-4">
                            {imageUrl && (
                                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-primary/20">
                                    <Image
                                        src={imageUrl}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="image-url">Image URL</Label>
                            <Input
                                id="image-url"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleImageUpdate} className="w-full">
                            Update Photo
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
