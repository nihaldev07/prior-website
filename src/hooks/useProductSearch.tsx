import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "@/lib/config";
import useDebounce from "./useDebounce";

const useSearchProduct = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [products, setProducsts] = useState([]);
  const debounceHandler = useDebounce(inputValue, 500);

  useEffect(() => {
    searchProduct(inputValue);
    //eslint-disable-next-line
  }, [debounceHandler]);

  const searchProduct = async (query: string) => {
    try {
      const response = await axios.get(config.product.searchProducts(), {
        params: {
          query,
        },
      });
      if (response?.status < 300 && !!response?.data) {
        //@ts-ignore
        setProducsts([...response?.data]);
      }
    } catch (e) {
      console.error("error", e);
    }
  };

  return {
    products,
    inputValue,
    setInputValue,
  };
};

export default useSearchProduct;
