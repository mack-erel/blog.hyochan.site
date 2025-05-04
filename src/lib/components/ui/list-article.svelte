<script>
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

    let { post } = $props();

    const Icon = icons[parseInt(post.uid.slice(0, 1), 16)];

    let date = new Date(post.date);
    let formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    let formattedTime = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
</script>

<a class="flex text-left bg-white rounded-lg" href={`/${post.permalink}`}>
    <section class="w-40 flex items-center justify-center shrink-0 grow-0">
        {#if post.thumbnail}
            <img src={post.thumbnail} alt={post.withOutSeries} />
        {:else}
            <span
                class="bg-gray-100 w-full h-full flex items-center justify-center rounded-s-lg">
                <Icon class="text-gray-400" />
            </span>
        {/if}
    </section>
    <section class="flex flex-col p-4">
        <span class="text-xs block">{post.category.join(" > ")}</span>
        {#if post.series}
            <span class="text-xs block">{post.series} #{post.seriesIndex}</span>
        {/if}
        <h2 class="text-xl font-bold block">{post.withOutSeries}</h2>
        <span class="text-xs block">{formattedDate} {formattedTime}</span>
    </section>
</a>
