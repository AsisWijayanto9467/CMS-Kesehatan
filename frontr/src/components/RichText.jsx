import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function RichText({value, onChange}) {
  const editorRef = useRef(null);

  return (
    <>
      <Editor
        apiKey='0tuu0fmfmbta20o5tif2lguyxrsa8ax9wxuk1pzs560wnbez'
        onInit={(_evt, editor) => (editorRef.current = editor)}
        value = {value}
        onEditorChange={(content) => onChange(content)}
        init={{
          height: 300,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </>
  );
}
