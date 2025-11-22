import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useBlogForm,
  useEditorTab,
} from "@/features/blog/providers/editor-provider";
import { useIsUpdatingPost } from "@/features/blog/providers/post-to-edit-provider";
import { BlogCategoryEnumArray } from "@/generated/enums";
import { makeSlug } from "@/lib/utils";
import clsx from "clsx";
import { X } from "lucide-react";
import { useCallback, useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { ImageCropDialog } from "../../misc/image-crop-dialog";
import { ImageDropzone } from "../../misc/image-drop-zone";

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

  const handleTagInputPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault(); // prevent default paste behavior
      // Get pasted text
      const pastedText = e.clipboardData.getData("text");
      if (!pastedText) return;
      // Split pasted text by comma or newline (tweak as needed)
      const newTags = pastedText
        .split(/[\n,]+/)
        .map((t) => t.trim())
        .filter(
          (t) => t && !fields.find((field) => field.value === t), // avoid duplicates
        );
      // Append each new tag
      newTags.forEach((value) => append({ value }));
      // Optionally clear input
      setTagInput("");
    },
    [append, fields],
  );

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  const handleFileAccepted = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageSrc(e.target.result as string);
        setCropOpen(true);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCropComplete = useCallback(
    (croppedImage: string) => {
      form.setValue("coverImage", croppedImage);
      setImageSrc(null);
    },
    [form],
  );

  const isUpdatingPost = useIsUpdatingPost();

  const { setActiveTab, activeTab } = useEditorTab();
  return (
    <>
      <div className="space-y-4 p-4">
        <Controller
          name="status"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              {/*<FieldLabel htmlFor={field.name}>Title</FieldLabel>*/}
              <div className="flex w-full items-center justify-between">
                <span
                  className={clsx(
                    "text-sm font-medium transition-colors",
                    field.value === "drafted"
                      ? "text-muted-foreground"
                      : "text-foreground",
                  )}
                >
                  Draft
                </span>

                <Switch
                  checked={field.value === "published"}
                  onCheckedChange={() =>
                    field.onChange(
                      field.value === "published" ? "drafted" : "published",
                    )
                  }
                />

                <span
                  className={clsx(
                    "text-sm font-medium transition-colors",
                    field.value === "published"
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  Publish
                </span>
              </div>

              <FieldDescription>
                Choose whether this post is published or saved as a draft.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Title</FieldLabel>
              <Input
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  form.setValue("slug", makeSlug(e.currentTarget.value));
                }}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Blog Title"
              />
              <FieldDescription>
                Provide a concise title for your blog post.
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
              <FieldDescription>
                Select the category that best fits your post.
              </FieldDescription>
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
                onPaste={handleTagInputPaste}
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
        {/* Cover Image Field */}
        <Controller
          name="coverImage"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Cover Image</FieldLabel>
              <ImageDropzone
                onFileAccepted={handleFileAccepted}
                aspectRatio={16 / 9}
                imageSrc={field.value}
              />
              <FieldDescription>
                Upload a 16:9 cover image for your post.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* Crop Dialog */}
        {imageSrc && (
          <ImageCropDialog
            open={cropOpen}
            onOpenChange={setCropOpen}
            imageSrc={imageSrc}
            onCropComplete={handleCropComplete}
            aspectRatio={16 / 9}
          />
        )}
        <div className="flex flex-col gap-2">
          <Button type="submit" className="w-full">
            {isUpdatingPost ? "Update" : "Save"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => {
              setActiveTab(activeTab === "preview" ? "edit" : "preview");
            }}
          >
            {activeTab === "preview" ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditorMetadataTab;
