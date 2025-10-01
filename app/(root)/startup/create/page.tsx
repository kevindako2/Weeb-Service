import StartupForm from "@/components/StartupForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { AUTHORS_QUERY } from "@/sanity/lib/queries";

const Page = async () => {
    const session = await auth();

    if (!session) redirect("/");

    const authors = await client.fetch(AUTHORS_QUERY);

    return (
        <>
            <section className="pink_container !min-h-[230px]">
                <h1 className="heading">Submit Your Startup</h1>
            </section>

            <StartupForm authors={authors} session={session} />
        </>
    );
};

export default Page;