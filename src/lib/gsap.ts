"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {Draggable} from "gsap/Draggable";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { TextPlugin } from "gsap/TextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Draggable, ScrollToPlugin, TextPlugin);
}

export { gsap, ScrollTrigger, Draggable, ScrollToPlugin, TextPlugin };
