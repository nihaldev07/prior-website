import { Card, CardContent } from "@/components/ui/card";
import { classNames } from "@/lib/utils";
import Image from "next/image";

interface IProps {
  categories: {
    id: string;
    name: string;
    img: string;
  }[];
}
const Category: React.FC<IProps> = ({ categories }) => {
  return (
    <div
      className={classNames(
        "container justify-center grid my-4",
        `${
          categories.length === 1
            ? "grid-cols-1 hidden"
            : categories.length === 2
            ? "grid-cols-2 gap-2 md:gap-20"
            : categories.length === 3
            ? "grid-cols-3 gap-2 md:gap-6"
            : "grid-cols-2 md:grid-cols-4"
        }`
      )}
    >
      {!!categories &&
        categories.map((item: any, index: number) => (
          <Card
            key={index}
            className="bg-white border border-gray-300 rounded-md flex justify-between items-center"
          >
            <CardContent className=" p-6 w-full flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900 truncate max-w-[80%] uppercase">
                {item?.name}
              </span>
              <div className="ml-auto float-right rounded-full bg-white h-12 w-12 flex justify-center items-center">
                <Image
                  width={32}
                  height={32}
                  src={item?.img}
                  alt="category"
                  className=" object-fill"
                />
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default Category;
