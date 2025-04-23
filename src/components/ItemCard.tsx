
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ItemCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  condition: string;
  ownerId: string;
  ownerName: string;
  createdAt: string;
}

const ItemCard: React.FC<ItemCardProps> = ({
  id,
  title,
  description,
  image,
  category,
  condition,
  ownerName,
  createdAt
}) => {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
      <Link to={`/items/${id}`} className="block h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </Link>
      <CardContent className="pt-4 flex-1">
        <div className="flex justify-between items-start mb-2">
          <Link
            to={`/items/${id}`}
            className="text-lg font-semibold hover:text-swapspace-primary transition-colors line-clamp-1"
          >
            {title}
          </Link>
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
            {condition}
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center">
          <span className="bg-swapspace-primary bg-opacity-10 text-swapspace-primary text-xs font-medium px-2 py-1 rounded">
            {category}
          </span>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 text-xs text-gray-500 flex justify-between items-center">
        <span>Listed by {ownerName}</span>
        <span>{formattedDate}</span>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
