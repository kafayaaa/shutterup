import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";

export default function Footer() {
  const socialLinks = [
    {
      name: "Instagram",
      icon: FaInstagram,
      href: "https://instagram.com",
    },
    {
      name: "Tiktok",
      icon: FaTiktok,
      href: "https://tiktok.com",
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      href: "https://facebook.com",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      href: "https://whatsapp.com",
    },
  ];
  return (
    <div className="w-full bg-linear-to-bl from-teal-400 to-teal-700 [clip-path:polygon(0_0,100%_10%,100%_100%,0_100%)] md:[clip-path:polygon(0_0,100%_50%,100%_100%,0_100%)]">
      <div className="px-12 pt-10 md:pt-40 pb-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center gap-5">
        <div className="w-full py-5 flex flex-col md:flex-row justify-between gap-10 md:gap-25">
          <div className="flex flex-col items-center justify-center gap-2">
            <Image
              src={"/shutterup.webp"}
              alt="ShutterUp Logo"
              width={80}
              height={80}
            />
            <span className="text-2xl font-extrabold font-fira-code">
              ShutterUp
            </span>
          </div>
          <div>
            <p className="text-justify">
              ShutterUp is a modern e-commerce platform offering a wide range of
              quality cameras, lenses, and photography equipment for beginners
              and professional photographers. With a trusted product curation, a
              clean and intuitive interface, and a fast and secure shopping
              experience, ShutterUp helps you find the best gear to capture
              every moment with precision and creativity.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-xl font-bold">Find us on</h2>
            <div className="flex items-center gap-5">
              {socialLinks.map(({ name, icon: Icon, href }) => (
                <Link
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="p-2 rounded-full bg-zinc-50 hover:bg-zinc-50/80 flex items-center justify-center transition"
                >
                  <Icon className="text-2xl text-teal-500" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
