"use client";

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Plus, User } from 'lucide-react';
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
import { useContacts, ContactOption } from '@/hooks/use-contacts';

interface ContactDropdownProps {
  value?: string;
  onChange: (value: string, contact?: ContactOption) => void;
  placeholder?: string;
  allowCreate?: boolean;
  onCreateNew?: () => void;
  className?: string;
  contacts?: ContactOption[]; // Optional contacts prop to use instead of fetching
}

export function ContactDropdown({
  value,
  onChange,
  placeholder = "Select contact...",
  allowCreate = false,
  onCreateNew,
  className,
  contacts: propContacts
}: ContactDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { contacts: hookContacts, loading, error } = useContacts(searchTerm);

  // Use prop contacts if available, otherwise use hook contacts
  const contacts = propContacts || hookContacts;

  // Filter contacts based on search term if using hook contacts
  const filteredContacts = propContacts
    ? contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.position && contact.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contact.company?.name && contact.company.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : contacts;

  const selectedContact = filteredContacts.find((contact) => contact.id === value);

  const handleSelect = (contact: ContactOption) => {
    onChange(contact.id, contact);
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
          {selectedContact ? (
            <div className="flex items-center gap-2 text-left">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{selectedContact.name}</span>
                <span className="text-xs text-muted-foreground">{selectedContact.email}</span>
              </div>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search contacts..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>
              {propContacts ? null : loading ? (
                <div className="py-6 text-center text-sm">Loading contacts...</div>
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
                <div className="py-6 text-center text-sm">No contacts found.</div>
              )}
            </CommandEmpty>
            <CommandGroup>
              {filteredContacts.map((contact) => (
                <CommandItem
                  key={contact.id}
                  value={`${contact.name} ${contact.email}`}
                  onSelect={() => handleSelect(contact)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === contact.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{contact.name}</span>
                      <span className="text-xs text-muted-foreground">{contact.email}</span>
                      {contact.position && (
                        <span className="text-xs text-muted-foreground">{contact.position}</span>
                      )}
                      {contact.company && (
                        <span className="text-xs text-muted-foreground">{contact.company.name}</span>
                      )}
                    </div>
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