<script lang="ts">
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
    import { onMount } from "svelte";

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

    let { post } = $props();

    const Icon = icons[parseInt(post.uid.slice(0, 1), 16)];

    let date = new Date(post.date);
    let now = new Date();
    let formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    let formattedTime = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

    let displayDate = $state(formattedDate + " " + formattedTime);

    function getDisplayDate(dateString: string) {
        let date = new Date(dateString);
        let now = new Date();
        let diff = Math.floor((now.getTime() - date.getTime()) / 1000);
        let formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        let formattedTime = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
        if (diff < 60) {
            return `${diff}초 전`;
        } else if (diff < 3600) {
            return `${Math.floor(diff / 60)}분 전`;
        } else if (diff < 36 * 3600) {
            return `${Math.floor(diff / 3600)}시간 전`;
        } else {
            return `${formattedDate} ${formattedTime}`;
        }
    }

    onMount(() => {
        displayDate = getDisplayDate(post.date);
    });
</script>

<a
    class="flex text-left bg-white rounded-lg mx-2 flex-col
           sm:flex-row"
    href={`/${post.permalink}`}>
    <section
        class="w-full flex items-center justify-center shrink-0 grow-0 aspect-video
               sm:aspect-auto sm:w-48">
        {#if post.thumbnail}
            <img src={post.thumbnail} alt={post.withOutSeries} />
        {:else}
            <span
                class="bg-gray-100 w-full h-full flex items-center justify-center rounded-t-lg
                       sm:!rounded-s-lg sm:rounded-t-none">
                <Icon
                    class="text-gray-400 w-20 h-20
                           sm:w-10 sm:h-10" />
            </span>
        {/if}
    </section>
    <section class="flex flex-col px-6 py-4 min-w-0">
        <span class="text-xs block">{post.category.join(" > ")}</span>
        {#if post.series}
            <span class="text-base block font-semibold text-gray-500">
                {post.series} #{post.seriesIndex}
            </span>
        {/if}
        <h2 class="text-xl font-bold block truncate w-full">
            {post.withOutSeries}
        </h2>
        <h3 class="text-sm text-gray-500 two-line-truncate">
            {post.description}
        </h3>
        <span class="text-xs block mt-3">{displayDate}</span>
    </section>
</a>

<style>
    .two-line-truncate {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
