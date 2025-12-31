import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";

interface ProductRatingProps {
  rating: number; // nilai average_rating dari DB
  count: number; // nilai review_count dari DB
  size?: number;
}

export const ProductRating = ({
  rating,
  count,
  size = 16,
}: ProductRatingProps) => {
  // Logika untuk merender bintang
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        // Bintang Penuh
        stars.push(
          <AiFillStar key={i} size={size} className="text-yellow-400" />
        );
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        // Bintang Setengah (Jika desimal)
        stars.push(
          <BsStarHalf key={i} size={size} className="text-yellow-400" />
        );
      } else {
        // Bintang Kosong
        stars.push(
          <AiOutlineStar key={i} size={size} className="text-zinc-300" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">{renderStars()}</div>
      <span className="text-xs font-medium text-zinc-500 mt-0.5">
        ({count > 0 ? count : 0} reviews)
      </span>
    </div>
  );
};
