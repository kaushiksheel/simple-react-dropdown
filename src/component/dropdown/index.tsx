import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { List } from "./List";
import { twMerge } from "tailwind-merge";

type Props = {
  list?: string[];
  defaultValue?: string;
  getSelectedValue?: (selectedValue: string) => void;
  isSearchable?: boolean;
  placeholder?: string;
  className?: string;
};

export const Dropdown = ({
  list,
  defaultValue,
  getSelectedValue,
  isSearchable = true,
  placeholder = "No match found",
  className,
}: Props) => {
  const [query, setQuery] = useState(defaultValue || "");
  const [openList, setOpenList] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value);
  };

  const filteredList = list
    ? list?.filter((item) => {
        if (query !== "") {
          return item.toLowerCase().includes(query.toLowerCase());
        } else {
          return item;
        }
      })
    : [""];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as unknown as Node)
      ) {
        setOpenList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      onClick={() => setOpenList(!openList)}
      className={`${twMerge("w-full relative border rounded-md ", className)}`}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={openList}
    >
      <div className="flex items-center w-full p-2">
        {isSearchable ? (
          <input
            type="text"
            className="w-full h-full focus:outline-none cursor-default"
            value={query}
            onChange={handleChange}
            aria-autocomplete="list"
            placeholder="Select"
          />
        ) : (
          <p className="w-full h-full focus:outline-none cursor-default">
            {query}
          </p>
        )}
        <ChevronDownIcon
          className={`w-5 h-5 ${
            openList && "rotate-180"
          } transition-all ease-linear`}
        />
      </div>
      {openList && (
        <List
          filteredList={isSearchable ? filteredList : list}
          setQuery={setQuery}
          getSelectedValue={getSelectedValue}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};
