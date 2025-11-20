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
import { blogEditorExtensions } from "../editor-extensions";
import {
  newBlogSchema,
  type BlogFormInput,
  type BlogFormOutput,
} from "../schemas";

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
  const form = useForm<
    BlogFormInput,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    BlogFormOutput
  >({
    resolver: zodResolver(newBlogSchema),
    defaultValues: {
      category: "Company",
      content: "Write your post here...",
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

  const [activeTab, setActiveTab] = useState<Tab>("edit");

  if (!editor)
    return (
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
    );

  return (
    <FormProvider {...form}>
      <EditorContext.Provider value={{ editor, activeTab, setActiveTab, form }}>
        {/* TODO ON SUBMIT */}
        <form>
          {/* TODO GLOBAL FORM DISABLING */}
          <fieldset>{children}</fieldset>
        </form>
      </EditorContext.Provider>
    </FormProvider>
  );
};

export default EditorProvider;
