<script lang="ts">
    let { data } = $props();

    console.log(data);
</script>

<article class="bg-white p-2 lg:rounded-lg lg:m-2">
    <h1 class="text-2xl font-bold px-4 py-2">{data.title}</h1>
</article>
