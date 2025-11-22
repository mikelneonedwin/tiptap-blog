"use client";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutationState } from "@tanstack/react-query";
import type { Editor } from "@tiptap/core";
import {
  useEditor as useEditorHook,
  useEditorState as useEditorStateHook,
} from "@tiptap/react";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  FormProvider,
  useForm,
  useWatch,
  type UseFormReturn,
} from "react-hook-form";
import { toast } from "sonner";
import { DELETE_BLOG_POST_MUTATION_KEY } from "../constants";
import { blogEditorExtensions } from "../editor-extensions";
import {
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
} from "../mutations";
import {
  blogFormSchema,
  type BlogFormInput,
  type BlogFormOutput,
} from "../schemas";
import { usePostToUpdate } from "./post-to-edit-provider";

type Tab = "edit" | "preview";

type EditorContextType = {
  editor: Editor;
  activeTab: Tab;
  setActiveTab: Dispatch<SetStateAction<Tab>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<BlogFormInput, any, BlogFormOutput>;
};

const EditorContext = createContext<EditorContextType | null>(null);

export function useEditorContext() {
  const ctx = useContext(EditorContext);
  if (!ctx)
    throw new Error("useEditorContext should be used in an EditorProvider");
  return ctx;
}

/**
 * Hook to access the Tiptap Editor instance from context.
 * Must be used within the EditorProvider.
 */
export function useEditor() {
  const ctx = useEditorContext();
  return useMemo(() => ctx.editor, [ctx.editor]);
}

/**
 * Hook to select specific parts of the editor state, triggering
 * re-renders only when the selected state changes.
 * @param selectorFn A function that receives context and returns the desired state.
 * @returns The selected state.
 */
export function useEditorState<T>(
  selectorFn: (ctx: { editor: Editor }) => T,
): T {
  const editor = useEditor();
  return useEditorStateHook({
    editor,
    selector: selectorFn,
  });
}

export function useEditorTab() {
  const ctx = useEditorContext();
  return useMemo(
    () => ({
      activeTab: ctx.activeTab,
      setActiveTab: ctx.setActiveTab,
    }),
    [ctx.activeTab, ctx.setActiveTab],
  );
}

export function useBlogForm() {
  const ctx = useEditorContext();
  return useMemo(() => ctx.form, [ctx.form]);
}

const EditorProvider = ({ children }: { children: ReactNode }) => {
  const postToUpdate = usePostToUpdate();
  const form = useForm<
    BlogFormInput,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    BlogFormOutput
  >({
    resolver: zodResolver(blogFormSchema),
    defaultValues: postToUpdate ?? {
      category: "Company",
      content: "Let's get started...",
      coverImage: "",
      description: "",
      slug: "",
      status: "drafted",
      tags: [],
      title: "",
    },
  });
  const content = useWatch({
    control: form.control,
    name: "content",
  });

  const editor = useEditorHook({
    extensions: blogEditorExtensions,
    content: content,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    onUpdate: ({ editor }) => form.setValue("content", editor.getHTML()),
  });

  const createMutation = useCreateBlogPostMutation();
  const updateMutation = useUpdateBlogPostMutation();

  const isDeletingPost = useMutationState({
    // this mutation key needs to match the mutation key of the given mutation (see above)
    filters: { mutationKey: DELETE_BLOG_POST_MUTATION_KEY },
    select: (mutation) => mutation.state.status === "pending",
  });

  function onSubmit(values: BlogFormOutput) {
    if (postToUpdate) {
      updateMutation.mutate({
        ...values,
        id: postToUpdate.id,
      });
    } else {
      createMutation.mutate(values);
    }
  }

  const isPending = useMemo(() => {
    const booleans = [
      createMutation.isPending,
      updateMutation.isPending,
      ...isDeletingPost,
    ];
    return booleans.some((boolean) => boolean);
  }, [createMutation.isPending, isDeletingPost, updateMutation.isPending]);

  const [activeTab, setActiveTab] = useState<Tab>("edit");

  if (!editor)
    return (
      <div className="flex items-center h-svh justify-center">
        <Empty className="min-h-[200px] flex flex-col justify-center items-center">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Spinner />
            </EmptyMedia>
            <EmptyTitle>Loading Editor...</EmptyTitle>
            <EmptyDescription>
              Please wait while we initialize your editor.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );

  return (
    <FormProvider {...form}>
      <EditorContext.Provider value={{ editor, activeTab, setActiveTab, form }}>
        {/* TODO ON SUBMIT */}
        <form
          onSubmit={form.handleSubmit(
            (values) => onSubmit(values),
            () =>
              toast.error("Oops, something's wrong", {
                description: "Please ensure you've filled the necessary fields",
              }),
          )}
        >
          {/* TODO GLOBAL FORM DISABLING */}
          <fieldset disabled={isPending}>{children}</fieldset>
        </form>
      </EditorContext.Provider>
    </FormProvider>
  );
};

export default EditorProvider;
