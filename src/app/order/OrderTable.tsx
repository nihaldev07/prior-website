import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Order, Product } from "./interface";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";

interface Props {
  order: Order;
}

const OrderTable: React.FC<Props> = ({ order }) => {
  return (
    <div className="overflow-x-hidden">
      <Table className="w-full border">
        <TableHeader>
          <TableRow>
            <TableCell className="text-center hidden md:table-cell">
              #
            </TableCell>
            <TableCell className="text-center  hidden md:table-cell">
              Product
            </TableCell>
            <TableCell className="text-center">Product Name</TableCell>
            <TableCell className="text-center">Quantity</TableCell>
            <TableCell className="text-center">Unit Price</TableCell>
            <TableCell className="text-center">Total Price</TableCell>
            <TableCell className="text-center">Variation</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.products.map((product: Product, index: number) => (
            <TableRow key={product.id}>
              <TableCell className="text-center  hidden md:table-cell">
                {index + 1}
              </TableCell>
              <TableCell className="text-center  hidden md:table-cell">
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="inline w-12 h-12"
                />
              </TableCell>
              <TableCell className="text-center">{product.name}</TableCell>
              <TableCell className="text-center">{product.quantity}</TableCell>
              <TableCell className="text-center">
                ৳{product.unitPrice.toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                ৳{product.totalPrice.toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                {!!product.variation ? (
                  <div className="space-x-1">
                    {product.variation.color && (
                      <Badge
                        variant={"outline"}
                        className=" bg-blue-100 text-blue-800"
                      >
                        {product.variation.color}
                      </Badge>
                    )}
                    {product.variation.size && (
                      <Badge
                        variant={"outline"}
                        className="badge bg-purple-100 text-purple-800 ml-1"
                      >
                        {product.variation.size}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <Badge variant={"secondary"}>No Variation</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}

          {/* Additional Rows for Total, Discount, Delivery Charge, Paid, Remaining */}
          <TableRow>
            <TableCell colSpan={7} className="hidden md:table-cell" />
            <TableCell colSpan={5} className="md:hidden table-cell" />
          </TableRow>
          <TableRow>
            <TableCell colSpan={5} className="hidden md:table-cell" />
            <TableCell colSpan={3} className="md:hidden table-cell" />
            <TableCell
              colSpan={1}
              className="text-left text-xl font-bold hidden md:table-cell"
            >
              Summary
            </TableCell>
            <TableCell
              colSpan={1}
              className="text-left text-lg font-bold md:hidden table-cell"
            >
              Summary
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={5} className="hidden md:table-cell" />
            <TableCell colSpan={3} className="md:hidden table-cell" />
            <TableCell className="text-left font-semibold  ">
              Total Price
            </TableCell>

            <TableCell className="text-left">
              ৳ {order.totalPrice.toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={5} className="hidden md:table-cell" />
            <TableCell colSpan={3} className="md:hidden table-cell" />
            <TableCell className="text-left font-semibold  ">
              Discount
            </TableCell>

            <TableCell className="text-left">
              ৳ {order.discount.toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={5} className="hidden md:table-cell" />
            <TableCell colSpan={3} className="md:hidden table-cell" />
            <TableCell className="text-left font-semibold  ">
              Delivery Charge
            </TableCell>

            <TableCell className="text-left">
              ৳ {order.deliveryCharge.toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={5} className="hidden md:table-cell" />
            <TableCell colSpan={3} className="md:hidden table-cell" />
            <TableCell className="text-left font-semibold  ">Paid</TableCell>

            <TableCell className="text-left">
              ৳ {order.paid.toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={5} className="hidden md:table-cell" />
            <TableCell colSpan={3} className="md:hidden table-cell" />
            <TableCell className="text-left font-semibold ">
              Due (Remaining)
            </TableCell>

            <TableCell className="text-left">
              ৳ {order.remaining.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;
