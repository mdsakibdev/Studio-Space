
"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Autoplay,
    EffectFade,
    Pagination,
} from "swiper/modules";

import {
    ArrowRight,
    ArrowUpRight,
    Camera,
    Play,
} from "lucide-react";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

// Static hero slide data
const slides = [
    {
        id: 1,
        tag: "CREATIVE SPACES, ENDLESS POSSIBILITIES",
        title: "Find the Perfect Space to Create Something Amazing.",
        description:
            "Discover inspiring photography studios, film stages, podcast rooms and creative spaces designed to bring your ideas to life.",
        image:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=90",
    },
    {
        id: 2,
        tag: "YOUR VISION, YOUR SPACE",
        title: "A Better Space Makes Every Story Better.",
        description:
            "From professional photography setups to cinematic production stages, find the right environment for your next big project.",
        image:
            "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=2000&q=90",
    },
    {
        id: 3,
        tag: "CREATE WITHOUT LIMITS",
        title: "Turn Your Creative Ideas Into Reality.",
        description:
            "Explore unique creative spaces, connect with hosts and book the perfect studio for your next production.",
        image:
            "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=2000&q=90",
    },
];

export default function HeroSlider() {
    return (
        <section className="relative w-full overflow-hidden bg-neutral-950">
            <Swiper
                modules={[Autoplay, EffectFade, Pagination]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop
                speed={1000}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                pagination={{
                    clickable: true,
                    el: ".studio-hero-pagination",
                }}
                className="studio-hero-swiper"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div
                            className="relative flex min-h-155 items-center bg-cover bg-center bg-no-repeat sm:min-h-170 lg:min-h-185"
                            style={{
                                backgroundImage: `
                  linear-gradient(
                    90deg,
                    rgba(10, 10, 10, 0.95) 0%,
                    rgba(10, 10, 10, 0.78) 45%,
                    rgba(10, 10, 10, 0.25) 100%
                  ),
                  url('${slide.image}')
                `,
                            }}
                        >
                            {/* Hero content */}
                            <div className="mx-auto w-full max-w-360 px-5 py-24 sm:px-8 lg:px-12">
                                <div className="max-w-3xl">
                                    {/* Small label */}
                                    <div className="mb-6 flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6a75c]/40 bg-[#d6a75c]/10 text-[#d6a75c]">
                                            <Camera size={19} />
                                        </span>

                                        <span className="text-xs font-semibold tracking-[0.2em] text-[#d6a75c] sm:text-sm">
                                            {slide.tag}
                                        </span>
                                    </div>

                                    {/* Heading */}
                                    <h1 className="max-w-3xl text-4xl leading-[1.15] font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
                                        {slide.title}
                                    </h1>

                                    {/* Description */}
                                    <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-300 sm:text-lg">
                                        {slide.description}
                                    </p>

                                    {/* CTA buttons */}
                                    <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                                        <Link
                                            href="/studios"
                                            className="group inline-flex items-center justify-center gap-3 rounded-lg bg-[#d6a75c] px-7 py-4 text-sm font-bold text-neutral-950 transition-all duration-300 hover:bg-[#e7bd7b]"
                                        >
                                            Explore Studios
                                            <ArrowRight
                                                size={18}
                                                className="transition-transform group-hover:translate-x-1"
                                            />
                                        </Link>

                                        <Link
                                            href="/studios"
                                            className="group inline-flex items-center justify-center gap-3 rounded-lg border border-white/30 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-[#d6a75c] hover:bg-white/10"
                                        >
                                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                                                <Play size={13} fill="currentColor" />
                                            </span>
                                            Host Your Space
                                            <ArrowUpRight
                                                size={17}
                                                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                                            />
                                        </Link>
                                    </div>

                                    {/* Bottom message */}
                                    <div className="mt-12 flex items-center gap-3 text-sm text-neutral-400">
                                        <span className="h-px w-10 bg-[#d6a75c]" />
                                        Discover. Create. Inspire.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Slider pagination */}
            <div className="studio-hero-pagination absolute! bottom-8! left-0! z-20 flex justify-center gap-2" />
        </section>
    );
}
