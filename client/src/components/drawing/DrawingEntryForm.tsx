import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { X } from "lucide-react";
import { DrawingEntryFormData } from "@/lib/types";
import { ContextDrawingEntry } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  drawingTitle: z.string().min(1, "Drawing title is required"),
  drawingDescription: z.string().optional(),
  deadline: z.string().optional(),
  amount: z.string().min(1, "Amount is required").regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  completed: z.boolean().optional(),
  favorite: z.boolean().optional(),
});

interface DrawingEntryFormProps {
  entry?: ContextDrawingEntry | null;
  onSave: (data: DrawingEntryFormData) => void;
  onCancel: () => void;
}

export function DrawingEntryForm({ entry, onSave, onCancel }: DrawingEntryFormProps) {
  const [isEdit, setIsEdit] = useState(false);
  
  useEffect(() => {
    setIsEdit(!!entry);
  }, [entry]);
  
  const defaultValues: DrawingEntryFormData = {
    clientName: entry?.clientName || "",
    drawingTitle: entry?.drawingTitle || "",
    drawingDescription: entry?.drawingDescription || "",
    deadline: entry?.deadline ? format(new Date(entry.deadline), 'yyyy-MM-dd') : "",
    amount: entry?.amount || "",
    completed: entry?.completed || false,
    favorite: entry?.favorite || false,
  };
  
  const form = useForm<DrawingEntryFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  const onSubmit = (data: DrawingEntryFormData) => {
    onSave(data);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEdit ? "Edit Drawing Entry" : "New Drawing Entry"}
            </h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter client name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="drawingTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drawing Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter drawing title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="drawingDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drawing Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter drawing description" rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" step="0.01" placeholder="0.00" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {isEdit && (
                <FormField
                  control={form.control}
                  name="completed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-1">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Mark as completed</FormLabel>
                    </FormItem>
                  )}
                />
              )}
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
