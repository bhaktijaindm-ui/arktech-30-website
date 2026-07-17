"use client";
import { WorldMap } from "@/components/ui/world-map";
import { motion } from "framer-motion";

export function WorldMapDemo() {
  return (
    <div className="py-24 dark:bg-zinc-950 bg-stone-50 w-full rounded-xl border border-stone-200 dark:border-zinc-800 my-8">
      <div className="max-w-3xl mx-auto text-center px-6 mb-12">
        <p className="font-serif text-3xl md:text-4.5rem dark:text-white text-stone-900 font-light leading-tight">
          National{" "}
          <span className="text-stone-400 font-extralight italic">
            {"Presence".split("").map((word, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.05, ease: "easeOut" }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </p>
        <p className="text-sm md:text-base text-stone-500 max-w-xl mx-auto mt-4 font-sans font-light leading-relaxed">
          From our design studio in Ludhiana, we shape legacies across India. Delivering luxury residential villas, efficient corporate offices, and eco-resorts nationwide.
        </p>
      </div>
      <WorldMap
        dots={[
          {
            // Ludhiana HQ to Srinagar (Luxury Hillside Estate)
            start: { lat: 30.9010, lng: 75.8573 },
            end: { lat: 34.0837, lng: 74.7973 }
          },
          {
            // Ludhiana HQ to New Delhi (Corporate Headquarters)
            start: { lat: 30.9010, lng: 75.8573 },
            end: { lat: 28.6139, lng: 77.2090 }
          },
          {
            // Ludhiana HQ to Mumbai (Seafront Residences)
            start: { lat: 30.9010, lng: 75.8573 },
            end: { lat: 19.0760, lng: 72.8777 }
          },
          {
            // Ludhiana HQ to Bengaluru (Hospitality Eco-Resort)
            start: { lat: 30.9010, lng: 75.8573 },
            end: { lat: 12.9716, lng: 77.5946 }
          },
          {
            // Ludhiana HQ to Kolkata (Heritage Master Plan)
            start: { lat: 30.9010, lng: 75.8573 },
            end: { lat: 22.5726, lng: 88.3639 }
          }
        ]}
        lineColor="#C9A45C" // Matching Luxury Gold Theme
      />
    </div>
  );
}
