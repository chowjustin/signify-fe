"use client";
import api from "@/lib/api";
import { cn } from "@nextui-org/theme";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import useAuthStore from "@/app/stores/useAuthStore";

export type SelectableInputProps = {
  id: string;
  title: string;
  errorMessage: string;
  defaultValue?: string;
  className?: string;
};

const SelectableInput: React.FC<SelectableInputProps> = ({
  id,
  title,
  errorMessage,
  defaultValue,
  className,
}) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(
    defaultValue || null,
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user } = useAuthStore();

  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { data, isLoading, error } = useQuery({
    queryKey: ["cabang"],
    queryFn: async () => {
      const response = await api.get("/users/all");
      return response.data.data;
    },
  });

  const filteredData = data?.filter(
    (item: string) =>
      item.toLowerCase().includes(searchTerm.toLowerCase()) &&
      item.toLowerCase() !== user?.username.toLowerCase(),
  );

  useEffect(() => {
    setValue(id, selectedSize);
  }, [selectedSize, setValue, id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;

  return (
    <>
      <div className="relative w-full min-w-[9rem]" ref={dropdownRef}>
        {/* Search Input Button */}
        <div className="">
          <input
            type="text"
            placeholder={selectedSize || title}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "w-full mt-2 inline-flex items-center gap-x-2 text-sm rounded-[15px]",
              "h-full w-full rounded-[15px] border border-[#E2E8F0] px-[20px] py-[15px] caret-[#4FD1C5]",
              "focus:outline-1 focus:outline-[#4FD1C5] focus:ring-inset",
              "text-sm focus:bg-slate-50",
              "hover:ring-1 hover:ring-inset hover:ring-[#4FD1C5]",
              "placeholder:text-sm placeholder:text-gray-500",
              "text-gray-900",
              selectedSize && "placeholder:text-gray-900",
              errors[id] &&
                "border-none ring-2 ring-inset ring-red-500 placeholder:text-gray-500 focus:ring-red-500 mb-2",
              `${className}`,
            )}
            aria-label="Dropdown Search"
          />
        </div>

        {/* Options List */}
        {searchTerm && filteredData?.length > 0 && (
          <div
            className="absolute z-50 w-full bg-white shadow-md rounded-lg p-1 space-y-0.5 max-h-40 custom-scrollbar overflow-y-auto"
            role="menu"
            aria-orientation="vertical"
          >
            {filteredData.map((username: string, id: number) => (
              <p
                key={id}
                className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-900 focus:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                onClick={() => {
                  setSelectedSize(username);
                  setSearchTerm("");
                }}
              >
                {username}
              </p>
            ))}
          </div>
        )}

        {/* No Results Found */}
        {searchTerm && filteredData?.length === 0 && (
          <p className="absolute z-50 mt-2 w-full bg-white shadow-md rounded-lg p-2 text-sm text-gray-500">
            No results found
          </p>
        )}
      </div>

      {/* Hidden Input Field for Form Registration */}
      <input
        type="hidden"
        {...register(id, {
          required: `${title} is required`,
        })}
        value={selectedSize || ""}
      />

      {errors[id] && (
        <ErrorMessage className="-mt-4">{errorMessage}</ErrorMessage>
      )}
    </>
  );
};

export default SelectableInput;
