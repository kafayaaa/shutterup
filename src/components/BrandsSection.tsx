import Image from "next/image";

export default function BrandsSection() {
  return (
    <div className="w-full max-w-11/12 md:max-w-7xl mx-auto py-10 space-y-10">
      <h1 className="max-w-60 md:max-w-full mx-auto text-2xl md:text-4xl font-extrabold font-fira-code text-center">
        Find Your Favourite Brand
      </h1>
      <div className="px-5 md:px-0 grid grid-cols-2 md:grid-cols-5 gap-5">
        {[
          //   "/brands/7artisans1.webp",
          "/brands/canon.webp",
          "/brands/fujifilm1.webp",
          "/brands/hasselblad.webp",
          "/brands/leica.webp",
          "/brands/nikon.webp",
          "/brands/panasonic.webp",
          "/brands/sigma.webp",
          "/brands/sony.webp",
          "/brands/ttartisan.webp",
          "/brands/viltrox.webp",
        ].map((src, index) => (
          <div
            key={index}
            className="col-span-1 min-h-20 md:min-h-28 px-5 py-3 flex items-center justify-center bg-white/5 border border-white/20 inset-shadow-xs inset-shadow-white/50 rounded-lg shadow-[0_0.2rem_0.5rem_rgba(0,0,0,0.35)] hover:shadow-[0_1rem_0.75rem_rgba(0,0,0,0.35)] backdrop-blur-lg hover:-translate-y-3 transition-all duration-300 ease-in-out cursor-pointer"
          >
            <Image
              src={src}
              alt=""
              width={200}
              height={200}
              className="w-full h-full max-h-8/12 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
