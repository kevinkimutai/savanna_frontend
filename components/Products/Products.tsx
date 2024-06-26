"use client";

import React, { useCallback, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { debounce } from "lodash";
import useOrderModal from "@/hooks/useOrderModal";
import Modal from "../Modal/Modal";
import Image from "next/image";
import useDebouncedCallback from "@/hooks/useDebounce";

const Products = ({ products, session }: any) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useOrderModal();

  let currentQuery = {};

  if (searchParams) {
    currentQuery = qs.parse(searchParams.toString());
  }

  const querySearchHandler = (label: string) => {
    const updatedQuery = {
      ...currentQuery,
      search: label,
    };

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  const debouncedQueryHandler = useDebouncedCallback(querySearchHandler, 300);

  const queryPageHandler = (label: string) => {
    const updatedQuery = {
      ...currentQuery,
      page: label,
    };

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  let elements = [];

  for (let i = 0; i < products.number_of_pages; i++) {
    elements.push(
      <Button
        key={i}
        className="rounded-2xl p-4 m-4"
        onClick={(e) => {
          queryPageHandler((i + 1).toString());
        }}
      >
        {i + 1}
      </Button>
    );
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);

  const addToCart = (product: any) => {
    setCart((prevState: any) => {
      // Check if the product already exists in the cart
      const productExists = prevState.some(
        (item: any) => item.product_id === product.product_id
      );

      if (productExists) {
        return prevState;
      } else {
        return [product, ...prevState];
      }
    });
  };

  const clearCart = () => {
    setCart([]);
  };
  return (
    <>
      <section className="w-full flex flex-col justify-center items-center  py-8 md:py-16 lg:py-24">
        <div className="relative py-8 w-3/4 md:w-1/2 lg:w-1/3">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedQueryHandler(e.target.value);
            }}
            // setSearchTerm(e.target.value)}
            className="pr-8"
          />
          <SearchIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-6">
          {products?.data?.map((product: any) => (
            <div
              key={product.product_id}
              className="flex flex-col items-center space-y-2 hover:scale-105 cursor-pointer"
            >
              <Image
                src={product.image_url}
                width="300"
                height="300"
                alt="Product"
                className="aspect-square overflow-hidden rounded-xl object-cover object-center"
              />
              <h3 className="text-lg font-medium">{product.name}</h3>
              <p className="text-muted-foreground mb-8">kshs {product.price}</p>

              <Button
                onClick={() => {
                  addToCart(product);
                }}
              >
                Add To Cart
              </Button>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex mt-8">{elements}</div>

        <Button
          className="p-4 mt-4 text-md"
          variant={"outline"}
          onClick={onOpen}
        >
          <span className="text-2xl"></span>Order Now
          <span className=" text-red-700 ml-4">{cart.length}</span>{" "}
        </Button>
      </section>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          cart={cart}
          clearCart={clearCart}
          session={session}
        />
      )}
    </>
  );
};

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
export default Products;
