<script lang="ts">
    import { md5 } from "js-md5";
    import { page } from "$app/stores";

    import {
        Banana,
        Beer,
        Ghost,
        IceCream,
        Pizza,
        Gamepad2,
        Bomb,
        Skull,
        Rocket,
        Coffee,
        Bug,
        Angry,
        Sandwich,
        Snowflake,
        ThumbsDown,
        Ham,
        CalendarRange,
    } from "lucide-svelte";

    const icons = [
        Banana,
        Beer,
        Ghost,
        IceCream,
        Pizza,
        Gamepad2,
        Bomb,
        Skull,
        Rocket,
        Coffee,
        Bug,
        Angry,
        Sandwich,
        Snowflake,
        ThumbsDown,
        Ham,
    ];

    // async function getRandomIcon(a: any, b: string) {
    //     const str = JSON.stringify({ ...a, slug: b });
    //     const msgBuffer = new TextEncoder().encode(str);
    //     const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
    //     const hashArray = Array.from(new Uint8Array(hashBuffer));
    //     const hash = hashArray
    //         .map((b) => b.toString(16).padStart(2, "0"))
    //         .join("");
    //     return icons[parseInt(hash.charAt(0), 16) % icons.length];
    // }

    let { data } = $props();
</script>

<ul
    class="grid grid-cols-1 gap-4 m-4
            sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
    {#each Object.keys(data.posts).slice(0, 9) as slug}
        {@const Icon =
            icons[
                md5(
                    JSON.stringify({
                        ...data.posts[slug],
                        slug,
                    }),
                )
                    .split("")
                    .reduce((acc, char) => {
                        return acc + parseInt(char, 16);
                    }, 0) % icons.length
            ]}
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
                            <!-- {@const Icon = getRandomIcon(data.posts[slug], slug)} -->
                            <Icon class="w-10 h-10" />
                        </span>
                    </div>
                {/if}
                <div class="px-4 py-2 flex flex-col">
                    <h2 class="text-lg font-bold">{data.posts[slug].title}</h2>
                    <p class="text-xs flex items-center gap-1 h-5">
                        <CalendarRange class="w-4 h-4 text-gray-400" />
                        {data.posts[slug].date.replace(/:\d\d(\.\d+)?Z?$/, "")}
                    </p>
                </div>
            </a>
        </li>
    {/each}
</ul>
