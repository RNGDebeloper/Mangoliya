"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import PaginationElement from "@/components/ui/paginationElement";
import { Manga } from "@/app/api/interfaces";
import React from "react";
import CenteredSpinner from "@/components/ui/spinners/centeredSpinner";
import ScoreDisplay from "@/components/ui/scoreDisplay";
import { distance } from "fastest-levenshtein";
import BookmarkButton from "./ui/bookmarkButton";

interface MalData {
  titles: { type: string; title: string }[];
  imageUrl: string;
  url: string;
  score: number | null;
}

async function fetchManga(id: string): Promise<Manga | null> {
  const user_data = localStorage.getItem("accountInfo");
  const user_name = localStorage.getItem("accountName");
  try {
    const response = await fetch(
      `${window.location.origin}/api/manga/${id}?user_data=${user_data}&user_name=${user_name}`
    );
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function fetchMalData(title: string): Promise<MalData | null> {
  try {
    const response = await fetch(
      `${window.location.origin}/api/manga/mal?title=${encodeURIComponent(
        title
      )}`
    );
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .trim();
}

function compareTitle(
  origTitle: string,
  titles: { type: string; title: string }[],
  maxDiff: number = 5
): boolean {
  const normalizedOrigTitle = normalizeTitle(origTitle);

  return titles.some(({ title }) => {
    const normalizedTitle = normalizeTitle(title);

    // Check if one title is a substring of the other and at least 50% of the title
    if (
      (normalizedOrigTitle.includes(normalizedTitle) &&
        normalizedTitle.length / normalizedOrigTitle.length >= 0.5) ||
      (normalizedTitle.includes(normalizedOrigTitle) &&
        normalizedOrigTitle.length / normalizedTitle.length >= 0.5)
    ) {
      return true;
    }
    // Check Levenshtein distance
    return distance(normalizedOrigTitle, normalizedTitle) <= maxDiff;
  });
}

async function checkIfBookmarked(
  mangaId: string,
  setIsBookmarked: (value: boolean) => void
) {
  const user_data = localStorage.getItem("accountInfo");

  if (!user_data) {
    console.error("User data not found");
    setIsBookmarked(false);
    return;
  }

  const response = await fetch(
    `/api/bookmarks/${mangaId}?user_data=${encodeURIComponent(user_data)}`
  );
  const data = await response.json();

  setIsBookmarked(data.isBookmarked);
}

async function bookmark(
  storyData: string,
  isBookmarked: boolean,
  setIsBookmarked: (value: boolean) => void
) {
  if (isBookmarked) {
    return;
  }
  const user_data = localStorage.getItem("accountInfo");

  if (!user_data) {
    console.error("User data not found");
    setIsBookmarked(false);
    return;
  }

  const response = await fetch("/api/bookmarks/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_data: user_data,
      story_data: storyData,
    }),
  });
  const data = await response.json();
  console.log(data);

  if (data.result === "ok") {
    setIsBookmarked(true);
  } else {
    setIsBookmarked(false);
  }
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "ongoing":
      return "bg-green-500";
    case "completed":
      return "bg-blue-500";
    case "hiatus":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

const getViewsColor = (views: string) => {
  const viewsNum =
    parseFloat(views.replace(/K|M/, "")) *
    (views.includes("M") ? 1_000_000 : 1_000);

  if (viewsNum < 100_000) return { bg: "bg-orange-500", text: "text-white" };
  else if (viewsNum < 1_000_000)
    return { bg: "bg-yellow-500", text: "text-black" };
  else if (viewsNum < 10_000_000)
    return { bg: "bg-teal-500", text: "text-white" };
  else if (viewsNum < 100_000_000)
    return { bg: "bg-violet-500", text: "text-white" };

  return { bg: "bg-green-500", text: "text-white" };
};

const formatDate = (date: string) => {
  const dateArray = date.split(",");
  const year = dateArray[1].split("-")[0].trim();
  return dateArray[0] + ", " + year;
};

const formatChapterDate = (date: string) => {
  const dateArray = date.split(",");
  return `${dateArray[0]}, ${dateArray[1].split(" ").shift()}`;
};

export function MangaDetailsComponent({ id }: { id: string }) {
  const [manga, setManga] = useState<Manga | null>(null);
  const [bmData, setBmData] = useState<String | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const chaptersPerPage = 24;

  async function removeBookmark(setIsBookmarked: (value: boolean) => void) {
    const user_data = localStorage.getItem("accountInfo");

    if (!user_data) {
      console.error("User data not found");
      return;
    }

    const response = await fetch("/api/bookmarks/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_data: user_data,
        bm_data: bmData,
      }),
    });
    const data = await response.json();
    if (data.result === "ok") {
      setIsBookmarked(false);
    }
  }

  useEffect(() => {
    // Fetch manga details
    const loadManga = async () => {
      setIsLoading(true);
      const settings = JSON.parse(localStorage.getItem("settings") || "{}");
      const bmDataArr = JSON.parse(localStorage.getItem("bm_data") || "{}");
      const data = await fetchManga(id);
      const malData = await fetchMalData(data?.name || "");
      setBmData(bmDataArr[data?.mangaId || 0]);
      if (data) {
        setManga(data);
        setIsLoading(false);
        checkIfBookmarked(data.mangaId, setIsBookmarked);
        if (
          malData &&
          compareTitle(data.name, malData.titles) &&
          settings.fetchMalImage
        ) {
          console.log(data.name, malData.titles);
          data.imageUrl = malData.imageUrl;
        }
        document.title = data?.name;
      } else {
        setError("Failed to load manga details");
        setIsLoading(false);
      }
    };

    // Fetch bookmark status
    if (!manga) {
      loadManga();
    }
  }, [id]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  };

  const sortedChapters = manga?.chapterList
    .filter((chapter, index, self) => {
      const ids = self.map((ch) => ch.id);
      return ids.indexOf(chapter.id) === index;
    })
    .slice()
    .sort((a, b) => {
      const extractChapterNumber = (name: string) => {
        const match = name.replace("-", ".").match(/[Cc]hapter\s(\d+)(\.\d+)?/);
        return match ? parseFloat(match[1] + (match[2] || "")) : 0;
      };

      const chapterA = extractChapterNumber(a.name);
      const chapterB = extractChapterNumber(b.name);

      return sortOrder === "asc" ? chapterA - chapterB : chapterB - chapterA;
    });

  const totalPages = sortedChapters
    ? Math.ceil(sortedChapters.length / chaptersPerPage)
    : 0;
  const currentChapters = sortedChapters?.slice(
    (currentPage - 1) * chaptersPerPage,
    currentPage * chaptersPerPage
  );

  if (isLoading) return <CenteredSpinner />;
  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
    );
  if (!manga)
    return <div className="container mx-auto px-4 py-8">Manga not found</div>;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-8 items-stretch h-auto">
        <div className="flex-shrink-0 relative h-128">
          <img
            src={manga.imageUrl}
            alt={manga.name}
            className="rounded-lg shadow-lg object-cover h-full w-auto max-w-lg"
          />
        </div>

        {/* Card with flex layout to lock title and buttons */}
        <Card className="p-6 flex flex-col justify-between flex-grow">
          {/* Title stays at the top */}
          <h1 className="text-3xl font-bold mb-4 border-b pb-2">
            {manga.name}
          </h1>

          {/* Middle section grows as needed */}
          <div className="flex flex-col md:flex-row gap-8 flex-grow">
            {/* Left section for the manga details */}
            <div className="md:w-1/2 flex flex-col justify-between">
              <div>
                <div className="text-lg mb-2">
                  Authors:
                  {manga.authors.map((author) => (
                    <Badge
                      key={author}
                      className="bg-primary text-secondary ml-2"
                    >
                      <Link
                        href={`/author/${encodeURIComponent(
                          author.replaceAll(" ", "_")
                        )}`}
                        className="hover:underline"
                      >
                        {author}
                      </Link>
                    </Badge>
                  ))}
                </div>
                <div className="text-lg mb-2 flex items-center">
                  Status:
                  <Badge
                    className={`${getStatusColor(
                      manga.status
                    )} text-white ml-2`}
                  >
                    {manga.status}
                  </Badge>
                </div>
                <div className="text-lg mb-2 flex items-center">
                  Updated:
                  <Badge className="bg-gray-200 text-gray-800 ml-2">
                    {formatDate(manga.updated)}
                  </Badge>
                </div>
                <div className="text-lg mb-2 flex items-center">
                  Views:
                  <Badge
                    className={`${getViewsColor(manga.view).bg} ${
                      getViewsColor(manga.view).text
                    } ml-2`}
                  >
                    {manga.view}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col h-full">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Genres:</h2>
                  <div className="flex flex-wrap gap-2">
                    {manga.genres.map((genre) => (
                      <Link
                        key={genre}
                        href={`/genre/${encodeURIComponent(
                          genre.replaceAll(" ", "_")
                        )}`}
                      >
                        <Badge
                          variant="outline"
                          className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                        >
                          {genre}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="mt-4 mb-4 flex-grow h-full">
                  <ScoreDisplay score={manga.score} />
                </div>
              </div>

              {/* Bookmark and Start Reading Buttons */}
              <div className="flex gap-4 mt-auto">
                {/* Toggle bookmark button based on bookmark status */}
                <BookmarkButton
                  isBookmarked={isBookmarked}
                  manga={manga}
                  bookmark={bookmark}
                  removeBookmark={removeBookmark}
                  setIsBookmarked={setIsBookmarked}
                />
                <Button
                  size="lg"
                  className="w-full"
                  asChild
                  disabled={!manga.chapterList.length}
                >
                  {manga.chapterList.length ? (
                    <Link
                      href={`${window.location.pathname}/${
                        manga.chapterList[manga.chapterList.length - 1].id
                      }`}
                    >
                      Start Reading
                    </Link>
                  ) : (
                    <p>No Chapters</p>
                  )}
                </Button>
              </div>
            </div>

            {/* Right section for the description */}
            <div className="md:w-1/2 flex-grow">
              <Card className="w-full h-full p-4 max-h-[25.05rem] overflow-y-auto">
                <p>{manga.description}</p>
              </Card>
            </div>
          </div>
        </Card>
      </div>

      {/* Remaining content */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Chapters</h2>
        <Button variant="outline" onClick={toggleSortOrder}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {currentChapters?.map((chapter) => (
          <Link
            href={`${window.location.pathname}/${chapter.id}`}
            key={chapter.id}
          >
            <Card className="h-full hover:bg-accent transition-colors">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">
                  {chapter.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Views: {chapter.view}
                </p>
                <p className="text-sm text-muted-foreground">
                  Released: {formatChapterDate(chapter.createdAt)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <PaginationElement
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={setCurrentPage}
        />
      )}
    </main>
  );
}
