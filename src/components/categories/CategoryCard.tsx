import Image from "next/image";
import Link from "next/link";

interface CategoryProps {
  category: {
    id: number;
    name: string;
    image: string;
    slug: string;
  };
}

const CategoryCard = ({ category }: CategoryProps) => {
  return (
    <Link href={`categories/${category.slug}`} className="block group">
      <div className="relative overflow-hidden rounded-lg aspect-square">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white font-medium">
          {category.name}
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard; 