<script>
  import { MaterialApp, Container, Card, CardTitle, Row, Col, TextField, List, ListItem, Button, Alert } from 'svelte-materialify';
  import { user } from '../stores/user';
  import { shipments } from '../stores/shipments';
  import { report } from '../stores/report';
  import { getMeliAccounts } from '../utils/user';
  import { validateQr } from '../utils/shipments';

  // Components
  import PackagesCard from '../components/PackagesCard.svelte';
  import ErrorAlert from '../components/ErrorAlert.svelte';
  import PackageInfo from '../components/PackageInfo.svelte';

  // Get meli accounts from user
  let meliAccountsPromise = getMeliAccounts($user.uid);

  let packageDialog = false;
  let packageDetails = '';
  let error = false;
  let errorMessage = '';
  let value = '';
  let filteredShipments = [];
  let filterInput = '';

  async function handleQrInput(e) {
    if(e.code === 'Backslash' || e.code === 'Enter') {
      const qrObj = JSON.parse(value);
      value = '';
      const response = await validateQr(qrObj, $shipments)
      console.log(response)
      if (response.status === 'error') {
        errorMessage = response.message;
        error = true;
        return console.log('envio dup')
      }
      shipments.add(response.shipping)
    }
  }

  function scannedPackagesActions(item) {
    packageDetails = item;
    packageDialog = true;
  }
  
  function addToReport() {
  // Agrego al reporte, tengo que crear un nuevo store
    report.addAll($shipments);
  }

  function handleFilter() {
    filteredShipments = $shipments.filter(item => {
      if (
        item.buyer.name.toLowerCase().includes(filterInput.toLowerCase()) ||
        item.buyer.fullAddress.toLowerCase().includes(filterInput.toLowerCase()) ||
        item.orderId.toString().includes(filterInput) ||
        item.id.toString().includes(filterInput)
      ) {
        return true
      }
    });
  }

  $: filteredShipments = $shipments;

  // {"id":40293573908, "sellerId": 156168198}

</script>

<MaterialApp>
  <Container>
    <h1 class="text-h4 mb-8">Escaneá tus paquetes de Flex</h1>
    <TextField placeholder="Código Qr" on:keyup={handleQrInput} bind:value />
    <Row>
      <Col cols={8}>
        {#await meliAccountsPromise}
          <p>Cargando...</p>
        {:then accounts}
          {#each accounts as account (account.data.sellerId)}
            <PackagesCard {account} packages={$shipments} />
          {/each}
        {/await}
      </Col>
      <Col cols={4}>
        <Card outlined>
          <CardTitle>Paquetes escaneados</CardTitle>
          <div class="pa-4">
            <Button on:click={addToReport} text>Agregar todo al reporte</Button>
          </div>
          <List style="height: 100vh; overflow-y: auto;">
            {#if $shipments.length}
              <div class="pa-4">
                <TextField bind:value={filterInput} on:keyup={handleFilter} placeholder="Por comprador, dirección, # de orden o # de envío.">
                  Filtrar resultados
                </TextField>
              </div>
              {#each filteredShipments as item (item.id)}
                <ListItem on:click={scannedPackagesActions(item)}>
                  <span>{item.buyer.name}</span>
                </ListItem>
              {/each}
            {:else}
              <div class="pa-4">
                <Alert class="indigo white-text" border="left">
                  Todavía no escaneaste ningún paquete.
                </Alert>
              </div>
            {/if}
          </List>
        </Card>
      </Col>
    </Row>
  </Container>
  <ErrorAlert bind:active={error} {errorMessage} on:close={() => error = false} />
  <PackageInfo bind:active={packageDialog} {packageDetails} on:close={() => packageDialog = false} />
</MaterialApp>