import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBlogForm } from "@/features/blog/providers/editor-provider";
import { BlogCategoryEnumArray } from "@/generated/enums";
import { X } from "lucide-react";
import { useCallback, useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";

const EditorMetadataTab = () => {
  const form = useBlogForm();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tags",
  });
  // For handling comma-separated tags input
  const [tagInput, setTagInput] = useState("");

  const handleTagInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "," || e.key === "Enter") {
        e.preventDefault();
        const value = tagInput.trim();
        if (value && !fields.find((field) => field.value === value)) {
          append({
            value,
          });
        }
        setTagInput("");
      } else if (e.key === "Backspace" && !tagInput) {
        // remove last tag
        const lastIndex = fields.length - 1;
        if (lastIndex >= 0) {
          remove(lastIndex);
        }
      }
    },
    [append, fields, remove, tagInput],
  );
  return (
    <>
      <div className="space-y-4 p-4">
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Title</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Blog Title"
              />
              <FieldDescription>
                Provide a concise title for your bug report.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
              <Input {...field} id={field.name} placeholder="blog-title-slug" />
              <FieldDescription>
                URL-friendly identifier (e.g. “my-post-title”)
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                placeholder="A brief description about the blog"
                rows={4}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="category"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Category</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  aria-invalid={fieldState.invalid}
                  className="w-full"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {BlogCategoryEnumArray.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="tags"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Tags</FieldLabel>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Enter tags, separated by comma"
              />
              {fields.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {fields.map((tag, index) => (
                    <Badge
                      key={index}
                      className="flex items-center space-x-1 cursor-pointer"
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      <span>{tag.value}</span>
                      <X className="size-4" />
                    </Badge>
                  ))}
                </div>
              )}
              <FieldDescription className="-mt-1!">
                Press comma or Enter to add a tag.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </>
  );
};

export default EditorMetadataTab;
