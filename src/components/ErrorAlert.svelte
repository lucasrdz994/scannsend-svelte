<script>
  import { Dialog, Card, CardTitle, CardSubtitle, CardActions, Button } from 'svelte-materialify';
  import { createEventDispatcher } from 'svelte';

  export let active;
  export let errorMessage;

  const dispatch = createEventDispatcher();

  const close = () => dispatch('close');
</script>


<Dialog bind:active persistent>
  <Card>
    <CardTitle>Hubo un error!</CardTitle>
    <CardSubtitle>{errorMessage}</CardSubtitle>
    <CardActions>
      <div style="flex-grow:1" />
      <Button class="primary-text" on:click={close} text>Ok</Button>
    </CardActions>
  </Card>
</Dialog>