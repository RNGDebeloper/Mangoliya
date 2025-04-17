import Link from "next/link";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "./ui/tooltip";
import { CookieConsentFooter } from "./ui/cookieConsent";
import pkg from "../../package.json";

export default async function Footer() {
    "use cache";

    const version = pkg.version;
    return (
        <footer className="border-t">
            <div className="mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex justify-center md:order-2 space-x-6">
                        <Link
                            href="/about"
                            className="text-gray-400 hover:text-gray-500"
                            prefetch={false}
                        >
                            About
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-gray-400 hover:text-gray-500"
                            prefetch={false}
                        >
                            Privacy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-gray-400 hover:text-gray-500"
                            prefetch={false}
                        >
                            Terms
                        </Link>
                        <CookieConsentFooter />
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="https://t.me/Uchiha_Developer"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-gray-500"
                                        prefetch={false}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-6 w-6"
                                        >
                                            <path d="M14.5 1.5L0.5 6.5L4.5 8.5L10.5 4.5L6.5 9.5L12.5 13.5L14.5 1.5Z" />
                                        </svg>
                                        <span className="sr-only">
                                            Telegram Channel
                                        </span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    View the source code
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="https://t.me/Uchiha_Developer"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-gray-500"
                                        prefetch={false}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-6 w-6"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <line
                                                x1="12"
                                                y1="8"
                                                x2="12"
                                                y2="12"
                                            />
                                            <line
                                                x1="12"
                                                y1="16"
                                                x2="12.01"
                                                y2="16"
                                            />
                                        </svg>
                                        <span className="sr-only">
                                            Report an issue
                                        </span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Report bugs or request features
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div>
                        <p className="text-center text-base text-gray-400 flex items-center justify-center gap-2">
                            <span>&copy; {new Date().getFullYear()} Mangoliya</span>
                            <span className="h-4 border-r border-gray-400"></span>
                            <span>v{version}</span>
                            <span className="h-4 border-r border-gray-400"></span>
                            <Link
                                href={
                                    "https://www.gnu.org/licenses/agpl-3.0.html"
                                }
                                className="text-gray-400 hover:text-gray-500"
                                prefetch={false}
                            >
                                AGPL-3.0.
                            </Link>
                        </p>
                    </div>
                    <div className="text-center text-sm text-gray-400">
                        <p>
                            Content sourced from Manganato. Not affiliated with
                            Manganato.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
