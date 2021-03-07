<script>
  import { MaterialApp, Container, Card, CardTitle, CardSubtitle, Chip, Icon } from 'svelte-materialify';
  import { querystring } from 'svelte-spa-router'
  import { mdiPlus } from '@mdi/js';
  import { onMount } from 'svelte';
  import { getMeliAccounts, linkNewMeliAccount } from '../utils/user';
  import { user } from '../stores/user';

  // Get meli accounts from user
  let meliAccountsPromise = getMeliAccounts($user.uid);
  
  // Link new meli account action
  function linkMeliAccount() {
    window.location.href = "https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=7167039500463579&redirect_uri=https://scannsend-707df.web.app/panel/settings";
  }

  // Check new meli account code
  onMount(async () => {
    if ($querystring) {
      const userData = await linkNewMeliAccount($querystring);
      console.log(userData)
    }
  })

</script>

<MaterialApp>
  <Container>
    <Card class="mb-4">
      <CardTitle>Cuentas de MercadoLibre</CardTitle>
      <CardSubtitle>Inicia sesión en tu cuenta de MercadoLibre antes de vincularla con Scannsend.</CardSubtitle>
      <div class="pa-4">
        {#await meliAccountsPromise}
          <p>Cargando cuentas...</p>
        {:then accounts}
          {#each accounts as account}
            <Chip close class="mr-4">
              {account.data.nickname}
            </Chip>
          {/each}
          <Chip class="primary-text" outlined link on:click={linkMeliAccount}>
            <Icon path={mdiPlus} />
            <span>Agregar nueva</span>
          </Chip>
        {/await}
      </div>
    </Card>
    <Card>
      <CardTitle>Mensaje automático</CardTitle>
      <CardSubtitle>Crea un mensaje personalizado para enviar a tus clientes al momento de escanear los paquetes.</CardSubtitle>
    </Card>
  </Container>
</MaterialApp>