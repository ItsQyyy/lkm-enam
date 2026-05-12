"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import TextHeading from "../ui/TextHeading";
import Image from "next/image";

export interface TeamMember {
  id: number;
  name: string;
  nim: string;
  role: string;
  skills: string[];
  image: string;
}

export const teamData: TeamMember[] = [
  {
    id: 1,
    name: "Muhammad Azka Fakhri Fairuz",
    nim: "257006111019",
    // role: "Lead Project",
    role: "",
    skills: ["Designer", "Full Stack Developer"],
    image: "", 
  },
    {
    id: 2,
    name: "Muhammad Azka Fakhri Fairuz",
    nim: "257006111020",
    // role: "Lead Developer",
    role: "",
    skills: ["Full Stack Developer", "UI/UX Designer"],
    image: "",
    },
    {
    id: 3,
    name: "Muhammad Azka Fakhri Fairuz",
    nim: "257006111021",
    // role: "UI/UX Designer",
    role: "",
    skills: ["UI/UX Designer", "Frontend Developer"],
    image: "",
    },
];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Team() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const scrollContainer = scrollContainerRef.current;

        if (!section || !scrollContainer) return;

        section.id = "horizontal-projects-section";

        const initScrollTrigger = () => {
            const ctx = gsap.context(() => {
                const scrollWidth = scrollContainer.scrollWidth - window.innerWidth;

                const introduceSection =
                    document.getElementById("introduce-section") ||
                    document.querySelector('[ref="containerRef"]');

                let offsetY = 0;
                if (introduceSection) {
                    const introduceScrollHeight =
                        introduceSection.scrollHeight || window.innerHeight;
                    offsetY = introduceScrollHeight * 2;
                }

                gsap.to(scrollContainer, {
                    x: -scrollWidth,
                    ease: "none",
                    scrollTrigger: {
                        id: "horizontal-projects-section",
                        trigger: section,
                        start: () => `5% top+=${offsetY}`,
                        end: () => `+=${scrollWidth * 2}`,
                        scrub: 1.5,
                        pin: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                        pinSpacing: true,
                        refreshPriority: -1,
                    },
                });
            }, section);

            return ctx;
        };

        const timeoutId = setTimeout(() => {
            const ctx = initScrollTrigger();

            window.addEventListener("load", () => {
                ScrollTrigger.refresh();
            });

            return () => {
                ctx?.revert();
                ScrollTrigger.getById("horizontal-projects-section")?.kill();
            };
        }, 100);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen bg-white overflow-hidden"
        >
            <div
                ref={scrollContainerRef}
                className="flex items-center h-screen"
                style={{ width: "fit-content" }}
            >
                {/* ── Title Section ─────────────────────────────────────────────── */}
                <div
                    ref={titleRef}
                    className="shrink-0 w-[85vw] sm:w-[60vw] md:w-[50vw] lg:w-[35vw] px-6 sm:px-10 md:px-16 lg:px-20 mr-4 sm:mr-8 md:mr-12 lg:mr-16 z-10"
                >
                    <TextHeading subtitle="Tim" title="Penyusun" titleItalic={true} />
                    <p className="mt-4 sm:mt-5 lg:mt-6 text-gray-600 leading-relaxed text-xs sm:text-sm md:text-sm lg:text-base">
                        Kami adalah sekumpulan mahasiswa yang membangun VI-sion dengan semangat dan secangkir kopi ☕
                    </p>
                </div>

                {/* ── Team Cards ────────────────────────────────────────────────── */}
                <div className="flex gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                    {teamData.map((member, index) => (
                        <div key={member.id} className="flex gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
                            <TeamCard member={member} />
                            {index < teamData.length - 1 && (
                                <div className="h-48 sm:h-56 md:h-64 lg:h-80 w-px bg-gray-400 shrink-0" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="w-[15vw] shrink-0" />
            </div>
        </section>
    );
}

// ── Card Component ─────────────────────────────────────────────────────────────
interface TeamCardProps {
    member: TeamMember;
}

export function TeamCard({ member }: TeamCardProps) {
    const imageRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isVideo = member.image.endsWith(".mp4") || member.image.endsWith(".webm");

    const handleMouseEnter = () => {
        if (!imageRef.current) return;
        gsap.to(imageRef.current, {
            scale: 1.06,
            duration: 0.4,
            ease: "power2.out",
        });
        if (isVideo && videoRef.current) {
            videoRef.current.play().catch(() => { });
        }
    };

    const handleMouseLeave = () => {
        if (!imageRef.current) return;
        gsap.to(imageRef.current, {
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
        });
        if (isVideo && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <div className="shrink-0 flex flex-row items-start gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-[78vw] sm:w-[50vw] md:w-[42vw] lg:w-[34vw]">

            {/* ── Media (Video atau Gambar) ─────────────────────────────── */}
            <div
                ref={imageRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="shrink-0 relative rounded-2xl overflow-hidden bg-gray-200 shadow-sm cursor-pointer w-28 h-36 sm:w-36 sm:h-48 md:w-44 md:h-56 lg:w-60 lg:h-80"
            >
                {isVideo ? (
                    <video
                        src={member.image}
                        autoPlay
                        muted
                        loop
                        playsInline
                        // preload="metadata"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <Image
                        src={member.image}
                        alt={member.name}
                        width={200}
                        height={300}
                        className="absolute inset-0 w-full h-full object-cover"  // ← tambah absolute inset-0
                        loading="lazy"
                    />
                )}
            </div>

            {/* ── Info Teks ─────────────────────────────────────────────── */}
            <div className="flex flex-col justify-start pt-5 gap-1 sm:gap-1.5">

                {/* Nama */}
                <p className="font-bold text-black leading-tight text-sm sm:text-base md:text-xl lg:text-3xl">
                    {member.name}
                </p>

                <div className="flex gap-2 items-center">
                    {/* NIM */}
                    <p className="text-gray-600 italic text-[9px] sm:text-[10px] md:text-xs lg:text-xs">
                        {member.nim}
                    </p>

                    {member.role && (
                        <>
                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                            <p className="text-gray-500 italic text-[9px] sm:text-[10px] md:text-xs lg:text-xs">
                                {member.role}
                            </p>
                        </>
                    )}
                </div>

                {/* Divider */}
                <div className="w-8 h-px bg-gray-300 mt-1 mb-10" />

                {/* Skills */}
                <ul className="flex flex-col gap-0.5">
                    {member.skills.map((skill) => (
                        <li
                            key={skill}
                            className="text-gray-700 text-[10px] sm:text-xs md:text-sm lg:text-sm"
                        >
                            {skill}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}