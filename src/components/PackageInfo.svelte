<script>
  import { Dialog, Card, CardTitle, CardSubtitle, CardText, CardActions, Button } from 'svelte-materialify';
  import { createEventDispatcher } from 'svelte';

  import { deleteShipment } from '../utils/shipments';

  export let active;
  export let packageDetails;

  const dispatch = createEventDispatcher();

  const close = () => dispatch('close');

  async function deleteItem() {
    const response = await deleteShipment(packageDetails.uid);
    if (response.status === 'ok') {
      close();
    }
  }
</script>

<Dialog bind:active persistent>
  <Card>
    <CardTitle>Paquete de {packageDetails.buyer.name}</CardTitle>
    <CardSubtitle>Orden: # {packageDetails.orderId}</CardSubtitle>
    <CardText>
      No se detectó ningún problema con este envío. Podés entregarlo en {packageDetails.buyer.fullAddress}.
    </CardText>
    <CardActions>
      <div style="flex-grow:1" />
      <Button text on:click={close}>Cerrar</Button>
      <Button text class="red-text" on:click={deleteItem}>Eliminar</Button>
    </CardActions>
  </Card>
</Dialog>