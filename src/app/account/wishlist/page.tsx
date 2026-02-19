"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Filter,
  Share2,
  Download,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

import { useWishlist, WishlistItem } from "@/context/WishlistContext";
// import { CartItem, useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist, isLoading } =
    useWishlist();
  // const { addToCart } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("date_added");
  const [filterBy, setFilterBy] = useState("all");

  // Real availability check
  const checkAvailability = (item: WishlistItem) => {
    return item.inStock;
  };

  const filteredAndSortedWishlist = wishlist
    .filter((item) => {
      if (filterBy === "all") return true;
      if (filterBy === "in_stock") return checkAvailability(item);
      if (filterBy === "out_of_stock") return !checkAvailability(item);
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date_added":
          return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          );
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredAndSortedWishlist.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredAndSortedWishlist.map((item) => item.id));
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    const result = await Swal.fire({
      title: "Remove from Wishlist?",
      text: "This item will be removed from your wishlist",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Remove",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const success = await removeFromWishlist(itemId);
      if (success) {
        setSelectedItems((prev) => prev.filter((id) => id !== itemId));
        Swal.fire({
          title: "Removed!",
          text: "Item removed from wishlist",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }
  };

  // const handleAddToCart = (item: WishlistItem) => {
  //   if (!checkAvailability(item)) {
  //     Swal.fire({
  //       title: "Out of Stock",
  //       text: "This item is currently out of stock",
  //       icon: "warning",
  //     });
  //     return;
  //   }

  //   // Convert wishlist item to cart item format
  //   const cartItem: CartItem = {
  //     id: item.id,
  //     sku: item.sku || item.id,
  //     name: item.name,
  //     active: true,
  //     quantity: 1,
  //     unitPrice: item.price,
  //     manufactureId: "",
  //     updatedPrice: item.originalPrice,
  //     hasDiscount: item.discountPercentage ? true : false,
  //     discountType: "percentage",
  //     discount: item.discountPercentage || 0,
  //     description: item.description || "",
  //     thumbnail: item.thumbnail,
  //     productCode: item.sku || item.id,
  //     totalPrice: item.price,
  //     categoryName: item.category,
  //     hasVariation: false,
  //     variation: item?.variation,
  //     maxQuantity: 10,
  //   };

  //   addToCart(cartItem);
  //   Swal.fire({
  //     title: "Added to Cart! 🛒",
  //     text: `${item.name} has been added to your cart`,
  //     icon: "success",
  //     timer: 2000,
  //     showConfirmButton: false,
  //   });
  // };

  // const handleBulkAddToCart = async () => {
  //   const selectedWishlistItems = wishlist.filter(
  //     (item) => selectedItems.includes(item.id) && checkAvailability(item)
  //   );

  //   if (selectedWishlistItems.length === 0) {
  //     Swal.fire({
  //       title: "No Items Available",
  //       text: "Selected items are not available for purchase",
  //       icon: "warning",
  //     });
  //     return;
  //   }

  //   selectedWishlistItems.forEach((item) => {
  //     const cartItem = {
  //       id: item.id,
  //       sku: item.sku || item.id,
  //       name: item.name,
  //       active: true,
  //       quantity: 1,
  //       unitPrice: item.price,
  //       manufactureId: "",
  //       updatedPrice: item.originalPrice,
  //       hasDiscount: item.discountPercentage ? true : false,
  //       discountType: "percentage",
  //       discount: item.discountPercentage || 0,
  //       description: item.description || "",
  //       thumbnail: item.thumbnail,
  //       productCode: item.sku || item.id,
  //       totalPrice: item.price,
  //       categoryName: item.category,
  //       hasVariation: false,
  //       variation: { id: "", name: "", value: "" },
  //       maxQuantity: 10,
  //     };
  //     addToCart(cartItem);
  //   });

  //   setSelectedItems([]);
  //   Swal.fire({
  //     title: "Added to Cart! 🛒",
  //     text: `${selectedWishlistItems.length} items added to your cart`,
  //     icon: "success",
  //     timer: 2000,
  //     showConfirmButton: false,
  //   });
  // };

  const handleClearWishlist = async () => {
    const result = await Swal.fire({
      title: "Clear Wishlist?",
      text: "This will remove all items from your wishlist. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Clear All",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    });

    if (result.isConfirmed) {
      const success = await clearWishlist();
      if (success) {
        setSelectedItems([]);
        Swal.fire({
          title: "Wishlist Cleared!",
          text: "All items have been removed from your wishlist",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }
  };

  const WishlistItemCard = ({ item }: { item: WishlistItem }) => {
    const isAvailable = checkAvailability(item);
    const isSelected = selectedItems.includes(item.id);

    return (
      <Card
        className={`transition-all duration-200 ${
          isSelected ? "ring-2 ring-blue-500" : ""
        }`}>
        <CardContent className='p-4'>
          <div className='flex items-start space-x-4'>
            <div className='flex items-center'>
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => handleSelectItem(item.id)}
                className='mr-3'
              />
            </div>

            <div className='relative flex-shrink-0'>
              <div className='h-24 w-24 rounded-lg overflow-hidden bg-neutral-100'>
                <Image
                  src={item.thumbnail}
                  alt={item.name}
                  width={96}
                  height={96}
                  className='h-full w-full object-cover'
                />
              </div>
              {!isAvailable && (
                <div className='absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center'>
                  <AlertCircle className='h-6 w-6 text-white' />
                </div>
              )}
            </div>

            <div className='flex-1 min-w-0'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <h3 className='font-medium text-neutral-900 truncate'>
                    <Link
                      href={`/products/${item?.slug}`}
                      className='hover:text-blue-600'>
                      {item.name}
                    </Link>
                  </h3>

                  <div className='flex items-center space-x-2 mt-2'>
                    <span className='text-lg font-semibold text-neutral-900'>
                      ৳{item.price}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <>
                        <span className='text-sm text-neutral-400 line-through'>
                          ৳{item.originalPrice}
                        </span>
                        <Badge variant='secondary' className='text-xs'>
                          {item.discountPercentage}% OFF
                        </Badge>
                      </>
                    )}
                  </div>

                  <div className='flex items-center mt-2'>
                    {isAvailable ? (
                      <Badge className='bg-green-100 text-green-800'>
                        <CheckCircle className='h-3 w-3 mr-1' />
                        In Stock
                      </Badge>
                    ) : (
                      <Badge className='bg-red-100 text-red-800'>
                        <X className='h-3 w-3 mr-1' />
                        Out of Stock
                      </Badge>
                    )}
                  </div>

                  <p className='text-xs text-neutral-400 mt-2'>
                    Added {new Date(item.dateAdded).toLocaleDateString()}
                  </p>
                </div>

                <div className='flex flex-col space-y-2 ml-4'>
                  {/* <Button
                    size='sm'
                    onClick={() => handleAddToCart(item)}
                    disabled={!isAvailable}
                    className='whitespace-nowrap'>
                    <ShoppingCart className='h-4 w-4 mr-2' />
                    Add to Cart
                  </Button> */}

                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handleRemoveItem(item.id)}
                    className='whitespace-nowrap'>
                    <Trash2 className='h-4 w-4 mr-2' />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-neutral-900'>My Wishlist</h1>
            <p className='text-neutral-600'>Items you&apos;ve saved for later</p>
          </div>
        </div>

        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className='p-4'>
                <div className='animate-pulse flex space-x-4'>
                  <div className='h-24 w-24 bg-neutral-200 rounded-lg'></div>
                  <div className='flex-1 space-y-2'>
                    <div className='h-4 bg-neutral-200 rounded w-3/4'></div>
                    <div className='h-3 bg-neutral-200 rounded w-1/2'></div>
                    <div className='h-4 bg-neutral-200 rounded w-1/4'></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-neutral-900'>My Wishlist</h1>
          <p className='text-neutral-600'>Items you&apos;ve saved for later</p>
        </div>
        <div className='text-sm text-neutral-500'>
          {filteredAndSortedWishlist.length} item
          {filteredAndSortedWishlist.length !== 1 ? "s" : ""}
        </div>
      </div>

      {wishlist.length > 0 && (
        <>
          {/* Controls */}
          <Card>
            <CardContent className='p-4'>
              <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
                <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      checked={
                        selectedItems.length ===
                          filteredAndSortedWishlist.length &&
                        filteredAndSortedWishlist.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                    <span className='text-sm font-medium'>
                      Select All ({selectedItems.length} selected)
                    </span>
                  </div>

                  {/* {selectedItems.length > 0 && (
                    <div className='flex space-x-2'>
                      <Button size='sm' onClick={handleBulkAddToCart}>
                        <ShoppingCart className='h-4 w-4 mr-2' />
                        Add Selected to Cart
                      </Button>
                    </div>
                  )} */}
                </div>

                <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
                  <div className='flex items-center space-x-4'>
                    <Select value={filterBy} onValueChange={setFilterBy}>
                      <SelectTrigger className='w-40'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Items</SelectItem>
                        <SelectItem value='in_stock'>In Stock</SelectItem>
                        <SelectItem value='out_of_stock'>
                          Out of Stock
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className='w-48'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='date_added'>Date Added</SelectItem>
                        <SelectItem value='name'>Name</SelectItem>
                        <SelectItem value='price_low'>
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value='price_high'>
                          Price: High to Low
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='flex space-x-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      disabled
                      className='hidden'>
                      <Share2 className='h-4 w-4 mr-2' />
                      Share
                    </Button>

                    {wishlist.length > 0 && (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={handleClearWishlist}
                        className='text-red-600 hover:text-red-700 hover:bg-red-50'>
                        <Trash2 className='h-4 w-4 mr-2' />
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wishlist Items */}
          {filteredAndSortedWishlist.length > 0 ? (
            <div className='space-y-4'>
              {filteredAndSortedWishlist.map((item) => (
                <WishlistItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className='p-12 text-center'>
                <Filter className='h-16 w-16 text-neutral-400 mx-auto mb-4' />
                <h3 className='text-lg font-medium text-neutral-900 mb-2'>
                  No items match your filters
                </h3>
                <p className='text-neutral-500 mb-4'>
                  Try adjusting your filter settings
                </p>
                <Button
                  onClick={() => {
                    setFilterBy("all");
                    setSortBy("date_added");
                  }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Empty State */}
      {wishlist.length === 0 && (
        <Card>
          <CardContent className='p-12 text-center'>
            <Heart className='h-16 w-16 text-neutral-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-neutral-900 mb-2'>
              Your wishlist is empty
            </h3>
            <p className='text-neutral-500 mb-6'>
              Save items you love to your wishlist and shop them later
            </p>
            <Link href='/'>
              <Button>
                <ShoppingCart className='h-4 w-4 mr-2' />
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WishlistPage;
