"use client";

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCompanies } from '@/hooks/use-companies';
import { Company } from '@/types';

interface CompanyDropdownProps {
  value?: string;
  onChange: (value: string, company?: Company) => void;
  placeholder?: string;
  allowCreate?: boolean;
  onCreateNew?: () => void;
  className?: string;
}

export function CompanyDropdown({
  value,
  onChange,
  placeholder = "Select company...",
  allowCreate = false,
  onCreateNew,
  className
}: CompanyDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { companies, loading, error } = useCompanies(searchTerm);

  const selectedCompany = companies.find((company) => company.id === value);

  const handleSelect = (company: Company) => {
    onChange(company.id, company);
    setOpen(false);
    setSearchTerm('');
  };

  const handleCreateNew = () => {
    setOpen(false);
    setSearchTerm('');
    onCreateNew?.();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedCompany ? selectedCompany.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search companies..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? (
                <div className="py-6 text-center text-sm">Loading companies...</div>
              ) : error ? (
                <div className="py-6 text-center text-sm text-red-500">{error}</div>
              ) : searchTerm && allowCreate ? (
                <div className="py-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleCreateNew}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create "{searchTerm}"
                  </Button>
                </div>
              ) : (
                <div className="py-6 text-center text-sm">No companies found.</div>
              )}
            </CommandEmpty>
            <CommandGroup>
              {companies.map((company) => (
                <CommandItem
                  key={company.id}
                  value={company.name}
                  onSelect={() => handleSelect(company)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === company.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{company.name}</span>
                    {company.industry && (
                      <span className="text-xs text-muted-foreground">
                        {company.industry}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}