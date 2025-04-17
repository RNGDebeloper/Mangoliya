import MangaReaderHome from "@/components/Home";
import { Metadata } from "next";

interface HomeProps {
    searchParams: Promise<{
        page: string;
        [key: string]: string | string[] | undefined;
    }>;
}

export const metadata: Metadata = {
    title: "Mangoliya Manga",
    description: "Read manga for free on Mangoliya.",
    openGraph: {
        title: "Mangoliya Manga",
        description: "Read manga for free on Mangoliya.",
        images: [
            {
                url: "https://raw.githubusercontent.com/sn0w12/Akari/refs/heads/master/public/img/icon.png",
                width: 512,
                height: 512,
                alt: "Mangoliya Manga",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@Mangoliya",
        title: "Mangoliya Manga",
        description: "Read manga for free on Mangoliya.",
        images: {
            url: "https://raw.githubusercontent.com/sn0w12/Akari/refs/heads/master/public/img/icon.png",
            width: 512,
            height: 512,
            alt: "Mangoliya Manga",
        },
    },
};

export default async function Home(props: HomeProps) {
    const searchParams = await props.searchParams;
    return (
        <div className="min-h-screen bg-background text-foreground">
            <MangaReaderHome searchParams={searchParams} />
        </div>
    );
}
