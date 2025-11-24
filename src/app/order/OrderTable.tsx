import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Order, Product } from "./interface";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

interface Props {
  order: Order;
}

const OrderTable: React.FC<Props> = ({ order }) => {
  return (
    <div className="w-full">
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {/* Products */}
        <div className="space-y-3">
          {order.products.map((product: Product, index: number) => (
            <div
              key={product.id}
              className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
            >
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-gray-200">
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                  />
                  <div className="absolute -top-2 -left-2 h-7 w-7 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {index + 1}
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0 space-y-2">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2">
                    {product.name}
                  </h4>

                  {/* Variations */}
                  <div className="flex flex-wrap gap-1.5">
                    {product.variation?.color && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {product.variation.color}
                      </Badge>
                    )}
                    {product.variation?.size && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {product.variation.size}
                      </Badge>
                    )}
                    {!product.variation && (
                      <Badge variant="secondary" className="text-xs">
                        No Variation
                      </Badge>
                    )}
                  </div>

                  {/* Price Info Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div>
                      <p className="text-xs text-gray-500">Qty</p>
                      <p className="text-sm font-semibold text-gray-900">
                        ×{product.quantity}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Unit</p>
                      <p className="text-sm font-semibold text-gray-900">
                        ৳{product.unitPrice.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-sm font-bold text-primary">
                        ৳{product.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card for Mobile */}
        <div className="bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-200 rounded-xl p-5 mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="h-6 w-1 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
            Order Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">
                ৳{order.totalPrice.toFixed(2)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Discount</span>
              <span className="font-semibold text-green-600">
                -৳{order.discount.toFixed(2)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Delivery Charge</span>
              <span className="font-semibold text-gray-900">
                ৳{order.deliveryCharge.toFixed(2)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Paid</span>
              <span className="font-semibold text-gray-900">
                ৳{order.paid.toFixed(2)}
              </span>
            </div>
            <Separator className="bg-indigo-200" />
            <div className="flex justify-between items-center py-2 bg-gradient-to-r from-indigo-50 to-transparent rounded-lg px-3 -mx-3">
              <span className="text-base font-bold text-gray-900">
                Amount Due
              </span>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                ৳{order.remaining.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50">
              <TableHead className="text-center font-bold text-gray-900 w-16">
                #
              </TableHead>
              <TableHead className="text-center font-bold text-gray-900 w-24">
                Image
              </TableHead>
              <TableHead className="font-bold text-gray-900">
                Product Name
              </TableHead>
              <TableHead className="text-center font-bold text-gray-900 w-24">
                Quantity
              </TableHead>
              <TableHead className="text-center font-bold text-gray-900 w-32">
                Unit Price
              </TableHead>
              <TableHead className="text-center font-bold text-gray-900 w-32">
                Total Price
              </TableHead>
              <TableHead className="text-center font-bold text-gray-900 w-40">
                Variation
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.products.map((product: Product, index: number) => (
              <TableRow
                key={product.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <TableCell className="text-center">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-blue-600/10 text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 ring-1 ring-gray-200">
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-gray-900 max-w-md">
                    {product.name}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="secondary"
                    className="font-semibold bg-gray-100 text-gray-900"
                  >
                    ×{product.quantity}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-semibold text-gray-900">
                    ৳{product.unitPrice.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-bold text-primary">
                    ৳{product.totalPrice.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {product.variation?.color && (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200 font-medium"
                      >
                        {product.variation.color}
                      </Badge>
                    )}
                    {product.variation?.size && (
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200 font-medium"
                      >
                        {product.variation.size}
                      </Badge>
                    )}
                    {!product.variation && (
                      <Badge variant="secondary" className="font-medium">
                        No Variation
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {/* Summary Section in Table */}
            <TableRow>
              <TableCell colSpan={7} className="py-0">
                <div className="py-4"></div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-gradient-to-r from-indigo-50 to-transparent">
              <TableCell colSpan={5} />
              <TableCell className="font-bold text-gray-900 text-lg">
                Summary
              </TableCell>
              <TableCell />
            </TableRow>
            <TableRow className="hover:bg-gray-50/50">
              <TableCell colSpan={5} />
              <TableCell className="font-semibold text-gray-700">
                Subtotal
              </TableCell>
              <TableCell className="text-center font-semibold text-gray-900">
                ৳{order.totalPrice.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-gray-50/50">
              <TableCell colSpan={5} />
              <TableCell className="font-semibold text-gray-700">
                Discount
              </TableCell>
              <TableCell className="text-center font-semibold text-green-600">
                -৳{order.discount.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-gray-50/50">
              <TableCell colSpan={5} />
              <TableCell className="font-semibold text-gray-700">
                Delivery Charge
              </TableCell>
              <TableCell className="text-center font-semibold text-gray-900">
                ৳{order.deliveryCharge.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-gray-50/50">
              <TableCell colSpan={5} />
              <TableCell className="font-semibold text-gray-700">
                Paid
              </TableCell>
              <TableCell className="text-center font-semibold text-gray-900">
                ৳{order.paid.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow className="bg-gradient-to-r from-indigo-100 to-transparent hover:from-indigo-200 hover:to-transparent border-t-2 border-indigo-200">
              <TableCell colSpan={5} />
              <TableCell className="font-bold text-gray-900 text-lg">
                Amount Due
              </TableCell>
              <TableCell className="text-center">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  ৳{order.remaining.toFixed(2)}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderTable;
