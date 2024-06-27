"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";

const Modal = ({ isOpen, onClose, cart, clearCart, session }: any) => {
  const [formData, setFormData] = useState<any>();
  const [phonenumber, setphonenumber] = useState("");
  const router = useRouter();

  const calculateTotalOrder = (products: any) => {
    return products.reduce((total: any, product: any) => {
      return total + product.price;
    }, 0);
  };

  const handleSubmit = async () => {
    const order_items = cart.map((product: any) => ({
      product_id: product.product_id.toString(),
      quantity: 1,
    }));

    for (let i = 0; i < cart.length; i++) {}

    //SUBMIT
    let data = {
      phone_number: parseInt(phonenumber, 10),
      order_items,
    };

    // TODO:GET SESSION

    try {
      const res = await fetch(
        "https://savanna.kops.b2msdk.online/api/v1/order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
            //   Authorization: `Bearer ${session.idToken}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        setphonenumber("");
        clearCart();
        onClose();

        router.refresh();
        toast("Successfully created order.Check Message.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Dialog open={isOpen}>
        {/* <DialogTrigger asChild>
        <Button variant="outline">Create Course</Button>
      </DialogTrigger> */}
        <DialogContent className="w-[80vw] h-[95%]">
          <DialogHeader className="mb-4">
            <DialogTitle>Order Now</DialogTitle>
            <DialogDescription>
              You will receive a text message after successfully placing an
              order.
            </DialogDescription>
          </DialogHeader>
          {/* Checkout section */}
          <ScrollArea className="w-full h-[60vh]">
            <div className="grid md:grid-cols-[2fr_1fr] gap-12 mb-8">
              <div className="space-y-8">
                {cart.map((c: any) => (
                  <div
                    key={c.product_id}
                    className="border rounded-lg p-6 space-y-4"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={c.image_url}
                        alt="Product Image"
                        width={80}
                        height={80}
                        className="rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{c.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">kshs {c.price}</p>
                        <div className="flex items-center gap-2 ml-8">
                          <Input
                            type="number"
                            defaultValue={1}
                            min={1}
                            className="w-16 text-center"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-muted/20 rounded-lg p-6 space-y-4">
                <h2 className="text-2xl font-bold">Order Summary</h2>
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>kshs {calculateTotalOrder(cart)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Shipping</p>
                  <p>kshs 0.00</p>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <p>Total</p>
                  <p>kshs {calculateTotalOrder(cart)}</p>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Phone_number */}
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="254-7xx-7xx-7xx"
            value={phonenumber}
            onChange={(e) => {
              setphonenumber(e.target.value);
            }}
            className="border border-slate-500"
          />
          <div className="flex justify-center">
            <Button variant={"outline"}>Cancel</Button>
            <Button onClick={handleSubmit}>Order</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Modal;
