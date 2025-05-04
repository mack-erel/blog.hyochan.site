<script>
    import ListArticle from "$lib/components/ui/list-article.svelte";

    let { data } = $props();
</script>

<section class="flex flex-col gap-8">
    {#each data.posts as post}
        <ListArticle {post} />
    {/each}
</section>
