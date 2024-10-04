export interface Manga {
    mangaId: string;
    identifier: string;
    storyData: string;
    imageUrl: string;
    name: string;
    authors: string[];
    author_urls: string[];
    status: string;
    updated: string;
    view: string;
    score: number;
    genres: string[];
    description: string;
    chapterList: {
        id: string;
        path: string;
        name: string;
        view: string;
        createdAt: string;
    }[];
}

export interface MangaCacheItem {
    bm_data: string;
    id: string;
    last_read: string;
    is_strip: boolean | undefined;
}

export interface HqMangaCacheItem {
    aniUrl: string;
    malUrl: string;
    description: string;
    imageUrl: string;
    score: number;
    titles: { type: string; title: string }[];
    url: string;
}

export interface Bookmark {
    bm_data: string;
    chapter_namenow: string;
    chapter_numbernow: string;
    chapterlastdateupdate: string;
    chapterlastname: string;
    chapterlastnumber: string;
    image: string;
    isread: string;
    link_chapter_last: string;
    link_chapter_now: string;
    link_story: string;
    note_story_id: string;
    note_story_name: string;
    noteid: string;
    storyid: string;
    storyname: string;
    storynameunsigned_storykkl: string;
}

export interface MalSync {
    identifier: string;
    image: string;
    malId: number;
    aniId: number;
    page: string;
    title: string;
    type: string;
    url: string;
    malUrl: string;
    aniUrl: string;
}

export interface Chapter {
    title: string;
    chapter: string;
    chapters: { value: string; label: string }[];
    pages: number;
    parentId: string;
    nextChapter: string;
    lastChapter: string;
    images: string[];
    storyData: string | null;
    chapterData: string | null;
}
