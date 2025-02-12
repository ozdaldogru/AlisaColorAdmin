"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";
import ImageUpload from "@/components/custom ui/ImageUpload";
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(
  () => import('jodit-react'),
  { ssr: false }
);

const formSchema = z.object({
  title: z.string().nonempty("Title is required"),
  status: z.string().nonempty("Status is required"),
  description: z.string().min(10, "Description must be at least 10 characters").trim(),
  collections: z.string().nonempty("Collection is required"),
  media: z.array(z.string()).nonempty("At least one image is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  expense: z.coerce.number().positive("Expense must be a positive number"),
});

interface ProductFormProps {
  initialData?: ProductType | null; // Must have "?" to make it optional
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? initialData
      : {
          title: "",
          status: "",
          description: "",
          collections: "",
          media: [],
          price: 0.1,
          expense: 0.1,
        },
  });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url = initialData ? `/api/products/${initialData._id}` : "/api/products";
      
      // Log the request data
      console.log("Submitting values:", values);
      
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      
      // Log the response status and data
      console.log("Response status:", res.status);
      const responseData = await res.json();
      console.log("Response data:", responseData);
      
      if (res.ok) {
        setLoading(false);
        toast.success(`Product ${initialData ? "updated" : "created"}`);
        router.push("/products");
      } else {
        toast.error(responseData.message || "Something went wrong! Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.log("[products_POST]", err);
      toast.error("Something went wrong! Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Product</p>
          <Delete id={initialData._id} item="product" />
        </div>
      ) : (
        <p className="text-heading2-bold">Create Product</p>
      )}
      <Separator className="bg-grey-1 mt-4 mb-7" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} onKeyDown={handleKeyPress} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            aria-label="Select A Status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" {...field}>
                    <option className="overflow-visible bg-white">Select A Status</option>
                    <option className="overflow-visible bg-white">Archived</option>
                    <option className="overflow-visible bg-white">On Sale</option>
                    <option className="overflow-visible bg-white">Pending</option>
                    <option className="overflow-visible bg-white">Sold Out</option>
                  </select>
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="collections"
            aria-label="Select A Collection"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collection</FormLabel>
                <FormControl>
                  <select className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" {...field}>
                    <option className="overflow-visible bg-white">Select A Collection</option>
                    <option className="overflow-visible bg-white">Crochets</option>
                    <option className="overflow-visible bg-white">Drawings</option>
                    <option className="overflow-visible bg-white">Jewelries</option>
                    <option className="overflow-visible bg-white">Painting</option>
                    <option className="overflow-visible bg-white">Tattoos</option>
                    <option className="overflow-visible bg-white">Wearables</option>
                    <option className="overflow-visible bg-white">Wood Burnings</option>
                  </select>
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            aria-label="Enter Price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Price" {...field} onKeyDown={handleKeyPress} />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expense"
            aria-label="Enter Expense"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expense ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Expense" {...field} onKeyDown={handleKeyPress} />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            aria-label="enter detailed description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <JoditEditor {...field} />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="media"
            aria-label="select images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={(url) => field.onChange([...field.value, url])}
                    onRemove={(url) =>
                      field.onChange([...field.value.filter((image) => image !== url)])
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />

<div className="flex gap-10">
         
         <Button type="submit" 
           className="bg-[#186a3b] text-white" 
           aria-label="click submit button">
           Submit
         </Button>
         <Button
           aria-label="click discard button"
           type="button"
           onClick={() => router.push("/products")}
           className="bg-[#cb4335] text-white"
         >
           Discard
         </Button>
       </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;