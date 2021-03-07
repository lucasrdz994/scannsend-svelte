<script>
  import { Card, CardTitle } from 'svelte-materialify';
  export let account;
  export let packages;

  let counter;

  $: counter = packages.filter(item => item.seller.id === account.data.sellerId).length;
</script>

<Card class="mb-8">
  <CardTitle class="justify-space-between">
      <span>{account.data.nickname} - {account.data.sellerId}</span>
      <span>{counter}</span>
  </CardTitle>
</Card>
