declare module 'tui-editor-svelte/Editor.svelte' {
  import { SvelteComponentTyped } from 'svelte';
  
  interface EditorProps {
    initialValue?: string;
    previewStyle?: string;
    height?: string;
    initialEditType?: string;
    usageStatistics?: boolean;
    [key: string]: any;
  }
  
  export default class Editor extends SvelteComponentTyped<EditorProps> {
    getInstance(): any;
  }
}

declare module 'tui-editor-svelte/Viewer.svelte' {
  import { SvelteComponentTyped } from 'svelte';
  
  interface ViewerProps {
    initialValue?: string;
    [key: string]: any;
  }
  
  export default class Viewer extends SvelteComponentTyped<ViewerProps> {}
}

declare module 'tui-editor-svelte' {
  export { default as Editor } from 'tui-editor-svelte/Editor.svelte';
  export { default as Viewer } from 'tui-editor-svelte/Viewer.svelte';
} 