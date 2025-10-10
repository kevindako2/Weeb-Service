import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";
import EditProfileForm from "@/components/ui/EditProfileForm";

const EditProfilePage = async () => {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    const sanityAuthor = await client.fetch(
        `*[_type == "author" && email == $email][0]{
            _id,
            name,
            username,
            email,
            image,
            bio,
            phone,
            country,
            age,
            profession,
            instagram,
            twitter,
            facebook
        }`,
        { email: session.user.email }
    );

    return (
        <section className="pink_container !min-h-screen">
            <div className="max-w-3xl mx-auto">
                <h1 className="heading text-center mb-10">Modifier mon profil</h1>
                <EditProfileForm author={sanityAuthor} session={session} />
            </div>
        </section>
    );
};

export default EditProfilePage;
