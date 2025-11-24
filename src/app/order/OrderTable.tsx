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
      <div className="lg:hidden space-y-3">
        {/* Products */}
        <div className="space-y-2.5">
          {order.products.map((product: Product, index: number) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <div className="flex gap-3">
                {/* Product Image */}
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    className="object-contain p-1.5"
                  />
                  <div className="absolute -top-1.5 -left-1.5 h-5 w-5 sm:h-6 sm:w-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shadow">
                    {index + 1}
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h4 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2 leading-tight">
                    {product.name}
                  </h4>

                  {/* Variations - Compact */}
                  {(product.variation?.color || product.variation?.size) && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      {product.variation?.color && (
                        <span className="px-2 py-0.5 bg-gray-100 rounded">
                          {product.variation.color}
                        </span>
                      )}
                      {product.variation?.size && (
                        <span className="px-2 py-0.5 bg-gray-100 rounded">
                          {product.variation.size}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price Info - Horizontal */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-gray-500">
                        Qty: <span className="font-semibold text-gray-900">×{product.quantity}</span>
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">
                        ৳{product.unitPrice.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      ৳{product.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card for Mobile - Minimal & Elegant */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mt-4">
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">
                ৳{order.totalPrice.toFixed(2)}
              </span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-green-600">
                  -৳{order.discount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Delivery</span>
              <span className="font-medium text-gray-900">
                ৳{order.deliveryCharge.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Paid</span>
              <span className="font-medium text-gray-900">
                ৳{order.paid.toFixed(2)}
              </span>
            </div>

            <Separator className="my-2" />

            <div className="flex justify-between items-center pt-1">
              <span className="text-base font-bold text-gray-900">
                Amount Due
              </span>
              <span className="text-lg font-bold text-primary">
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
