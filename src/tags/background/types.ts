export interface RemoteTagsInterface {
    addTagToExistingUrl(args: { tag: string; url: string }): Promise<void>
    addTagToPage(args: {
        tag: string
        url: string
        tabId?: number
    }): Promise<void>
    delTag(args: { tag: string; url: string }): Promise<void>
    fetchPageTags(args: { url: string }): Promise<string[]>

    addTagsToOpenTabs(args: {
        name: string
        tabs?: TagTab[]
        time?: number
    }): Promise<void>
    delTagsFromOpenTabs(args: { name: string; tabs?: TagTab[] }): Promise<void>
    searchForTagSuggestions(args: {
        query: string
        limit?: number
    }): Promise<string[]>
    fetchInitialTagSuggestions(): Promise<string[]>
    updateTagForPage(args: {
        added: string
        deleted: string
        url: string
        skipPageIndexing?: boolean
    }): Promise<void>
    updateTagForPageInCurrentTab(args: {
        added: string
        deleted: string
        url: string
        tabId?: number
    }): Promise<void>
    setTagsForAnnotation(args: { url: string; tags: string[] }): Promise<void>
}

export interface TagTab {
    tabId: number
    url: string
}

export interface TagsSettings {
    suggestions?: string[]
}
