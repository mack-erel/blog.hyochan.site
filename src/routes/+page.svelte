<script lang="ts">
    import { Ham, CalendarRange } from "lucide-svelte";
    let { data } = $props();
</script>

<ul
    class="grid grid-cols-1 gap-4 m-4
            sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
    {#each Object.keys(data.posts).slice(0, 9) as slug}
        <li class="rounded-lg overflow-hidden bg-white">
            <a
                href={`/${data.posts[slug].date.split(" ")[0].replace(/-/g, "/")}/${slug}`}>
                {#if data.posts[slug].thumbnail}
                    <div class="aspect-video">
                        <img
                            src={data.posts[slug].thumbnail}
                            alt={data.posts[slug].title}
                            class="w-full h-full object-cover" />
                    </div>
                {:else}
                    <div
                        class="aspect-video bg-gray-200 flex justify-center items-center">
                        <span class="text-4xl text-gray-400">
                            <Ham class="w-10 h-10" />
                        </span>
                    </div>
                {/if}
                <div class="px-4 py-2 flex flex-col">
                    <h2 class="text-lg font-bold">{data.posts[slug].title}</h2>
                    <p class="text-xs flex items-center gap-1 h-5">
                        <CalendarRange class="w-4 h-4 text-gray-400" />
                        {data.posts[slug].date.split(" ")[0]}
                    </p>
                </div>
            </a>
        </li>
    {/each}
</ul>
